# Como Instalar o App como PWA

O projeto está configurado como Progressive Web App (PWA), permitindo instalação em desktop e mobile.

## Instalação no Desktop

### Chrome / Edge / Brave

1. **Acesse o app:**
   - Desenvolvimento: `http://localhost:3000`
   - Produção: URL do servidor onde o app está hospedado

2. **Procure o ícone de instalação:**
   - Na barra de endereços, aparecerá um ícone de "Instalar" ou "+"
   - Ou vá em Menu (⋮) > "Instalar aplicativo"

3. **Clique em "Instalar":**
   - O app será instalado como aplicativo desktop
   - Aparecerá no menu Iniciar (Windows) ou Launchpad (Mac)

4. **Usar o app:**
   - Abra o app instalado
   - Funciona como um aplicativo nativo

### Firefox

1. Acesse o app no navegador
2. Menu (☰) > "Instalar Site como Aplicativo"
3. Confirme a instalação

## Instalação no Mobile

### Android (Chrome)

1. **Acesse o app no navegador:**
   - Abra o Chrome
   - Navegue até a URL do app

2. **Instalar:**
   - Toque no menu (⋮) no canto superior direito
   - Selecione "Adicionar à tela inicial" ou "Instalar aplicativo"
   - Confirme o nome e toque em "Adicionar"

3. **Usar:**
   - O app aparecerá como um ícone na tela inicial
   - Funciona como um app nativo

### iOS (Safari)

1. **Acesse o app no Safari:**
   - Abra o Safari
   - Navegue até a URL do app

2. **Instalar:**
   - Toque no botão de compartilhar (□↑)
   - Role para baixo e toque em "Adicionar à Tela de Início"
   - Confirme o nome e toque em "Adicionar"

3. **Usar:**
   - O app aparecerá como um ícone na tela inicial
   - Funciona como um app nativo

## Requisitos

### Para Instalação Funcionar

- ✅ **HTTPS:** O app deve estar em HTTPS (ou localhost para desenvolvimento)
- ✅ **Manifest.json:** Já configurado ✅
- ✅ **Service Worker:** Já configurado ✅
- ✅ **Ícones:** Precisam ser criados (veja abaixo)

### Criar Ícones

Para melhor experiência, crie os ícones:

1. **Crie imagens:**
   - `logo192.png` - 192x192 pixels
   - `logo512.png` - 512x512 pixels
   - Coloque na pasta `public/`

2. **Ou use um gerador online:**
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator

## Funcionalidades PWA

### ✅ Funciona Offline
- O app funciona mesmo sem internet (após primeiro carregamento)
- Dados salvos localmente são mantidos

### ✅ Instalação Rápida
- Um clique para instalar
- Não precisa de loja de apps

### ✅ Atualizações Automáticas
- O app se atualiza automaticamente quando há nova versão
- Service Worker gerencia o cache

### ✅ Experiência Nativa
- Abre em janela própria (desktop)
- Funciona como app nativo (mobile)
- Ícone na tela inicial

## Troubleshooting

### Ícone de instalação não aparece

**Causas possíveis:**
- App não está em HTTPS (use localhost para desenvolvimento)
- Manifest.json não está acessível
- Service Worker não está registrado

**Solução:**
1. Verifique o console do navegador (F12)
2. Confirme que `manifest.json` está acessível
3. Verifique se o Service Worker está registrado

### App não funciona offline

**Causa:** Service Worker não está funcionando

**Solução:**
1. Abra DevTools (F12) > Application > Service Workers
2. Verifique se está registrado
3. Tente "Unregister" e recarregue a página

### App não atualiza

**Solução:**
1. Limpe o cache do navegador
2. Ou force atualização: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

## Desenvolvimento

### Testar PWA Localmente

```powershell
# Build do projeto
npm run build

# Servir o build (simula produção)
npx serve -s build
```

Acesse `http://localhost:3000` (ou a porta que o serve indicar)

### Verificar PWA

1. Abra DevTools (F12)
2. Vá em "Application" > "Manifest"
3. Verifique se tudo está correto
4. Vá em "Service Workers" para ver o status

## Próximos Passos

1. ✅ PWA básico configurado
2. ⏳ Criar ícones do app (192x192 e 512x512)
3. ⏳ Testar instalação
4. ⏳ (Opcional) Adicionar notificações push
5. ⏳ (Opcional) Implementar Electron para .exe

