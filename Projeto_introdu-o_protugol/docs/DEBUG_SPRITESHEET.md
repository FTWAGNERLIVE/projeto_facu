# Debug do Spritesheet

## Problema: Imagem aparece mas está "bugada"

Se a imagem aparece mas não está funcionando corretamente como spritesheet, o problema geralmente é com o `background-size` ou `background-position`.

## Como Verificar o Layout do Seu Spritesheet

1. Abra a imagem `src/assets/images/player.png` em um editor de imagens
2. Verifique:
   - Quantas **colunas** tem? (geralmente 4: down, left, right, up)
   - Quantas **linhas** tem? (geralmente 2: idle, walking)
   - Qual o **tamanho de cada frame**? (ex: 32x32, 48x48, 64x64)

## Ajustar o Background-Size

O `background-size` atual está configurado para **4 colunas x 2 linhas** (`400% 200%`).

Se seu spritesheet for diferente, ajuste no arquivo `MazePage.css`:

```css
.player-sprite {
  background-size: 400% 200%; /* 4 colunas x 2 linhas */
  /* Se tiver 4 linhas: */
  /* background-size: 400% 400%; */
  /* Se tiver 3 colunas: */
  /* background-size: 300% 200%; */
}
```

## Ajustar o Background-Position

Para um spritesheet com **4 colunas x 2 linhas**:

- **Coluna 1 (Down):** 0%
- **Coluna 2 (Left):** 33.333%
- **Coluna 3 (Right):** 66.666%
- **Coluna 4 (Up):** 100%

- **Linha 1 (Idle):** 0%
- **Linha 2 (Walking):** 50%

## Teste Rápido

1. Abra o DevTools (F12)
2. Vá na aba **Elements**
3. Selecione o elemento `.player-sprite`
4. No painel de estilos, teste diferentes valores de `background-position`
5. Quando encontrar o valor correto, atualize no CSS

## Valores Atuais Configurados

- **Down Idle:** `0% 0%`
- **Down Walking:** `0% 50%`
- **Left Idle:** `33.333% 0%`
- **Left Walking:** `33.333% 50%`
- **Right Idle:** `66.666% 0%`
- **Right Walking:** `66.666% 50%`
- **Up Idle:** `100% 0%`
- **Up Walking:** `100% 50%`

## Se o Spritesheet Tiver Layout Diferente

Se seu spritesheet tiver uma ordem diferente (ex: up, down, left, right), você precisará ajustar os valores de `background-position` nas classes correspondentes.

## Exemplo de Ajuste Manual

Se a imagem está aparecendo cortada ou na posição errada:

1. No DevTools, selecione `.player-char.facing-down.idle .player-sprite`
2. Edite o `background-position` diretamente no DevTools
3. Teste valores como: `0% 0%`, `25% 0%`, `50% 0%`, etc.
4. Quando encontrar o valor correto, atualize no arquivo CSS

