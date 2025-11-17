# Solução para Erro de LocalStorage no Node.js 25

## Erro

```
SecurityError: Cannot initialize local storage without a --localstorage-file path
```

## Causa do Problema

O Node.js versão 25+ introduziu uma mudança de segurança que exige especificar um arquivo para o localStorage durante a compilação.

## Solução 1: Usar o Comando Correto (Já Configurado)

O projeto já está configurado para funcionar! Basta usar:

```powershell
npm start
```

O comando já inclui a flag necessária automaticamente.

Se ainda der erro, verifique se o `package.json` está atualizado.

## Solução 2: Configurar Manualmente (Se Necessário)

No PowerShell, antes de executar `npm start`:

```powershell
$env:NODE_OPTIONS = "--localstorage-file=./.localstorage"
npm start
```

Ou configure permanentemente no PowerShell:

```powershell
[System.Environment]::SetEnvironmentVariable("NODE_OPTIONS", "--localstorage-file=./.localstorage", "User")
```

Depois feche e abra um novo PowerShell.

## Solução 3: Usar o CMD (Windows)

No Prompt de Comando (CMD):

1. Pressione `Windows + R`
2. Digite: `cmd`
3. Navegue até o projeto:
   ```cmd
   cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"
   ```
4. Configure a variável:
   ```cmd
   set NODE_OPTIONS=--localstorage-file=./.localstorage
   ```
5. Execute:
   ```cmd
   npm start
   ```

## Solução 4: Verificar o package.json

Certifique-se de que o `package.json` tem esta configuração:

```json
"scripts": {
  "start": "cross-env NODE_OPTIONS=\"--localstorage-file=./.localstorage\" react-scripts start",
  "build": "cross-env NODE_OPTIONS=\"--localstorage-file=./.localstorage\" react-scripts build"
}
```

Se não tiver, o projeto precisa ser atualizado.

## Solução 5: Usar Node.js LTS (Alternativa)

Se preferir não lidar com essa configuração, use Node.js 20 LTS:

1. Desinstale o Node.js 25
2. Baixe Node.js 20 LTS de: https://nodejs.org/
3. Instale a versão LTS
4. Execute normalmente: `npm start`

A versão LTS não tem essa exigência.

## Verificação

Após aplicar a solução, teste:

1. Execute: `npm start`
2. O servidor deve iniciar sem erros
3. Acesse: `http://localhost:3000`
4. O projeto deve carregar normalmente

## Resumo Rápido

### Método mais simples (PowerShell):
```powershell
$env:NODE_OPTIONS = "--localstorage-file=./.localstorage"
npm start
```

### Método mais simples (CMD):
```cmd
set NODE_OPTIONS=--localstorage-file=./.localstorage
npm start
```

O projeto já deve funcionar com: `npm start`
(se o `package.json` estiver atualizado)

