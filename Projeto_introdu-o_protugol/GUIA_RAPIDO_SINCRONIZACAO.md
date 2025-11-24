# Guia Rápido - Sincronização de Ranking

## Para a Apresentação (2 PCs)

### Passo 1: Instalar Dependências
Em ambos os PCs, execute:
```bash
npm install
```

### Passo 2: Descobrir IP do PC Principal
No PC que vai rodar o servidor, execute:

**Windows:**
```bash
ipconfig
```
Anote o "IPv4 Address" (exemplo: 192.168.1.100)

**Linux/Mac:**
```bash
ifconfig
```

### Passo 3: Configurar IP nos PCs

**PC Principal (que roda o servidor):**
1. Copie `.env.example` para `.env`
2. Deixe como está (usa localhost)

**PC Secundário:**
1. Copie `.env.example` para `.env`
2. Edite o `.env` e substitua `localhost` pelo IP do PC principal:
   ```
   REACT_APP_API_URL=http://192.168.1.100:3001/api
   ```
   (Use o IP que você anotou no Passo 2)

### Passo 4: Iniciar

**PC Principal:**
```bash
# Terminal 1 - Servidor
npm run server

# Terminal 2 - Jogo
npm start
```

**PC Secundário:**
```bash
# Apenas o jogo
npm start
```

### Pronto!
Os rankings serão sincronizados automaticamente entre os dois PCs.

## Verificar se Está Funcionando

1. No PC principal, você deve ver:
   ```
   🚀 Servidor de sincronização rodando na porta 3001
   ```

2. Em ambos os PCs, quando um jogador salva um score, ele aparece no outro PC em poucos segundos.

3. Se o servidor não estiver disponível, o jogo continua funcionando normalmente (apenas sem sincronização).

## Dica Importante

- O servidor deve estar rodando ANTES de iniciar os jogos
- Se o servidor cair, os rankings continuam salvos localmente
- Os rankings são sincronizados automaticamente a cada 5-10 segundos

