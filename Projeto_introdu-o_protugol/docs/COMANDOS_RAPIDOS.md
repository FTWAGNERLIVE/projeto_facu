# Comandos Rápidos - Projeto Portugol

## 1. Instalação Inicial (Apenas Uma Vez)

### Instalar Node.js
```powershell
winget install --id OpenJS.NodeJS -e --source winget
```

### Instalar Git (se necessário)
```powershell
winget install --id Git.Git -e --source winget
```

### Verificar instalações
```powershell
node --version
npm --version
git --version
```

### Navegar para o projeto
```powershell
cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"
```

### Instalar dependências do projeto
```powershell
npm install
```

## 2. Executar o Projeto (Toda Vez Que For Usar)

### Iniciar o servidor
```powershell
cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"
npm start
```

### Acessar no navegador
```
http://localhost:3000
```

### Parar o servidor
Pressione `Ctrl + C` no terminal

## 3. Configuração do Controle PS4 (Opcional)

### Instalar DS4Windows
- Baixar de: https://ds4-windows.com/
- Executar `DS4Windows.exe`

### Conectar PS4 via Bluetooth
1. Pressione `Share + PS` por 3 segundos no controle
2. Windows > Configurações > Dispositivos > Bluetooth
3. Adicionar "Wireless Controller"

### Verificar se funcionou
1. Abra o jogo no navegador
2. Pressione `F12` (console)
3. Procure: "Gamepad conectado: ..."

## 4. Solução de Problemas

### ERRO: "npm não pode ser carregado - execução de scripts desabilitada"
**Solução rápida (PowerShell como Admin):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Ou use o CMD ao invés do PowerShell (`Windows + R > cmd`)

### Se "node" não for reconhecido
```powershell
$env:Path += ";C:\Program Files\nodejs"
```

### Se "npm" não for reconhecido
```powershell
$env:Path += ";C:\Program Files\nodejs"
```

### Se der erro de localStorage
```powershell
$env:NODE_OPTIONS = "--localstorage-file=./.localstorage"
npm start
```

### Se porta 3000 estiver ocupada
```powershell
Get-NetTCPConnection -LocalPort 3000
Stop-Process -Id [PID] -Force
```

### Reinstalar dependências
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

## 5. Comandos Úteis

### Criar build de produção
```powershell
npm run build
```

### Executar testes
```powershell
npm test
```

### Ver dependências instaladas
```powershell
npm list
```

### Atualizar dependências
```powershell
npm update
```

