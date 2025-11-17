# Configuração do GitHub

## Passos para fazer push do projeto

### 1. Criar repositório no GitHub
1. Acesse: https://github.com/new
2. Escolha um nome para o repositório (ex: `projeto-quiz-portugol`)
3. **NÃO** marque as opções de inicializar com README, .gitignore ou licença
4. Clique em "Create repository"

### 2. Adicionar remote e fazer push

Depois de criar o repositório, execute os comandos abaixo substituindo `SEU-USUARIO` e `NOME-DO-REPOSITORIO`:

```powershell
cd "D:\Projeto faculdade"
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git branch -M main
git push -u origin main
```

### 3. Comandos rápidos (após configurar)

Para futuros pushes:
```powershell
git add .
git commit -m "Sua mensagem de commit"
git push
```

## Nota

O commit inicial já foi feito localmente. Agora só falta conectar com o GitHub e fazer o push!

