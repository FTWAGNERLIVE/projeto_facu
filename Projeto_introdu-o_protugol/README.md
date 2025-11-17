# Quiz de Lógica de Programação em Portugol

Um quiz interativo para testar conhecimentos sobre programação em Portugol, com suporte para controles de jogo (PS4) e sistema de labirintos programáveis.

## Funcionalidades

### Quiz Interativo
- **10 perguntas** sobre programação Portugol
- **Sistema de ranking** dos alunos
- **Exportação de dados** em arquivos TXT
- **Sidebar com ranking** em tempo real
- **Interface responsiva** e moderna

### Labirinto Programável
- **3 níveis de dificuldade** (Fácil, Médio, Difícil)
- **Sistema de programação visual** com blocos
- **Suporte para controles de jogo** (PS4/Xbox)
- **Sistema de ranking** por dificuldade
- **Mapas aleatórios** para cada partida

## Tecnologias Utilizadas

- **React 18** - Framework principal
- **CSS3** - Estilização e animações
- **JavaScript ES6+** - Lógica do quiz
- **Local Storage** - Persistência de dados

## Como Executar

### Instalação Rápida

1. **Instale o Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Ou via winget: `winget install --id OpenJS.NodeJS -e --source winget`

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

### Documentação Completa

Para instruções detalhadas, solução de problemas e configurações avançadas, consulte os guias na pasta `docs/`:

- **[GUIA_INSTALACAO.md](docs/GUIA_INSTALACAO.md)** - Guia completo de instalação e execução
- **[COMANDOS_RAPIDOS.md](docs/COMANDOS_RAPIDOS.md)** - Referência rápida de comandos
- **[CONFIGURAR_PS4.md](docs/CONFIGURAR_PS4.md)** - Como configurar controle PS4 via Bluetooth
- **[ERRO_NPM_SOLUCAO_RAPIDA.md](docs/ERRO_NPM_SOLUCAO_RAPIDA.md)** - Solução rápida para erro de política do PowerShell
- **[SOLUCAO_ERRO_NPM.md](docs/SOLUCAO_ERRO_NPM.md)** - Guia completo para erro de execução do npm
- **[SOLUCAO_ERRO_LOCALSTORAGE.md](docs/SOLUCAO_ERRO_LOCALSTORAGE.md)** - Solução para erro de localStorage no Node.js 25

## Estrutura do Projeto

```
Projeto_introdu-o_protugol/
├── docs/                    # Documentação e guias
│   ├── GUIA_INSTALACAO.md
│   ├── COMANDOS_RAPIDOS.md
│   ├── CONFIGURAR_PS4.md
│   └── SOLUCAO_ERRO_*.md
├── src/
│   ├── components/
│   │   ├── QuizPage.js      # Componente do quiz
│   │   ├── MazePage.js      # Componente do labirinto
│   │   ├── LevelSelectPage.js # Seleção de níveis
│   │   └── *.css            # Estilos dos componentes
│   ├── App.js               # Componente principal
│   ├── App.css              # Estilos globais
│   └── index.js             # Ponto de entrada
├── public/                  # Arquivos públicos
├── package.json             # Dependências e scripts
└── README.md                # Este arquivo
```

## Recursos do Quiz

- **Ranking automático** dos alunos
- **Exportação de dados** para análise
- **Perguntas variadas** sobre Portugol
- **Sistema de pontuação** justo
- **Explicações detalhadas** para cada questão

## Objetivos Educacionais

- **Testar conhecimentos** de programação em Portugol
- **Praticar conceitos** básicos de lógica de programação
- **Acompanhar progresso** através do ranking
- **Aprender através** das explicações das questões
- **Desenvolver raciocínio lógico** através do jogo de labirinto

## Solução de Problemas Comuns

### Erro: "npm não pode ser carregado"
**Solução:** Consulte [ERRO_NPM_SOLUCAO_RAPIDA.md](docs/ERRO_NPM_SOLUCAO_RAPIDA.md)

### Erro: "Cannot initialize local storage"
**Solução:** Consulte [SOLUCAO_ERRO_LOCALSTORAGE.md](docs/SOLUCAO_ERRO_LOCALSTORAGE.md)

### Controle PS4 não funciona
**Solução:** Consulte [CONFIGURAR_PS4.md](docs/CONFIGURAR_PS4.md)

Para mais soluções, veja a pasta `docs/` com todos os guias disponíveis.

## Requisitos do Sistema

- **Node.js** 18+ (recomendado: LTS)
- **npm** (incluído com Node.js)
- **Navegador moderno** (Chrome, Edge, Firefox)
- **Git** (opcional, para clonar o repositório)
- **DS4Windows** (opcional, para controle PS4 via Bluetooth)
