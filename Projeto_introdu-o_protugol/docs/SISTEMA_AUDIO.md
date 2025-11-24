# Sistema de Áudio do Jogo

Sistema completo de áudio implementado no jogo de labirinto.

## Estrutura

O sistema de áudio está localizado em:
- **Gerenciador**: `src/utils/audioManager.js`
- **Arquivos de som**: `public/sounds/`

## Sons Implementados

### Efeitos Sonoros

1. **move.mp3** - Toca quando o personagem se move
2. **key-collect.mp3** - Toca ao coletar a chave
3. **goal-reach.mp3** - Toca ao chegar no destino
4. **collision.mp3** - Toca ao colidir com parede
5. **button-click.mp3** - Toca ao selecionar um comando ou clicar em botões

### Música de Fundo

- **background-music.mp3** - Música de fundo que toca durante o jogo (em loop)

## Como Adicionar Seus Próprios Sons

1. **Baixe ou crie seus arquivos de áudio** (formato MP3 recomendado)

2. **Coloque os arquivos na pasta `public/sounds/`**:
   ```
   public/sounds/
   ├── move.mp3
   ├── key-collect.mp3
   ├── goal-reach.mp3
   ├── collision.mp3
   ├── button-click.mp3
   └── background-music.mp3
   ```

3. **O sistema carregará automaticamente** os sons quando o jogo iniciar

4. **Se algum arquivo não existir**, o jogo continuará funcionando normalmente (sem o som correspondente)

## Onde Encontrar Sons Gratuitos

### Efeitos Sonoros
- **Freesound.org** - https://freesound.org/
  - Busque por: "footstep", "step", "collect", "success", "error", "click"
- **Zapsplat.com** - https://www.zapsplat.com/
  - Biblioteca gratuita após cadastro
- **OpenGameArt.org** - https://opengameart.org/
  - Recursos de áudio para jogos

### Música de Fundo
- **Incompetech.com** - https://incompetech.com/
  - Músicas gratuitas de Kevin MacLeod
- **Bensound.com** - https://www.bensound.com/
  - Músicas royalty-free
- **OpenGameArt.org** - Músicas de fundo para jogos

## Especificações Recomendadas

### Efeitos Sonoros
- **Formato**: MP3 ou OGG
- **Qualidade**: 128-192 kbps
- **Duração**: 0.5-2 segundos
- **Volume**: Normalizado (evitar muito alto ou muito baixo)

### Música de Fundo
- **Formato**: MP3 ou OGG
- **Qualidade**: 128-192 kbps
- **Duração**: Qualquer (será repetida em loop)
- **Volume**: Mais baixo que os efeitos (30% padrão)

## Controle de Volume

O sistema já vem com volumes pré-configurados:
- **Efeitos sonoros**: 70% do volume máximo
- **Música de fundo**: 30% do volume máximo

Para ajustar programaticamente:
```javascript
import audioManager from '../utils/audioManager';

// Ajustar volume dos efeitos (0 a 1)
audioManager.setSoundVolume(0.8); // 80%

// Ajustar volume da música (0 a 1)
audioManager.setMusicVolume(0.4); // 40%

// Desativar/ativar áudio
audioManager.setEnabled(false); // Desativa tudo
audioManager.setEnabled(true);  // Ativa tudo
```

## Eventos com Som

Os seguintes eventos já estão integrados com sons:

### No Labirinto
- ✅ Movimento do personagem
- ✅ Coleta de chave
- ✅ Chegada no destino
- ✅ Colisão com parede
- ✅ Seleção de comando (bloco de comando)
- ✅ Botão "Executar Comandos"
- ✅ Botão "Resetar"
- ✅ Botão "Limpar"
- ✅ Botão "Voltar"
- ✅ Música de fundo (inicia automaticamente)

## Personalização

Para adicionar novos sons ou modificar os existentes, edite o arquivo `src/utils/audioManager.js`:

```javascript
const SOUND_PATHS = {
  // Adicione seus novos sons aqui
  meuSom: '/sounds/meu-som.mp3',
  // ...
};
```

Depois, use no código:
```javascript
audioManager.playSound('meuSom');
```

## Notas Importantes

1. **Autoplay Policy**: Alguns navegadores bloqueiam autoplay de áudio. O sistema trata isso automaticamente, mas pode ser necessário uma interação do usuário primeiro.

2. **Performance**: Os sons são carregados sob demanda. Para melhor performance, você pode precarregar:
   ```javascript
   audioManager.preloadSounds();
   ```

3. **Compatibilidade**: O sistema funciona em todos os navegadores modernos que suportam HTML5 Audio API.

## Troubleshooting

### Sons não tocam
- Verifique se os arquivos estão na pasta `public/sounds/`
- Verifique se os nomes dos arquivos estão corretos
- Abra o console do navegador para ver mensagens de erro
- Alguns navegadores exigem interação do usuário antes de tocar áudio

### Música não inicia
- A música só inicia quando o jogo começa
- Verifique se o arquivo `background-music.mp3` existe
- O volume pode estar muito baixo

### Sons muito altos/baixos
- Ajuste os volumes usando `setSoundVolume()` e `setMusicVolume()`
- Ou normalize os arquivos de áudio antes de adicionar ao jogo

