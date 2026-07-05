if (!(Test-Path ".\backend\venv\Scripts\python.exe")) {
    Write-Host "Crie o ambiente do backend antes: cd backend; python -m venv venv; venv\Scripts\activate; pip install -r requirements.txt"
    exit 1
}

$backend = Start-Process -FilePath ".\backend\venv\Scripts\python.exe" -ArgumentList "-m", "uvicorn", "main:app", "--reload" -WorkingDirectory ".\backend" -PassThru
$frontend = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory ".\frontend" -PassThru

Write-Host "Backend:  http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Pressione Ctrl+C para encerrar."

try {
    Wait-Process -Id $backend.Id, $frontend.Id
} finally {
    Stop-Process -Id $backend.Id, $frontend.Id -Force -ErrorAction SilentlyContinue
}
