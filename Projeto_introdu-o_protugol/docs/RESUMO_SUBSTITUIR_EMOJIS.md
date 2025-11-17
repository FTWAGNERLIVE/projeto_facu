# Resumo Rápido: Substituir Emojis por JPG

## Passos Rápidos

### 1. Criar pasta e adicionar imagens
```
public/images/
├── lock.jpg (🔒)
├── flag.jpg (🏁)
├── key.jpg (🔑)
├── trash.jpg (🗑️)
├── medal-gold.jpg (🥇)
├── medal-silver.jpg (🥈)
├── medal-bronze.jpg (🥉)
├── reset.jpg (🔄)
├── check.jpg (✓)
└── timer.jpg (⏱️)
```

### 2. Substituir emojis por tags `<img>`

**Padrão geral:**
```javascript
// ANTES
🔒

// DEPOIS
<img src="/images/lock.jpg" alt="Cadeado" />
```

### 3. Adicionar CSS para tamanhos

No arquivo CSS correspondente, adicione:
```css
.inline-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
}
```

### 4. Arquivos a modificar

- `src/components/MazePage.js` - 9 emojis
- `src/components/LevelSelectPage.js` - 9 checks (✓)
- `src/components/QuizPage.js` - 4 emojis

### 5. Testar

Execute `npm start` e verifique se todas as imagens aparecem.

---

**Guia completo:** Veja `SUBSTITUIR_EMOJIS_POR_IMAGENS.md` para instruções detalhadas.

