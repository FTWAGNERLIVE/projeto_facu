# Como Acessar o App na Rede Local

Para acessar o app de outros dispositivos na mesma rede Wi-Fi, você precisa usar o IP local do computador ao invés de `localhost`.

## Passo 1: Descobrir o IP Local do Computador

### Windows (PowerShell)
```powershell
ipconfig | findstr IPv4
```

Ou mais específico:
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"} | Select-Object IPAddress
```

### Windows (CMD)
```cmd
ipconfig
```
Procure por "Endereço IPv4" na seção do adaptador Wi-Fi/Ethernet.

### Mac / Linux
```bash
ifconfig | grep "inet "
```

Ou:
```bash
hostname -I
```

## Passo 2: Iniciar o Servidor com Acesso na Rede

O projeto já está configurado para aceitar conexões da rede local. Basta iniciar normalmente:

```powershell
npm start
```

O servidor agora aceita conexões de qualquer dispositivo na mesma rede.

## Passo 3: Acessar de Outro Dispositivo

### No Celular/Tablet:
1. Certifique-se de estar na mesma rede Wi-Fi
2. Abra o navegador
3. Digite: `http://[IP_DO_COMPUTADOR]:3000`
   - Exemplo: `http://192.168.1.100:3000`

### Usando o QR Code:
1. O QR code na tela de seleção detecta automaticamente o IP local
2. Escaneie com a câmera do celular
3. O app abrirá automaticamente

## Solução de Problemas

### QR Code não funciona

**Causa:** O QR code pode estar usando `localhost` ao invés do IP local.

**Solução:**
1. Reinicie o servidor: `npm start`
2. Aguarde alguns segundos para o IP ser detectado
3. Abra o QR code novamente
4. O QR code deve mostrar o IP local agora

### Não consigo acessar de outro dispositivo

**Verificações:**
1. ✅ Ambos os dispositivos estão na mesma rede Wi-Fi?
2. ✅ O servidor está rodando?
3. ✅ O firewall do Windows não está bloqueando?
4. ✅ Você está usando o IP correto?

### Firewall bloqueando

**Windows:**
1. Abra "Firewall do Windows Defender"
2. Clique em "Permitir um aplicativo pelo Firewall"
3. Procure por "Node.js" e marque "Privado"
4. Ou desative temporariamente o firewall para testar

### IP não é detectado automaticamente

**Solução manual:**
1. Descubra seu IP (veja Passo 1)
2. Acesse diretamente: `http://[SEU_IP]:3000`
3. O QR code será atualizado automaticamente

## Exemplo Completo

1. **No computador:**
   ```powershell
   # Descobrir IP
   ipconfig
   # Resultado: 192.168.1.100
   
   # Iniciar servidor
   npm start
   ```

2. **No celular:**
   - Abra o navegador
   - Digite: `http://192.168.1.100:3000`
   - Ou escaneie o QR code na tela de seleção

## Dica

O QR code na tela de seleção de fase detecta automaticamente o IP local. Se não aparecer, reinicie o servidor e aguarde alguns segundos.

