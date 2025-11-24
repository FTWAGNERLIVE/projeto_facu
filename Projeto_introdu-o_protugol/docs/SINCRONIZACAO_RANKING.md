# Sincronização de Ranking entre PCs

Sistema de sincronização de rankings para uso durante apresentações em múltiplos PCs na mesma rede.

## Como Funciona

O sistema sincroniza automaticamente os rankings entre todos os PCs conectados na mesma rede local através de um servidor central.

## Configuração

### 1. Instalar Dependências do Servidor

```bash
npm install
```

Isso instalará as dependências necessárias, incluindo `express` e `cors`.

### 2. Descobrir o IP do PC Principal

No PC que vai rodar o servidor, descubra o endereço IP:

**Windows:**
```bash
ipconfig
```
Procure por "IPv4 Address" (exemplo: 192.168.1.100)

**Linux/Mac:**
```bash
ifconfig
# ou
ip addr
```

### 3. Configurar o IP no Frontend

No arquivo `.env` na raiz do projeto (crie se não existir), adicione:

```
REACT_APP_API_URL=http://[IP_DO_PC_PRINCIPAL]:3001/api
```

Exemplo:
```
REACT_APP_API_URL=http://192.168.1.100:3001/api
```

**Importante:** Cada PC precisa ter o IP correto do servidor configurado.

### 4. Iniciar o Servidor

No PC principal (que vai hospedar o servidor):

```bash
npm run server
```

O servidor iniciará na porta 3001 e mostrará:
```
🚀 Servidor de sincronização rodando na porta 3001
📡 Acesse em: http://localhost:3001
🌐 Para outros PCs na rede: http://[IP_DESTE_PC]:3001
```

### 5. Iniciar o Jogo

Em todos os PCs (incluindo o principal):

```bash
npm start
```

## Como Usar

1. **PC Principal**: Inicie o servidor com `npm run server` e depois o jogo com `npm start`
2. **PCs Secundários**: Apenas inicie o jogo com `npm start` (certifique-se de que o `.env` está configurado)

3. **Sincronização Automática**: 
   - Os rankings são sincronizados automaticamente a cada 5-10 segundos
   - Quando um jogador salva um score, ele aparece em todos os PCs em poucos segundos
   - O sistema funciona mesmo se o servidor cair (usa localStorage como backup)

## Funcionamento

- **Com Servidor**: Rankings são salvos no servidor e sincronizados entre todos os PCs
- **Sem Servidor**: Rankings são salvos apenas no localStorage local (funciona normalmente, mas sem sincronização)

## Estrutura

- `server.js` - Servidor Express que armazena rankings em `rankings.json`
- `src/utils/rankingSync.js` - Cliente de sincronização no frontend
- Rankings são salvos em `rankings.json` no servidor (não commitado no git)

## Troubleshooting

### Servidor não conecta
- Verifique se o servidor está rodando no PC principal
- Verifique se o IP está correto no `.env` de cada PC
- Verifique se os PCs estão na mesma rede
- Verifique se o firewall não está bloqueando a porta 3001

### Rankings não sincronizam
- Verifique o console do navegador para mensagens de erro
- Certifique-se de que o servidor está acessível: `http://[IP]:3001/api/status`
- Os rankings continuam funcionando localmente mesmo sem servidor

### Porta 3001 já em uso
- Altere a porta no `server.js` (linha `const PORT = 3001;`)
- Atualize o `.env` com a nova porta

## Para Apresentação

1. **Antes da apresentação:**
   - Configure o IP no `.env` de todos os PCs
   - Teste a conexão entre os PCs
   - Inicie o servidor no PC principal

2. **Durante a apresentação:**
   - O servidor deve estar rodando no PC principal
   - Todos os PCs devem ter o jogo rodando
   - Os rankings serão sincronizados automaticamente

3. **Dica:** Coloque o servidor em um PC que não será usado para jogar, para garantir que sempre esteja disponível.

