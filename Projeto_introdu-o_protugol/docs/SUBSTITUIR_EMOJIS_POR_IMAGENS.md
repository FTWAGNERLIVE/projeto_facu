# Guia: Substituir Emojis por Imagens JPG

Este guia explica como substituir todos os emojis do projeto por arquivos de imagem JPG.

## Passo 1: Preparar as Imagens

Crie uma pasta `public/images/` no projeto e adicione as seguintes imagens JPG:

### Imagens Necessárias:

1. **lock.jpg** - Imagem de cadeado (substitui 🔒)
2. **flag.jpg** - Imagem de bandeira de chegada (substitui 🏁)
3. **key.jpg** - Imagem de chave (substitui 🔑)
4. **trash.jpg** - Imagem de lixeira (substitui 🗑️)
5. **medal-gold.jpg** - Medalha de ouro (substitui 🥇)
6. **medal-silver.jpg** - Medalha de prata (substitui 🥈)
7. **medal-bronze.jpg** - Medalha de bronze (substitui 🥉)
8. **reset.jpg** - Ícone de resetar (substitui 🔄)
9. **check.jpg** - Ícone de check/verificado (substitui ✓)
10. **timer.jpg** - Ícone de cronômetro (substitui ⏱️)

### Tamanhos Recomendados:
- Imagens pequenas (lock, key, check, timer): 32x32px ou 48x48px
- Imagens médias (flag, trash, reset): 48x48px ou 64x64px
- Medalhas (gold, silver, bronze): 40x40px ou 48x48px

## Passo 2: Modificar o Arquivo MazePage.js

### 2.1. Substituir emojis no labirinto (linhas 1405-1407)

**ANTES:**
```javascript
{showLock && !isPlayer && <div className="lock-char">🔒</div>}
{isEnd && !isPlayer && !showLock && <div className="end-char">🏁</div>}
{isKey && !isPlayer && !hasKey && <div className="key-char">🔑</div>}
```

**DEPOIS:**
```javascript
{showLock && !isPlayer && <div className="lock-char"><img src="/images/lock.jpg" alt="Cadeado" /></div>}
{isEnd && !isPlayer && !showLock && <div className="end-char"><img src="/images/flag.jpg" alt="Chegada" /></div>}
{isKey && !isPlayer && !hasKey && <div className="key-char"><img src="/images/key.jpg" alt="Chave" /></div>}
```

### 2.2. Substituir emojis nas mensagens de chave (linhas 1456 e 1459)

**ANTES:**
```javascript
<span className="key-required">🔑 Pegue a chave para finalizar!</span>
<span className="key-obtained">🔑 Chave obtida!</span>
```

**DEPOIS:**
```javascript
<span className="key-required">
  <img src="/images/key.jpg" alt="Chave" className="inline-icon" /> Pegue a chave para finalizar!
</span>
<span className="key-obtained">
  <img src="/images/key.jpg" alt="Chave" className="inline-icon" /> Chave obtida!
</span>
```

### 2.3. Substituir emoji do botão de limpar ranking (linha 1557)

**ANTES:**
```javascript
<button className="btn-clear-ranking" onClick={clearRanking} title="Limpar ranking">
  🗑️
</button>
```

**DEPOIS:**
```javascript
<button className="btn-clear-ranking" onClick={clearRanking} title="Limpar ranking">
  <img src="/images/trash.jpg" alt="Limpar" />
</button>
```

### 2.4. Substituir medalhas no ranking (linha 1571)

**ANTES:**
```javascript
{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
```

**DEPOIS:**
```javascript
{index === 0 ? (
  <img src="/images/medal-gold.jpg" alt="1º lugar" className="medal-icon" />
) : index === 1 ? (
  <img src="/images/medal-silver.jpg" alt="2º lugar" className="medal-icon" />
) : index === 2 ? (
  <img src="/images/medal-bronze.jpg" alt="3º lugar" className="medal-icon" />
) : (
  `#${index + 1}`
)}
```

### 2.5. Substituir emoji do botão resetar (linha 1607)

**ANTES:**
```javascript
🔄 Resetar
```

**DEPOIS:**
```javascript
<img src="/images/reset.jpg" alt="Resetar" className="inline-icon" /> Resetar
```

### 2.6. Substituir check de selecionado (linha 1684)

**ANTES:**
```javascript
<div className="block-selected-indicator">✓ Selecionado</div>
```

**DEPOIS:**
```javascript
<div className="block-selected-indicator">
  <img src="/images/check.jpg" alt="Selecionado" className="inline-icon" /> Selecionado
</div>
```

### 2.7. Substituir emoji do cronômetro (linha 1451)

**ANTES:**
```javascript
{isTimerRunning && <span className="timer-running">⏱️</span>}
```

**DEPOIS:**
```javascript
{isTimerRunning && <span className="timer-running"><img src="/images/timer.jpg" alt="Cronômetro" className="inline-icon" /></span>}
```

## Passo 3: Modificar o Arquivo LevelSelectPage.js

### 3.1. Substituir checks de lista (linhas 161-197)

**ANTES:**
```javascript
<span>✓ Preview visual</span>
<span>✓ Mapas menores</span>
```

**DEPOIS:**
```javascript
<span><img src="/images/check.jpg" alt="Check" className="inline-icon" /> Preview visual</span>
<span><img src="/images/check.jpg" alt="Check" className="inline-icon" /> Mapas menores</span>
```

## Passo 4: Modificar o Arquivo QuizPage.js

### 4.1. Substituir check e X nas questões (linha 175)

**ANTES:**
```javascript
return `Questão ${index + 1}: ${isCorrect ? '✓ CORRETA' : '✗ INCORRETA'}
```

**DEPOIS:**
Você precisará criar também uma imagem `wrong.jpg` ou `x.jpg` para o X:
```javascript
return (
  <span>
    Questão {index + 1}: {isCorrect ? (
      <><img src="/images/check.jpg" alt="Correta" className="inline-icon" /> CORRETA</>
    ) : (
      <><img src="/images/wrong.jpg" alt="Incorreta" className="inline-icon" /> INCORRETA</>
    )}
  </span>
);
```

### 4.2. Substituir emoji do botão "Fazer Novamente" (linha 292)

**ANTES:**
```javascript
🔄 Fazer Novamente
```

**DEPOIS:**
```javascript
<img src="/images/reset.jpg" alt="Resetar" className="inline-icon" /> Fazer Novamente
```

### 4.3. Substituir medalhas no ranking (linha 358)

Use o mesmo código do Passo 2.4 acima.

## Passo 5: Adicionar Estilos CSS

Adicione estas classes no arquivo `MazePage.css` (ou nos arquivos CSS correspondentes):

```css
/* Estilos para ícones inline */
.inline-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
  display: inline-block;
}

/* Estilos para ícones no labirinto */
.lock-char img,
.end-char img,
.key-char img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Estilos para medalhas */
.medal-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

/* Estilos para botões com imagens */
.btn-clear-ranking img {
  width: 20px;
  height: 20px;
}

/* Ajustar tamanho do ícone de cronômetro */
.timer-running img {
  width: 18px;
  height: 18px;
  margin-left: 4px;
}
```

## Passo 6: Verificar

1. Certifique-se de que todas as imagens estão na pasta `public/images/`
2. Execute o projeto: `npm start`
3. Verifique se todas as imagens aparecem corretamente
4. Ajuste os tamanhos no CSS se necessário

## Dicas

- Use imagens com fundo transparente (PNG) se possível, ou JPG com fundo branco/transparente
- Mantenha as imagens pequenas para não aumentar muito o tamanho do projeto
- Teste em diferentes tamanhos de tela para garantir que as imagens ficam proporcionais
- Se alguma imagem não aparecer, verifique o console do navegador para erros 404

## Estrutura Final de Pastas

```
Projeto_introdu-o_protugol/
├── public/
│   ├── images/
│   │   ├── lock.jpg
│   │   ├── flag.jpg
│   │   ├── key.jpg
│   │   ├── trash.jpg
│   │   ├── medal-gold.jpg
│   │   ├── medal-silver.jpg
│   │   ├── medal-bronze.jpg
│   │   ├── reset.jpg
│   │   ├── check.jpg
│   │   ├── timer.jpg
│   │   └── wrong.jpg (opcional, para QuizPage)
│   └── ...
└── ...
```

