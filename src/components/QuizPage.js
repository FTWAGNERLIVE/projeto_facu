import React, { useState, useEffect } from 'react';
import './QuizPage.css';

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [ranking, setRanking] = useState([]);

  const questions = [
    {
      id: 1,
      question: "Qual é a saída do seguinte código Portugol?\n\nvar\n    a, b: inteiro\ninicio\n    a := 5\n    b := 3\n    a := a + b\n    escreva(a)\nfimalgoritmo",
      options: ["5", "8", "3", "15"],
      correct: 1,
      explanation: "a começa com 5, b com 3. a := a + b resulta em a = 5 + 3 = 8"
    },
    {
      id: 2,
      question: "O que acontece quando executamos este código?\n\nvar\n    x: inteiro\ninicio\n    x := 10\n    se x > 5 entao\n        escreva(\"Maior que 5\")\n    senao\n        escreva(\"Menor ou igual a 5\")\n    fimse\nfimalgoritmo",
      options: ["Imprime 'Maior que 5'", "Imprime 'Menor ou igual a 5'", "Erro de compilação", "Nada é impresso"],
      correct: 0,
      explanation: "Como x = 10 e 10 > 5, a condição é verdadeira e imprime 'Maior que 5'"
    },
    {
      id: 3,
      question: "Quantas vezes o loop executa?\n\nvar\n    i: inteiro\ninicio\n    para i de 1 ate 5 faca\n        escreva(i)\n    fimpara\nfimalgoritmo",
      options: ["4 vezes", "5 vezes", "6 vezes", "1 vez"],
      correct: 1,
      explanation: "O loop 'para i de 1 ate 5' executa 5 vezes (i = 1, 2, 3, 4, 5)"
    },
    {
      id: 4,
      question: "Qual é o valor final de 'soma'?\n\nvar\n    soma, i: inteiro\ninicio\n    soma := 0\n    para i de 1 ate 3 faca\n        soma := soma + i\n    fimpara\n    escreva(soma)\nfimalgoritmo",
      options: ["0", "3", "6", "9"],
      correct: 2,
      explanation: "soma = 0 + 1 + 2 + 3 = 6"
    },
    {
      id: 5,
      question: "O que será impresso?\n\nvar\n    num: inteiro\ninicio\n    num := 7\n    se num % 2 = 0 entao\n        escreva(\"Par\")\n    senao\n        escreva(\"Ímpar\")\n    fimse\nfimalgoritmo",
      options: ["Par", "Ímpar", "Erro", "Nada"],
      correct: 1,
      explanation: "7 % 2 = 1 (resto da divisão), que não é igual a 0, então é ímpar"
    },
    {
      id: 6,
      question: "Qual é a saída do código?\n\nvar\n    a, b, temp: inteiro\ninicio\n    a := 10\n    b := 20\n    temp := a\n    a := b\n    b := temp\n    escreva(a, \" \", b)\nfimalgoritmo",
      options: ["10 20", "20 10", "10 10", "20 20"],
      correct: 1,
      explanation: "O código troca os valores: temp=10, a=20, b=10"
    },
    {
      id: 7,
      question: "Quantas iterações executa este loop?\n\nvar\n    cont: inteiro\ninicio\n    cont := 1\n    enquanto cont < 5 faca\n        cont := cont + 2\n    fimenquanto\nfimalgoritmo",
      options: ["2 iterações", "3 iterações", "4 iterações", "5 iterações"],
      correct: 0,
      explanation: "cont=1, depois 3, depois 5. Como 5 não é < 5, para. Total: 2 iterações"
    },
    {
      id: 8,
      question: "O que acontece com este código?\n\nvar\n    x: inteiro\ninicio\n    x := 0\n    repita\n        x := x + 1\n    ate x >= 3\n    escreva(x)\nfimalgoritmo",
      options: ["Imprime 0", "Imprime 3", "Loop infinito", "Erro"],
      correct: 1,
      explanation: "O loop repita...ate executa até x >= 3. x vai de 0 para 1, 2, 3. Para quando x=3"
    },
    {
      id: 9,
      question: "Qual é o resultado da expressão?\n\nvar\n    resultado: inteiro\ninicio\n    resultado := (2 + 3) * 4 - 1\n    escreva(resultado)\nfimalgoritmo",
      options: ["19", "15", "23", "11"],
      correct: 0,
      explanation: "(2 + 3) * 4 - 1 = 5 * 4 - 1 = 20 - 1 = 19"
    },
    {
      id: 10,
      question: "O que será impresso?\n\nvar\n    i, j: inteiro\ninicio\n    para i de 1 ate 2 faca\n        para j de 1 ate 2 faca\n            escreva(i * j, \" \")\n        fimpara\n    fimpara\nfimalgoritmo",
      options: ["1 2 2 4", "1 2 3 4", "2 4 6 8", "1 1 2 2"],
      correct: 0,
      explanation: "i=1: j=1→1*1=1, j=2→1*2=2. i=2: j=1→2*1=2, j=2→2*2=4"
    }
  ];

  // Carregar ranking do localStorage
  useEffect(() => {
    const savedRanking = localStorage.getItem('quizRanking');
    if (savedRanking) {
      setRanking(JSON.parse(savedRanking));
    }
  }, []);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowNameInput(true);
  };

  const submitScore = () => {
    if (playerName.trim()) {
      const newEntry = {
        name: playerName.trim(),
        score: score,
        total: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        date: new Date().toLocaleDateString('pt-BR'),
        timestamp: new Date().toISOString()
      };
      
      const newRanking = [...ranking, newEntry]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10); // Top 10
      
      setRanking(newRanking);
      localStorage.setItem('quizRanking', JSON.stringify(newRanking));
      
      // Salvar no arquivo TXT
      saveToFile(newEntry);
      
      setShowResults(true);
    }
  };

  const saveToFile = (entry) => {
    // Dados para o arquivo individual
    const individualData = `===============================================
        RESULTADO DO QUIZ - ${entry.name.toUpperCase()}
        Data: ${entry.date}
        Horário: ${new Date().toLocaleTimeString('pt-BR')}
===============================================

Nome: ${entry.name}
Nota: ${entry.score} de ${entry.total} questões
Porcentagem: ${entry.percentage}%
Data: ${entry.date}
Timestamp: ${entry.timestamp}

===============================================
        DETALHES DAS RESPOSTAS
===============================================

${questions.map((q, index) => {
  const userAnswer = answers[q.id];
  const isCorrect = userAnswer === q.correct;
  const correctAnswer = q.options[q.correct];
  const userAnswerText = userAnswer !== undefined ? q.options[userAnswer] : 'Não respondida';
  
  return `Questão ${index + 1}: ${isCorrect ? '✓ CORRETA' : '✗ INCORRETA'}
Pergunta: ${q.question.split('\n')[0]}
Sua resposta: ${userAnswerText}
Resposta correta: ${correctAnswer}
Explicação: ${q.explanation}
`;
}).join('\n')}

===============================================
        FIM DO RELATÓRIO
===============================================`;

    // Dados para o arquivo de registro geral
    const generalData = `\n${entry.timestamp} | ${entry.name} | ${entry.score}/${entry.total} | ${entry.percentage}% | ${entry.date}`;
    
    // Salvar arquivo individual
    const individualBlob = new Blob([individualData], { type: 'text/plain' });
    const individualUrl = URL.createObjectURL(individualBlob);
    const individualLink = document.createElement('a');
    individualLink.href = individualUrl;
    individualLink.download = `quiz_result_${entry.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(individualLink);
    individualLink.click();
    document.body.removeChild(individualLink);
    URL.revokeObjectURL(individualUrl);
    
    // Salvar no arquivo de registro geral
    const generalBlob = new Blob([generalData], { type: 'text/plain' });
    const generalUrl = URL.createObjectURL(generalBlob);
    const generalLink = document.createElement('a');
    generalLink.href = generalUrl;
    generalLink.download = `REGISTRO_QUIZ_ATUALIZADO.txt`;
    document.body.appendChild(generalLink);
    generalLink.click();
    document.body.removeChild(generalLink);
    URL.revokeObjectURL(generalUrl);
  };

  const exportRanking = () => {
    const rankingData = `===============================================
        RANKING COMPLETO - QUIZ PORTUGOL
        Data de Exportação: ${new Date().toLocaleDateString('pt-BR')}
        Horário: ${new Date().toLocaleTimeString('pt-BR')}
===============================================

Posição | Nome | Nota | Porcentagem | Data
--------|------|------|-------------|-----
${ranking.map((entry, index) => 
  `${(index + 1).toString().padStart(8)} | ${entry.name.padEnd(20)} | ${entry.score}/${entry.total} | ${entry.percentage.toString().padStart(11)}% | ${entry.date}`
).join('\n')}

===============================================
        ESTATÍSTICAS GERAIS
===============================================

Total de Participantes: ${ranking.length}
Média de Pontuação: ${ranking.length > 0 ? Math.round(ranking.reduce((sum, entry) => sum + entry.percentage, 0) / ranking.length) : 0}%
Maior Pontuação: ${ranking.length > 0 ? Math.max(...ranking.map(entry => entry.percentage)) : 0}%
Menor Pontuação: ${ranking.length > 0 ? Math.min(...ranking.map(entry => entry.percentage)) : 0}%

===============================================
        FIM DO RANKING
===============================================`;

    const blob = new Blob([rankingData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RANKING_QUIZ_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setShowResults(false);
    setShowNameInput(false);
    setPlayerName('');
  };

  if (showResults) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>🏆 Resultados do Questionário</h1>
        </div>
        
        <div className="results-section">
          <div className="score-display">
            <h2>Parabéns, {playerName}!</h2>
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {questions.length}</span>
            </div>
            <p className="percentage">{Math.round((score / questions.length) * 100)}% de acerto</p>
          </div>

          <div className="ranking-section">
            <h3>🏅 Ranking dos Melhores</h3>
            <div className="ranking-list">
              {ranking.map((entry, index) => (
                <div key={index} className={`ranking-item ${entry.name === playerName ? 'current-player' : ''}`}>
                  <span className="rank-position">#{index + 1}</span>
                  <span className="player-name">{entry.name}</span>
                  <span className="player-score">{entry.percentage}%</span>
                  <span className="player-date">{entry.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quiz-actions">
            <button className="btn btn-primary" onClick={resetQuiz}>
              🔄 Fazer Novamente
            </button>
            <button className="btn btn-secondary" onClick={exportRanking}>
              📊 Exportar Ranking
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="quiz-container">
        <div className="name-input-section">
          <h2>🎉 Parabéns! Você acertou {score} de {questions.length} questões!</h2>
          <p>Digite seu nome para entrar no ranking:</p>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Seu nome"
            className="name-input"
            maxLength={20}
          />
          <button 
            className="btn btn-primary" 
            onClick={submitScore}
            disabled={!playerName.trim()}
          >
            📊 Ver Resultados
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isAnswered = answers[currentQ.id] !== undefined;

  return (
    <div className="quiz-container">
      <div className="quiz-layout">
        {/* Ranking Sidebar */}
        <div className="ranking-sidebar">
          <div className="ranking-header">
            <h3>🏅 Ranking</h3>
            <button 
              className="btn btn-small" 
              onClick={exportRanking}
              title="Exportar Ranking"
            >
              📊
            </button>
          </div>
          
          <div className="ranking-list">
            {ranking.length === 0 ? (
              <div className="no-ranking">
                <p>Nenhum participante ainda</p>
                <small>Complete o quiz para aparecer aqui!</small>
              </div>
            ) : (
              ranking.slice(0, 10).map((entry, index) => (
                <div key={index} className={`ranking-item ${index < 3 ? 'top-three' : ''}`}>
                  <div className="rank-position">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="rank-info">
                    <div className="rank-name">{entry.name}</div>
                    <div className="rank-score">{entry.percentage}%</div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {ranking.length > 0 && (
            <div className="ranking-stats">
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{ranking.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Média:</span>
                <span className="stat-value">
                  {Math.round(ranking.reduce((sum, entry) => sum + entry.percentage, 0) / ranking.length)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Main Quiz Content */}
        <div className="quiz-main">
          <div className="quiz-header">
            <h1>📝 Questionário de Lógica de Programação</h1>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p>Questão {currentQuestion + 1} de {questions.length}</p>
          </div>

          <div className="question-section">
            <div className="question-card">
              <h3>Questão {currentQ.id}</h3>
              <div className="question-code">
                <pre>{currentQ.question}</pre>
              </div>
              
              <div className="options">
                {currentQ.options.map((option, index) => (
                  <label 
                    key={index} 
                    className={`option ${answers[currentQ.id] === index ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={index}
                      checked={answers[currentQ.id] === index}
                      onChange={() => handleAnswer(currentQ.id, index)}
                    />
                    <span className="option-letter">{String.fromCharCode(65 + index)})</span>
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="quiz-actions">
              <button 
                className="btn btn-secondary" 
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                ← Anterior
              </button>
              
              {currentQuestion < questions.length - 1 ? (
                <button 
                  className="btn btn-primary" 
                  onClick={nextQuestion}
                  disabled={!isAnswered}
                >
                  Próxima →
                </button>
              ) : (
                <button 
                  className="btn btn-success" 
                  onClick={nextQuestion}
                  disabled={!isAnswered}
                >
                  Finalizar Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
