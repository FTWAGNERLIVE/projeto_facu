# Versões Instaláveis e Mobile

Este guia explica como criar versões instaláveis (desktop) e mobile do projeto.

## Opções Disponíveis

### 1. PWA (Progressive Web App) - **RECOMENDADO**

**Vantagens:**
- ✅ Funciona em desktop e mobile
- ✅ Não precisa de ferramentas adicionais
- ✅ Instalação simples (botão no navegador)
- ✅ Funciona offline (com service worker)
- ✅ Mantém todo o código atual

**Desvantagens:**
- ⚠️ Requer HTTPS (ou localhost)
- ⚠️ Funciona dentro do navegador

**Status:** ✅ Implementado (ver seção abaixo)

---

### 2. Electron (Desktop)

**Vantagens:**
- ✅ App desktop nativo (Windows, Mac, Linux)
- ✅ Acesso completo ao sistema
- ✅ Distribuição como .exe/.dmg/.deb

**Desvantagens:**
- ⚠️ App pesado (~100MB+)
- ⚠️ Requer configuração adicional
- ⚠️ Gamepad API pode precisar ajustes

**Quando usar:** Se precisar de um executável standalone.

---

### 3. Capacitor (Mobile)

**Vantagens:**
- ✅ App nativo para Android/iOS
- ✅ Publicação nas lojas (Play Store, App Store)
- ✅ Acesso a recursos nativos do dispositivo

**Desvantagens:**
- ⚠️ Requer Android Studio / Xcode
- ⚠️ Gamepad pode não funcionar em mobile
- ⚠️ Configuração mais complexa

**Quando usar:** Se precisar publicar nas lojas de apps.

---

### 4. Tauri (Desktop Moderno)

**Vantagens:**
- ✅ App muito leve (~5-10MB)
- ✅ Mais seguro que Electron
- ✅ Performance melhor

**Desvantagens:**
- ⚠️ Requer Rust instalado
- ⚠️ Configuração mais complexa

**Quando usar:** Se quiser um app desktop leve e moderno.

---

## Implementação: PWA (Já Configurado)

O projeto já está configurado como PWA! Siga os passos abaixo.

### Como Instalar no Desktop

1. **Build do projeto:**
   ```powershell
   npm run build
   ```

2. **Servir o build (opcional, para testar):**
   ```powershell
   npx serve -s build
   ```

3. **Acessar no navegador:**
   - Chrome/Edge: `http://localhost:3000` (ou o servidor)
   - Procure pelo ícone de instalação na barra de endereços
   - Ou vá em Menu > "Instalar aplicativo"

4. **Instalar:**
   - Clique no botão "Instalar"
   - O app será instalado como aplicativo

### Como Instalar no Mobile

1. **Acessar o app no navegador mobile:**
   - Abra o navegador (Chrome, Safari, etc.)
   - Acesse a URL do app

2. **Instalar:**
   - **Android (Chrome):** Menu > "Adicionar à tela inicial"
   - **iOS (Safari):** Compartilhar > "Adicionar à Tela de Início"

3. **Usar:**
   - O app aparecerá como um ícone na tela inicial
   - Funciona como um app nativo

### Requisitos para PWA

- ✅ HTTPS (ou localhost para desenvolvimento)
- ✅ Manifest.json (já configurado)
- ✅ Service Worker (já configurado)
- ✅ Ícone do app (já configurado)

---

## Implementação: Electron (Desktop)

### Passo 1: Instalar Dependências

```powershell
npm install --save-dev electron electron-builder concurrently wait-on
```

### Passo 2: Criar arquivo `public/electron.js`

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### Passo 3: Atualizar `package.json`

Adicionar ao `package.json`:

```json
{
  "main": "public/electron.js",
  "homepage": "./",
  "scripts": {
    "electron": "electron .",
    "electron-dev": "concurrently \"cross-env BROWSER=none npm start\" \"wait-on http://localhost:3000 && electron .\"",
    "electron-pack": "electron-builder",
    "preelectron-pack": "npm run build"
  },
  "build": {
    "appId": "com.projeto.portugol",
    "productName": "Quiz Portugol",
    "directories": {
      "buildResources": "build"
    },
    "files": [
      "build/**/*",
      "public/electron.js",
      "node_modules/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "build/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "build/icon.png"
    }
  }
}
```

### Passo 4: Criar Executável

```powershell
npm run electron-pack
```

O executável estará em `dist/`.

---

## Implementação: Capacitor (Mobile)

### Passo 1: Instalar Capacitor

```powershell
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npx cap init
```

### Passo 2: Build do Projeto

```powershell
npm run build
```

### Passo 3: Adicionar Plataformas

```powershell
npx cap add android
npx cap add ios  # Apenas no Mac
```

### Passo 4: Sincronizar

```powershell
npx cap sync
```

### Passo 5: Abrir no IDE

```powershell
# Android
npx cap open android

# iOS (apenas Mac)
npx cap open ios
```

### Passo 6: Build e Publicar

- **Android:** Use Android Studio para gerar APK/AAB
- **iOS:** Use Xcode para gerar IPA

---

## Comparação Rápida

| Recurso | PWA | Electron | Capacitor | Tauri |
|---------|-----|----------|-----------|-------|
| Desktop | ✅ | ✅ | ❌ | ✅ |
| Mobile | ✅ | ❌ | ✅ | ❌ |
| Tamanho | ~5MB | ~100MB | ~20MB | ~5MB |
| Instalação | Fácil | Média | Complexa | Média |
| Loja Apps | ❌ | ❌ | ✅ | ❌ |
| Offline | ✅ | ✅ | ✅ | ✅ |
| Gamepad | ✅ | ✅ | ⚠️ | ✅ |

---

## Recomendações

### Para Começar Agora:
**Use PWA** - Já está configurado e funciona imediatamente!

### Para App Desktop Profissional:
**Use Electron** - Mais controle e distribuição como .exe

### Para App Mobile nas Lojas:
**Use Capacitor** - Publicação na Play Store/App Store

### Para App Desktop Leve:
**Use Tauri** - Menor tamanho e melhor performance

---

## Próximos Passos

1. **Teste a PWA primeiro** (já está funcionando)
2. **Se precisar de executável**, implemente Electron
3. **Se precisar de mobile nas lojas**, implemente Capacitor

Veja os arquivos de configuração já criados no projeto!

