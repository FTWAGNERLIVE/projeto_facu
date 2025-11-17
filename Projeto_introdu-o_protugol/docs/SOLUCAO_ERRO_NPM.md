# Solução para Erro de Política de Execução do PowerShell

## Erro

```
npm : O arquivo C:\Program Files\nodejs\npm.ps1 não pode ser carregado 
porque a execução de scripts foi desabilitada...
```

## Solução 1: Alterar Política de Execução (Recomendado)

### Passo 1: Abrir PowerShell como Administrador

1. Pressione a tecla Windows
2. Digite "PowerShell"
3. Clique com botão direito em "Windows PowerShell"
4. Selecione "Executar como administrador"
5. Clique em "Sim" quando pedir permissão

### Passo 2: Verificar política atual

Digite este comando e pressione Enter:

```powershell
Get-ExecutionPolicy
```

Se aparecer "Restricted" ou "AllSigned", continue para o próximo passo.

### Passo 3: Alterar política de execução

Digite este comando e pressione Enter:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Quando perguntar se deseja continuar, digite "S" e pressione Enter.

### Passo 4: Verificar se funcionou

Digite este comando:

```powershell
Get-ExecutionPolicy
```

Deve aparecer "RemoteSigned"

### Passo 5: Testar o npm

Feche o PowerShell e abra um novo (não precisa ser como administrador).
Navegue até a pasta do projeto e tente:

```powershell
npm --version
```

Se aparecer a versão do npm, está funcionando!

## Solução 2: Usar o CMD (Alternativa Rápida)

Se não quiser alterar a política do PowerShell, use o Prompt de Comando:

1. Pressione `Windows + R`
2. Digite "cmd" e pressione Enter
3. Navegue até a pasta do projeto:
   ```cmd
   cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"
   ```
4. Execute os comandos normalmente:
   ```cmd
   npm install
   npm start
   ```

O CMD não tem essa restrição de política de execução.

## Solução 3: Política Apenas para o Usuário Atual

Se a Solução 1 não funcionar, tente esta (mais restritiva):

1. Abra PowerShell como Administrador
2. Execute:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Digite "S" quando perguntar
4. Feche e abra um novo PowerShell
5. Teste: `npm --version`

## Solução 4: Usar npm.cmd Diretamente

Como alternativa temporária, você pode usar o npm.cmd:

1. No PowerShell, em vez de "npm install", use:
   ```powershell
   npm.cmd install
   ```

2. Para iniciar o projeto:
   ```powershell
   npm.cmd start
   ```

Isso funciona porque o `.cmd` não é um script PowerShell.

## Verificação Final

Após aplicar uma das soluções, teste:

1. Abra um novo PowerShell (não precisa ser administrador)
2. Navegue até o projeto:
   ```powershell
   cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"
   ```
3. Teste o npm:
   ```powershell
   npm --version
   ```
4. Se funcionar, instale as dependências:
   ```powershell
   npm install
   ```
5. Inicie o projeto:
   ```powershell
   npm start
   ```

## Resumo dos Comandos (Copie e Cole)

### No PowerShell como Administrador:
```powershell
Get-ExecutionPolicy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Get-ExecutionPolicy
```

### Depois, em um PowerShell normal:
```powershell
cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"
npm --version
npm install
npm start
```

## Observações Importantes

- A política "RemoteSigned" é segura e permite executar scripts locais
- Você só precisa fazer isso **UMA VEZ** no computador
- Se ainda não funcionar, use o CMD (Solução 2)
- A Solução 4 (npm.cmd) funciona mas é mais trabalhosa

## Ainda Com Problemas?

Se nenhuma solução funcionar:

1. Verifique se o Node.js está instalado:
   ```powershell
   node --version
   ```

2. Se não estiver instalado, instale:
   ```powershell
   winget install --id OpenJS.NodeJS -e --source winget
   ```

3. Reinicie o computador após instalar o Node.js

4. Tente usar o CMD ao invés do PowerShell

