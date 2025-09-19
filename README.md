# 🎮 Projeto Faculdade - Jogo de Programação Portugol

Um jogo interativo para ensinar programação em Portugol de forma divertida e visual.

## 🚀 Funcionalidades

### 🎯 Área de Jogo
- **Personagem controlável** com comandos Portugol
- **Sistema de pontuação** com obstáculos (pedras +10, árvores -5)
- **3 Fases diferentes** com animações especiais
- **Limites de movimento** para manter o personagem na área

### 📝 Editor de Código
- **Editor Monaco** com syntax highlighting
- **Exemplos pré-definidos** para diferentes níveis
- **Execução em tempo real** do código Portugol
- **Sistema de pausa e retomada**

### 🎯 Guia Visual
- **Setas clicáveis** para movimento manual
- **Modo Manual e Modo Código**
- **Comandos executados** em tempo real
- **Feedback visual** das direções

### 📊 Quiz Interativo
- **10 perguntas** sobre programação Portugol
- **Sistema de ranking** dos alunos
- **Exportação de dados** em arquivos TXT
- **Sidebar com ranking** em tempo real

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **Monaco Editor** - Editor de código
- **CSS3** - Estilização e animações
- **JavaScript ES6+** - Lógica do jogo
- **Local Storage** - Persistência de dados

## 🚀 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/FTWAGNERLIVE/projeto_facu.git
   cd projeto_facu
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o projeto:**
   ```bash
   npm start
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

## 🎮 Como Jogar

### Comandos Portugol Suportados
- `x := x + valor` - Move para direita
- `x := x - valor` - Move para esquerda  
- `y := y + valor` - Move para baixo
- `y := y - valor` - Move para cima
- `escreva("texto")` - Mostra mensagem

### Fases do Jogo
- **Fase 1:** Sistema de pontuação com obstáculos
- **Fase 2:** Personagem roda em círculo
- **Fase 3:** Personagem executa dança

### Guia Visual
- **Modo Manual:** Clique nas setas para mover
- **Modo Código:** Execute código Portugol automaticamente

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── GameArea.js          # Área principal do jogo
│   ├── GameArea.css         # Estilos do jogo
│   ├── GuidePage.js         # Guia visual
│   ├── GuidePage.css        # Estilos do guia
│   └── QuizPage.js          # Quiz interativo
├── data/
│   └── examples.js          # Exemplos de código
├── utils/
│   └── PortugolInterpreter.js # Interpretador Portugol
└── App.js                   # Componente principal
```

## 🎯 Objetivos Educacionais

- **Aprender programação** de forma visual e interativa
- **Praticar comandos** básicos de Portugol
- **Entender conceitos** de coordenadas e movimento
- **Desenvolver lógica** de programação

## 📊 Recursos do Quiz

- **Ranking automático** dos alunos
- **Exportação de dados** para análise
- **Perguntas variadas** sobre Portugol
- **Sistema de pontuação** justo

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**FTWAGNERLIVE**
- GitHub: [@FTWAGNERLIVE](https://github.com/FTWAGNERLIVE)

## 🙏 Agradecimentos

- React Team pela excelente framework
- Monaco Editor pela ferramenta de edição
- Comunidade Portugol pelo suporte educacional