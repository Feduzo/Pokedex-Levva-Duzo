#!/usr/bin/env node
// Prepara e roda o projeto em Windows, macOS e Linux.
//   node scripts/run.mjs start   -> build do frontend + backend servindo tudo em :8000
//   node scripts/run.mjs dev     -> backend com reload (:8000) + Vite (:5173)
//   node scripts/run.mjs test    -> testes do backend (pytest)
import { spawn, spawnSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync, copyFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import process from "node:process"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const backend = join(root, "backend")
const frontend = join(root, "frontend")
const envFile = join(backend, ".env")
const isWin = process.platform === "win32"
const venvPython = join(backend, "venv", isWin ? "Scripts/python.exe" : "bin/python")
const mode = ["dev", "test"].includes(process.argv[2]) ? process.argv[2] : "start"

const ETX = String.fromCharCode(3)
const DEL = String.fromCharCode(127)
const NL = String.fromCharCode(10)
const BS = String.fromCharCode(8)
const log = msg => console.log(`[setup] ${msg}`)
const sh = (cmd, args, opts = {}) => spawnSync(cmd, args, { stdio: "inherit", shell: isWin && cmd === "npm", ...opts })
const quiet = (cmd, args) => spawnSync(cmd, args, { encoding: "utf8", shell: false })

// ---------- .env ----------
function getEnv(name) {
  if (!existsSync(envFile)) return ""
  const line = readFileSync(envFile, "utf8").split(/\r?\n/).find(l => new RegExp(`^\\s*${name}\\s*=`).test(l))
  return line ? line.replace(new RegExp(`^\\s*${name}\\s*=\\s*`), "").trim() : ""
}

function setEnv(name, value) {
  if (!existsSync(envFile)) copyFileSync(join(backend, ".env.example"), envFile)
  const lines = readFileSync(envFile, "utf8").split(/\r?\n/)
  const i = lines.findIndex(l => new RegExp(`^\\s*${name}\\s*=`).test(l))
  if (i >= 0) lines[i] = `${name}=${value}`
  else lines.push(`${name}=${value}`)
  writeFileSync(envFile, lines.join("\n").replace(/\n*$/, "\n"))
}

// ---------- entrada interativa ----------
function ask(question, { hidden = false } = {}) {
  if (!process.stdin.isTTY) return Promise.resolve("n")
  return new Promise(resolve => {
    process.stdout.write(question)
    const stdin = process.stdin
    let value = ""
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding("utf8")
    const onData = chunk => {
      for (const ch of chunk) {
        if (ch === ETX) { process.stdout.write(NL); process.exit(130) }
        if (ch === "\r" || ch === "\n") {
          stdin.setRawMode(false)
          stdin.pause()
          stdin.off("data", onData)
          process.stdout.write("\n")
          return resolve(value.trim())
        }
        if (ch === DEL || ch === BS) { value = value.slice(0, -1); continue }
        value += ch
        if (!hidden) process.stdout.write(ch)
      }
    }
    stdin.on("data", onData)
  })
}

// ---------- backend / frontend ----------
function findPython() {
  for (const cmd of ["python3", "python", "py"]) {
    const r = quiet(cmd, ["--version"])
    if (r.status === 0 && /Python 3/.test(`${r.stdout}${r.stderr}`)) return cmd
  }
  return null
}

function ensureBackend() {
  if (!existsSync(venvPython)) {
    const python = findPython()
    if (!python) {
      console.error("Python 3 nao encontrado. Instale em https://www.python.org/downloads/ e rode de novo.")
      process.exit(1)
    }
    log("Criando o ambiente virtual do backend...")
    if (sh(python, ["-m", "venv", join(backend, "venv")]).status !== 0) process.exit(1)
  }
  const ok = quiet(venvPython, ["-c", "import fastapi, uvicorn, httpx, dotenv"]).status === 0
  if (!ok) {
    log("Instalando as dependencias do backend...")
    if (sh(venvPython, ["-m", "pip", "install", "-r", join(backend, "requirements.txt")]).status !== 0) process.exit(1)
  }
}

function ensureFrontend() {
  if (existsSync(join(frontend, "node_modules"))) return
  log("Instalando as dependencias do frontend...")
  if (sh("npm", ["--prefix", frontend, "install"]).status !== 0) process.exit(1)
}

// ---------- LLM (OpenRouter ou Ollama local) ----------
const ollamaBase = () => process.env.OLLAMA_URL || getEnv("OLLAMA_URL") || "http://localhost:11434"
const ollamaModel = () => process.env.OLLAMA_MODEL || getEnv("OLLAMA_MODEL") || "llama3.2"

async function ollamaUp() {
  try {
    const r = await fetch(`${ollamaBase()}/api/tags`, { signal: AbortSignal.timeout(2000) })
    return r.ok
  } catch {
    return false
  }
}

const hasOllama = () => quiet("ollama", ["--version"]).status === 0

async function installOllama() {
  const answer = await ask("Ollama nao encontrado. Instalar agora? [S/n] ")
  if (/^n/i.test(answer)) return false
  if (isWin) {
    if (quiet("winget", ["--version"]).status !== 0) {
      console.log("winget indisponivel. Instale manualmente em https://ollama.com/download e rode de novo.")
      return false
    }
    sh("winget", ["install", "-e", "--id", "Ollama.Ollama", "--accept-package-agreements", "--accept-source-agreements"])
    // o winget atualiza o PATH so para novos terminais
    const local = join(process.env.LOCALAPPDATA || "", "Programs", "Ollama")
    process.env.PATH = `${local};${process.env.PATH}`
  } else if (process.platform === "darwin" && quiet("brew", ["--version"]).status === 0) {
    sh("brew", ["install", "ollama"])
  } else {
    console.log("Instale o Ollama em https://ollama.com/download (Linux: curl -fsSL https://ollama.com/install.sh | sh) e rode de novo.")
    return false
  }
  return hasOllama()
}

async function useOllama() {
  if (!hasOllama() && !(await installOllama())) {
    log("Sem LLM configurado: o chat nao vai responder. Veja o README.")
    return
  }
  if (!(await ollamaUp())) {
    log("Iniciando o Ollama...")
    spawn("ollama", ["serve"], { detached: true, stdio: "ignore" }).unref()
    for (let i = 0; i < 20 && !(await ollamaUp()); i++) await new Promise(r => setTimeout(r, 1000))
  }
  if (!(await ollamaUp())) {
    log("Nao consegui iniciar o Ollama. Rode 'ollama serve' em outro terminal.")
    return
  }
  const model = ollamaModel()
  const installed = quiet("ollama", ["list"]).stdout || ""
  if (!installed.split(/\r?\n/).some(l => l.startsWith(`${model}:`) || l.startsWith(`${model} `))) {
    log(`Baixando o modelo ${model} (pode demorar na primeira vez)...`)
    sh("ollama", ["pull", model])
  }
  log(`LLM: Ollama local (${model}).`)
}

async function setupLlm() {
  if (process.env.OPENROUTER_API_KEY || getEnv("OPENROUTER_API_KEY")) {
    log("LLM: OpenRouter (chave encontrada).")
    return
  }
  if (getEnv("LLM_SETUP") !== "ollama" && process.stdin.isTTY) {
    console.log("\nO chat do Professor Carvalho precisa de um LLM.")
    console.log("Cole sua chave do OpenRouter (gratis em openrouter.ai/keys)")
    const key = await ask("ou pressione Enter para usar o Ollama local (sem chave): ", { hidden: true })
    if (key) {
      setEnv("OPENROUTER_API_KEY", key)
      log("Chave salva em backend/.env (ignorado pelo Git).")
      return
    }
    setEnv("LLM_SETUP", "ollama")
  }
  await useOllama()
}

// ---------- execucao ----------
function stop(child) {
  if (!child || child.exitCode !== null) return
  if (isWin) spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"])
  else child.kill("SIGTERM")
}

function run(children) {
  const stopAll = () => children.forEach(stop)
  process.on("SIGINT", () => { stopAll(); process.exit(0) })
  process.on("SIGTERM", () => { stopAll(); process.exit(0) })
  children.forEach(c => c.on("exit", () => { stopAll(); process.exit(0) }))
}

ensureBackend()

if (mode === "test") {
  if (quiet(venvPython, ["-c", "import pytest"]).status !== 0) {
    if (sh(venvPython, ["-m", "pip", "install", "-r", join(backend, "requirements-dev.txt")]).status !== 0) process.exit(1)
  }
  process.exit(sh(venvPython, ["-m", "pytest"], { cwd: backend }).status ?? 1)
}

ensureFrontend()
await setupLlm()

if (mode === "start") {
  log("Gerando o build do frontend...")
  if (sh("npm", ["--prefix", frontend, "run", "build"]).status !== 0) process.exit(1)
  console.log("\nAplicacao em http://localhost:8000\n")
  run([spawn(venvPython, ["-m", "uvicorn", "main:app"], { cwd: backend, stdio: "inherit" })])
} else {
  console.log("\nBackend:  http://localhost:8000\nFrontend: http://localhost:5173\nCtrl+C para encerrar.\n")
  run([
    spawn(venvPython, ["-m", "uvicorn", "main:app", "--reload"], { cwd: backend, stdio: "inherit" }),
    spawn("npm", ["run", "dev"], { cwd: frontend, stdio: "inherit", shell: isWin }),
  ])
}
