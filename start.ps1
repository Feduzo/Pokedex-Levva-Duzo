if (!(Test-Path ".\backend\venv\Scripts\python.exe")) {
    Write-Host "Crie o ambiente do backend antes: cd backend; python -m venv venv; venv\Scripts\activate; pip install -r requirements.txt"
    exit 1
}

. "$PSScriptRoot/setup-llm.ps1"

npm --prefix frontend run build
Set-Location backend
.\venv\Scripts\python.exe -m uvicorn main:app
