export const portugolExamples = {
  basic: {
    title: "🚀 Exemplo Básico - Primeiros Passos",
    code: `algoritmo "Primeiros Passos"
var
    x, y: inteiro
inicio
    // Posição inicial
    x := 100
    y := 100
    escreva("Personagem iniciando...")
    
    // Movimento simples
    x := x + 50
    escreva("Movendo para direita...")
    
    y := y + 30
    escreva("Movendo para baixo...")
    
    escreva("Movimento concluído!")
fimalgoritmo`
  },

  square: {
    title: "⬜ Exemplo Intermediário - Desenhar Quadrado",
    code: `algoritmo "Desenhar Quadrado"
var
    x, y: inteiro
inicio
    // Posição inicial
    x := 50
    y := 50
    escreva("Iniciando desenho do quadrado...")
    
    // Lado superior
    x := x + 100
    escreva("Desenhando lado superior...")
    
    // Lado direito
    y := y + 100
    escreva("Desenhando lado direito...")
    
    // Lado inferior
    x := x - 100
    escreva("Desenhando lado inferior...")
    
    // Lado esquerdo
    y := y - 100
    escreva("Desenhando lado esquerdo...")
    
    escreva("Quadrado desenhado com sucesso!")
fimalgoritmo`
  },

  spiral: {
    title: "🌀 Exemplo Avançado - Espiral",
    code: `algoritmo "Espiral"
var
    x, y, passo: inteiro
inicio
    // Posição inicial
    x := 200
    y := 200
    passo := 20
    escreva("Iniciando espiral...")
    
    // Movimento em espiral
    x := x + passo
    escreva("Passo 1...")
    
    y := y + passo
    escreva("Passo 2...")
    
    x := x - passo
    escreva("Passo 3...")
    
    y := y - passo
    escreva("Passo 4...")
    
    x := x + passo
    escreva("Passo 5...")
    
    y := y + passo
    escreva("Passo 6...")
    
    x := x - passo
    escreva("Passo 7...")
    
    y := y - passo
    escreva("Passo 8...")
    
    escreva("Espiral concluída!")
fimalgoritmo`
  },

  random: {
    title: "🎲 Exemplo Criativo - Movimento Aleatório",
    code: `algoritmo "Movimento Aleatório"
var
    x, y: inteiro
inicio
    // Posição inicial
    x := 150
    y := 150
    escreva("Iniciando movimento aleatório...")
    
    // Movimentos variados
    x := x + 80
    escreva("Movimento 1: Direita...")
    
    y := y - 40
    escreva("Movimento 2: Cima...")
    
    x := x - 60
    escreva("Movimento 3: Esquerda...")
    
    y := y + 70
    escreva("Movimento 4: Baixo...")
    
    x := x + 30
    escreva("Movimento 5: Direita...")
    
    y := y - 20
    escreva("Movimento 6: Cima...")
    
    x := x - 40
    escreva("Movimento 7: Esquerda...")
    
    y := y + 50
    escreva("Movimento 8: Baixo...")
    
    escreva("Movimento aleatório concluído!")
fimalgoritmo`
  },

  challenge: {
    title: "🏆 Desafio - Navegar pelos Obstáculos",
    code: `algoritmo "Navegar pelos Obstáculos"
var
    x, y: inteiro
inicio
    // Posição inicial
    x := 50
    y := 50
    escreva("Iniciando navegação pelos obstáculos...")
    
    // Navegação cuidadosa
    x := x + 40
    escreva("Movendo para direita...")
    
    y := y + 60
    escreva("Descendo...")
    
    x := x + 50
    escreva("Continuando para direita...")
    
    y := y - 30
    escreva("Subindo...")
    
    x := x + 40
    escreva("Finalizando movimento...")
    
    y := y + 20
    escreva("Ajuste final...")
    
    escreva("Navegação concluída com sucesso!")
fimalgoritmo`
  },

  limits: {
    title: "⚠️ Exemplo de Limites - Testando Fronteiras",
    code: `algoritmo "Testando Limites de Movimento"
var
    x, y: inteiro
inicio
    // Posição inicial
    x := 100
    y := 100
    escreva("Testando limites de movimento...")
    
    // Tentar sair dos limites (será limitado)
    x := 500  // Muito à direita
    escreva("Tentando ir muito à direita...")
    
    y := 400  // Muito para baixo
    escreva("Tentando ir muito para baixo...")
    
    x := 10   // Muito à esquerda
    escreva("Tentando ir muito à esquerda...")
    
    y := 5    // Muito para cima
    escreva("Tentando ir muito para cima...")
    
    // Movimento dentro dos limites
    x := 200
    y := 150
    escreva("Movimento dentro dos limites!")
    
    escreva("Teste de limites concluído!")
fimalgoritmo`
  },

  guide: {
    title: "🎯 Exemplo Guia Visual - Movimento Direcionado",
    code: `algoritmo "Guia Visual de Movimento"
var
    x, y: inteiro
inicio
    // Posição inicial
    x := 100
    y := 100
    escreva("Iniciando guia visual...")
    
    // Movimento para direita
    x := x + 60
    escreva("Movendo para direita...")
    
    // Movimento para baixo
    y := y + 40
    escreva("Movendo para baixo...")
    
    // Movimento para esquerda
    x := x - 30
    escreva("Movendo para esquerda...")
    
    // Movimento para cima
    y := y - 20
    escreva("Movendo para cima...")
    
    // Movimento em L
    x := x + 50
    escreva("Completando movimento em L...")
    
    y := y + 30
    escreva("Finalizando trajetória...")
    
    escreva("Guia visual concluída!")
fimalgoritmo`
  }
};

export const getExampleByKey = (key) => {
  return portugolExamples[key] || portugolExamples.basic;
};

export const getAllExamples = () => {
  return Object.keys(portugolExamples).map(key => ({
    key,
    ...portugolExamples[key]
  }));
};
