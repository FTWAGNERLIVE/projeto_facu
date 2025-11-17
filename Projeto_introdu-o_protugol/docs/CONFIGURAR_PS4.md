# Como Configurar o Controle PS4 no Windows via Bluetooth

## Problema
O Windows pode não reconhecer o controle PS4 como um gamepad padrão quando conectado via Bluetooth, impedindo que o navegador detecte o controle.

## Soluções

### Solução 1: Usar o DS4Windows (Recomendado)

1. **Baixe o DS4Windows:**
   - Acesse: https://ds4-windows.com/
   - Baixe a versão mais recente

2. **Instale e configure:**
   - Execute o DS4Windows
   - O programa criará um driver virtual que faz o Windows reconhecer o PS4 como um controle Xbox
   - Conecte o PS4 via Bluetooth normalmente
   - O DS4Windows deve detectar automaticamente

3. **Verificar no jogo:**
   - Abra o jogo no navegador
   - Pressione F12 para abrir o console do desenvolvedor
   - Você deve ver mensagens como "Gamepad conectado: ..."
   - O status do controle deve aparecer como "Conectado" na interface

### Solução 2: Configuração Manual do Bluetooth

1. **Parear o controle:**
   - Mantenha pressionado o botão Share + PS (botão central) por 3 segundos
   - O controle entrará em modo de pareamento (luz piscando)
   - No Windows, vá em Configurações > Dispositivos > Bluetooth
   - Clique em "Adicionar Bluetooth ou outro dispositivo"
   - Selecione "Wireless Controller" quando aparecer

2. **Verificar no Gerenciador de Dispositivos:**
   - Pressione Win + X e selecione "Gerenciador de Dispositivos"
   - Procure por "Dispositivos de entrada" ou "Human Interface Devices"
   - Verifique se o "Wireless Controller" aparece

3. **Testar no navegador:**
   - Acesse: https://gamepad-tester.com/
   - Pressione os botões do controle
   - Se os botões responderem, o controle está funcionando

### Solução 3: Usar Cabo USB (Alternativa Rápida)

Se o Bluetooth não funcionar:
1. Conecte o PS4 ao computador via cabo USB
2. O Windows deve reconhecer automaticamente
3. Teste no jogo

## Verificar se está funcionando no projeto

1. Abra o console do navegador (F12)
2. Procure por mensagens como:
   - "Verificando gamepads existentes..."
   - "Gamepad encontrado no índice X: ..."
   - "Gamepad conectado: ..."

3. Na interface do jogo, você deve ver:
   - Status do controle mostrando "Conectado" (verde)
   - Poder navegar com o D-Pad ou analógico
   - Poder selecionar com o botão X

## Troubleshooting

### O controle não aparece no console
- Verifique se o DS4Windows está rodando (se estiver usando)
- Tente desconectar e reconectar o controle
- Reinicie o navegador
- Verifique se outros programas não estão usando o controle

### O controle aparece mas não responde
- Verifique se está na página correta (Labirinto ou Seleção de Níveis)
- Pressione qualquer botão do controle para "ativá-lo" (alguns navegadores exigem interação primeiro)
- Verifique no console se há erros

### O controle funciona em outros lugares mas não no jogo
- Limpe o cache do navegador
- Tente em outro navegador (Chrome, Firefox, Edge)
- Verifique se o JavaScript está habilitado

## Notas Técnicas

- O projeto usa a API Gamepad do navegador (navigator.getGamepads())
- O controle precisa ser reconhecido pelo Windows como um gamepad padrão
- Alguns navegadores exigem que você pressione um botão do controle antes de detectá-lo
- O projeto suporta controles compatíveis com a especificação Gamepad API

