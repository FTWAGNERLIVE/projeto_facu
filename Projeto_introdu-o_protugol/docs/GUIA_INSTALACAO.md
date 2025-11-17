# Guia Completo de Instalação e Execução do Projeto

## Requisitos do Sistema

### Software Necessário

1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Versão recomendada: LTS (Long Term Support)
   - Inclui o npm (gerenciador de pacotes)

2. **Git** (para clonar o repositório)
   - Download: https://git-scm.com/downloads
   - Ou instalar via winget: `winget install --id Git.Git -e --source winget`

3. **Navegador Web Moderno**
   - Google Chrome (recomendado)
   - Microsoft Edge
   - Mozilla Firefox

### Drivers e Ferramentas Opcionais (para Controle PS4)

1. **DS4Windows** (para usar controle PS4 via Bluetooth)
   - Download: https://ds4-windows.com/
   - Necessário apenas se quiser usar controle PS4

## Instalação Passo a Passo

### 1. Instalar Node.js

**Windows (PowerShell como Administrador):**
```powershell
winget install --id OpenJS.NodeJS -e --source winget
```

**Ou baixar manualmente:**
- Acesse: https://nodejs.org/
- Baixe a versão LTS
- Execute o instalador
- Marque a opção "Add to PATH" durante a instalação

**Verificar instalação:**
```powershell
node --version
npm --version
```

### 2. Instalar Git (se ainda não tiver)

**Windows (PowerShell como Administrador):**
```powershell
winget install --id Git.Git -e --source winget
```

**Verificar instalação:**
```powershell
git --version
```

### 3. Clonar/Baixar o Projeto

**Opção 1: Via Git (recomendado)**
```powershell
cd "D:\Projeto faculdade"
git clone https://github.com/PROJET-EXP-FACUL/Projeto_introdu-o_protugol
```

**Opção 2: Baixar ZIP**
- Acesse: https://github.com/PROJET-EXP-FACUL/Projeto_introdu-o_protugol
- Clique em "Code" > "Download ZIP"
- Extraia o arquivo

### 4. Instalar Dependências do Projeto

```powershell
cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"
npm install
```

**Tempo estimado:** 2-5 minutos (dependendo da conexão)

### 5. Configurar Variável de Ambiente (Node.js 25+)

O Node.js 25 requer uma configuração especial para o localStorage. Isso já está configurado no `package.json`, mas se precisar configurar manualmente:

```powershell
$env:NODE_OPTIONS = "--localstorage-file=./.localstorage"
```

## Comandos para Executar o Projeto

### Iniciar o Servidor de Desenvolvimento

```powershell
cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"
npm start
```

**O que acontece:**
- O servidor inicia na porta 3000
- O navegador abre automaticamente em `http://localhost:3000`
- O projeto fica em modo de desenvolvimento (recarrega automaticamente ao salvar alterações)

### Parar o Servidor

No terminal onde o servidor está rodando:
- Pressione `Ctrl + C`
- Ou feche a janela do terminal

### Outros Comandos Úteis

**Criar build de produção:**
```powershell
npm run build
```
Cria uma versão otimizada do projeto na pasta `build/`

**Executar testes:**
```powershell
npm test
```

**Verificar versões instaladas:**
```powershell
node --version
npm --version
```

## Configuração do Controle PS4 (Opcional)

### 1. Instalar DS4Windows

1. Baixe: https://ds4-windows.com/
2. Extraia e execute `DS4Windows.exe`
3. O programa roda em segundo plano

### 2. Conectar o PS4

**Via Bluetooth:**
1. Mantenha pressionado `Share + PS` por 3 segundos
2. No Windows: Configurações > Dispositivos > Bluetooth
3. Adicione "Wireless Controller"

**Via USB:**
1. Conecte o cabo USB
2. O Windows reconhece automaticamente

### 3. Verificar no Jogo

1. Abra o jogo no navegador
2. Pressione `F12` para abrir o console
3. Procure por: "Gamepad conectado: ..."
4. O status deve mostrar "Conectado" (verde)

## Scripts Rápidos (PowerShell)

### Script Completo de Instalação

Salve como `instalar.ps1`:

```powershell
# Verificar Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Instalando Node.js..."
    winget install --id OpenJS.NodeJS -e --source winget
    $env:Path += ";C:\Program Files\nodejs"
}

# Verificar Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Instalando Git..."
    winget install --id Git.Git -e --source winget
    $env:Path += ";C:\Program Files\Git\cmd"
}

# Navegar para o projeto
cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"

# Instalar dependências
Write-Host "Instalando dependências..."
npm install

# Configurar variável de ambiente
$env:NODE_OPTIONS = "--localstorage-file=./.localstorage"

Write-Host "Instalação concluída! Execute 'npm start' para iniciar o projeto."
```

### Script para Iniciar o Projeto

Salve como `iniciar.ps1`:

```powershell
cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"
$env:Path += ";C:\Program Files\nodejs"
$env:NODE_OPTIONS = "--localstorage-file=./.localstorage"
npm start
```

## Estrutura de Comandos Resumida

```
1. Verificar instalações:
   node --version
   npm --version
   git --version

2. Navegar para o projeto:
   cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"

3. Instalar dependências (apenas primeira vez):
   npm install

4. Iniciar o servidor:
   npm start

5. Acessar no navegador:
   http://localhost:3000
```

## Solução de Problemas Comuns

### Erro: "node não é reconhecido"
**Solução:**
```powershell
$env:Path += ";C:\Program Files\nodejs"
```
Ou reinicie o terminal após instalar o Node.js

### Erro: "npm não é reconhecido"
**Solução:**
```powershell
$env:Path += ";C:\Program Files\nodejs"
```

### Erro: "SecurityError: Cannot initialize local storage"
**Solução:**
```powershell
$env:NODE_OPTIONS = "--localstorage-file=./.localstorage"
npm start
```

### Porta 3000 já está em uso
**Solução:**
```powershell
# Encontrar processo usando a porta
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Parar o processo (substitua PID pelo número do processo)
Stop-Process -Id PID -Force
```

### Dependências não instalam
**Solução:**
```powershell
# Limpar cache do npm
npm cache clean --force

# Deletar node_modules e reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## Checklist de Instalação

- [ ] Node.js instalado e no PATH
- [ ] Git instalado (se for clonar via Git)
- [ ] Projeto baixado/clonado
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor iniciado (`npm start`)
- [ ] Navegador aberto em `http://localhost:3000`
- [ ] (Opcional) DS4Windows instalado para controle PS4
- [ ] (Opcional) Controle PS4 conectado e funcionando

## Comandos de Manutenção

**Atualizar dependências:**
```powershell
npm update
```

**Verificar vulnerabilidades:**
```powershell
npm audit
```

**Corrigir vulnerabilidades (cuidado, pode quebrar):**
```powershell
npm audit fix
```

**Ver informações do projeto:**
```powershell
npm list
```

## Links Úteis

- Node.js: https://nodejs.org/
- Git: https://git-scm.com/
- DS4Windows: https://ds4-windows.com/
- Documentação React: https://react.dev/
- Gamepad API: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API

