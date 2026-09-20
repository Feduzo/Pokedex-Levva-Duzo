# Configura o LLM do chat (Professor Carvalho) antes de iniciar o projeto.
# 1) Se houver chave do OpenRouter (backend/.env ou variavel de ambiente), usa ela.
# 2) Se nao, pergunta a chave. Sem chave, instala/inicia o Ollama local e baixa o modelo.

$envFile = Join-Path $PSScriptRoot "backend\.env"
$example = Join-Path $PSScriptRoot "backend\.env.example"
$model = "llama3.2"
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Get-EnvValue($name) {
    if (!(Test-Path $envFile)) { return "" }
    $line = Get-Content $envFile | Where-Object { $_ -match "^\s*$name\s*=" } | Select-Object -First 1
    if ($line) { return ($line -replace "^\s*$name\s*=\s*", "").Trim() }
    return ""
}

function Set-EnvValue($name, $value) {
    if (!(Test-Path $envFile)) { Copy-Item $example $envFile }
    $lines = @(Get-Content $envFile)
    $found = $false
    $lines = $lines | ForEach-Object {
        if ($_ -match "^\s*$name\s*=") { $found = $true; "$name=$value" } else { $_ }
    }
    if (!$found) { $lines += "$name=$value" }
    [System.IO.File]::WriteAllText($envFile, (($lines -join "`r`n") + "`r`n"), $utf8)
}

function Test-Ollama {
    try { Invoke-RestMethod "http://localhost:11434/api/tags" -TimeoutSec 2 | Out-Null; return $true } catch { return $false }
}

function Use-Ollama {
    if (!(Get-Command ollama -ErrorAction SilentlyContinue)) {
        $ans = Read-Host "Ollama nao encontrado. Instalar agora com winget (Ollama.Ollama)? [S/n]"
        if ($ans -match "^[nN]") { Write-Host "Sem LLM configurado: o chat nao vai responder. Veja o README."; return }
        if (!(Get-Command winget -ErrorAction SilentlyContinue)) {
            Write-Host "winget indisponivel. Instale manualmente em https://ollama.com/download e rode de novo."
            return
        }
        winget install -e --id Ollama.Ollama --accept-package-agreements --accept-source-agreements
        $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
        if (!(Get-Command ollama -ErrorAction SilentlyContinue)) {
            Write-Host "Ollama instalado, mas nao achei o comando. Feche e abra o terminal e rode de novo."
            return
        }
    }

    if (!(Test-Ollama)) {
        Write-Host "Iniciando o Ollama..."
        Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
        for ($i = 0; $i -lt 20 -and !(Test-Ollama); $i++) { Start-Sleep -Seconds 1 }
    }
    if (!(Test-Ollama)) { Write-Host "Nao consegui iniciar o Ollama. Rode 'ollama serve' em outro terminal."; return }

    if (!((ollama list) -match "^$model")) {
        Write-Host "Baixando o modelo $model (pode demorar na primeira vez)..."
        ollama pull $model
    }
    Write-Host "LLM: Ollama local ($model)."
}

if ($env:OPENROUTER_API_KEY -or (Get-EnvValue "OPENROUTER_API_KEY")) {
    Write-Host "LLM: OpenRouter (chave encontrada)."
    return
}

if ((Get-EnvValue "LLM_SETUP") -ne "ollama" -and [Environment]::UserInteractive) {
    Write-Host ""
    Write-Host "O chat do Professor Carvalho precisa de um LLM."
    Write-Host "Cole sua chave do OpenRouter (gratis em openrouter.ai/keys)"
    $secure = Read-Host "ou pressione Enter para usar o Ollama local (sem chave)" -AsSecureString
    $key = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)).Trim()
    if ($key) {
        Set-EnvValue "OPENROUTER_API_KEY" $key
        Write-Host "Chave salva em backend/.env (ignorado pelo Git)."
        return
    }
    Set-EnvValue "LLM_SETUP" "ollama"
}

Use-Ollama
