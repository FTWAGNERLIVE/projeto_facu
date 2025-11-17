# Solução Rápida para Erro do NPM no PowerShell

## Problema

Erro: "npm não pode ser carregado porque a execução de scripts foi desabilitada"

## Solução Mais Rápida (2 Minutos)

1. Pressione `Windows + X`
2. Selecione "Windows PowerShell (Admin)" ou "Terminal (Admin)"
3. Quando abrir, cole este comando e pressione Enter:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

4. Digite "S" e pressione Enter quando perguntar
5. Feche o PowerShell
6. Abra um PowerShell normal (não precisa ser admin)
7. Teste: `npm --version`

**PRONTO!** Agora o npm deve funcionar.

## Alternativa: Usar o CMD (Sem Alterar Nada)

Se não quiser alterar configurações:

1. Pressione `Windows + R`
2. Digite: `cmd`
3. Pressione Enter
4. Navegue até o projeto:
   ```cmd
   cd "D:\Projeto faculdade\Projeto_introdu-o_protugol"
   ```
5. Execute normalmente:
   ```cmd
   npm install
   npm start
   ```

O CMD não tem essa restrição!

