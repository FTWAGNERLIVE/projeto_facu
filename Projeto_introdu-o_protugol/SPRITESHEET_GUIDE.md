# Guia de Spritesheet do Personagem

## Estrutura do Spritesheet

O sistema de animação está preparado para receber um spritesheet com a seguinte estrutura:

### Layout Esperado

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Down-Idle  │  Left-Idle  │ Right-Idle  │   Up-Idle   │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Down-Walk 1 │ Left-Walk 1 │Right-Walk 1 │  Up-Walk 1  │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Down-Walk 2 │ Left-Walk 2 │Right-Walk 2 │  Up-Walk 2  │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Down-Walk 3 │ Left-Walk 3 │Right-Walk 3 │  Up-Walk 3  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Especificações Técnicas

- **Colunas:** 4 (direções: Down, Left, Right, Up)
- **Linhas:** 4 (1 idle + 3 frames de walking)
- **Tamanho recomendado por frame:** 50x50px ou 64x64px
- **Tamanho total do spritesheet:** 200x200px (50px) ou 256x256px (64px)

### Alternativa Simplificada (2 linhas)

Se preferir uma versão mais simples com apenas 2 linhas:

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Down-Idle  │  Left-Idle  │ Right-Idle  │   Up-Idle   │
├─────────────┼─────────────┼─────────────┼─────────────┤
│  Down-Walk  │  Left-Walk  │  Right-Walk │   Up-Walk   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

Neste caso, a animação de walking será feita com 4 frames da mesma linha usando `steps(4)`.

## Como Adicionar o Spritesheet

### Passo 1: Criar a Pasta de Sprites

Crie a pasta `public/sprites/` no projeto (se não existir).

### Passo 2: Adicionar a Imagem

Coloque o spritesheet na pasta `public/sprites/` com o nome `player.png`.

### Passo 3: Atualizar o CSS

No arquivo `src/components/MazePage.css`, descomente as linhas `background-image` em cada animação:

```css
/* Exemplo para Down-Idle */
.player-char.facing-down.idle .player-sprite {
  background-image: url('/sprites/player.png'); /* Descomente esta linha */
  background-position: 0% 0%;
  animation: idle-down 1s steps(1) infinite;
}
```

Faça isso para todas as 8 animações:
- `facing-down.idle`
- `facing-down.walking`
- `facing-left.idle`
- `facing-left.walking`
- `facing-right.idle`
- `facing-right.walking`
- `facing-up.idle`
- `facing-up.walking`

### Passo 4: Remover os Placeholders de Emoji

Após adicionar o spritesheet, você pode remover ou comentar as regras `::before` que usam emojis:

```css
/* Remover ou comentar estas linhas após adicionar o spritesheet */
.player-char.facing-down.idle .player-sprite::before {
  content: '😊';
}
```

## Ajustes de Posicionamento

Se o spritesheet tiver um tamanho diferente, ajuste o `background-size`:

```css
.player-sprite {
  background-size: 400% 200%; /* 4 colunas x 2 linhas */
  /* Ou se tiver 4 linhas: */
  /* background-size: 400% 400%; */
}
```

## Estados e Animações

### Estados Disponíveis

1. **Idle (Parado):** Personagem esperando, sem movimento
2. **Walking (Andando):** Personagem em movimento

### Direções

1. **Down:** Olhando para baixo (padrão inicial)
2. **Left:** Olhando para esquerda
3. **Right:** Olhando para direita
4. **Up:** Olhando para cima

### Classes CSS Aplicadas

O personagem recebe automaticamente as classes:
- `facing-{direction}` - Direção atual (down, left, right, up)
- `idle` ou `walking` - Estado atual
- `slide-{direction}` - Durante o movimento (transição)

## Exemplo de Spritesheet

### Ferramentas Recomendadas

- **Aseprite** - Editor de sprites profissional
- **Piskel** - Editor online gratuito
- **Photoshop/GIMP** - Editores de imagem tradicionais

### Dicas de Design

1. **Consistência:** Mantenha o mesmo estilo em todos os frames
2. **Tamanho:** Use múltiplos de 50px ou 64px para facilitar
3. **Transparência:** Use fundo transparente (PNG)
4. **Cores:** Considere o esquema de cores do jogo
5. **Animação:** Walking deve ter 3-4 frames para fluidez

## Testando

Após adicionar o spritesheet:

1. Execute o projeto: `npm start`
2. Teste cada direção movendo o personagem
3. Verifique se as animações estão suaves
4. Ajuste os tempos de animação se necessário (atualmente 0.6s para walking)

## Troubleshooting

### Spritesheet não aparece
- Verifique se o caminho está correto: `/sprites/player.png`
- Confirme que o arquivo está em `public/sprites/player.png`
- Limpe o cache do navegador (Ctrl+F5)

### Animação não funciona
- Verifique se `background-size` está correto
- Confirme que `background-position` está nas porcentagens corretas
- Teste com `animation-play-state: running`

### Frames desalinhados
- Ajuste `background-position` para cada frame
- Verifique se o spritesheet tem o tamanho correto
- Use `background-size` para escalar corretamente

## Estrutura Atual (Placeholder)

Atualmente, o sistema usa emojis como placeholder:
- **Down:** 😊
- **Left:** 😐
- **Right:** 😊 (espelhado)
- **Up:** 🙂

Esses emojis mudam ligeiramente durante a animação de walking para simular movimento.

