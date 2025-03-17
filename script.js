// Script.js corretto - da usare come type="text/babel"

// Componente principale dell'applicazione
function QuizApp() {
  // Verifica che quizData sia disponibile
  if (!window.quizData || !Array.isArray(window.quizData) || window.quizData.length === 0) {
    console.error("quizData non è disponibile o non è un array");
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-800">Errore di caricamento</h1>
        <p className="text-center text-gray-600">
          Non è stato possibile caricare i dati del quiz. Controlla la console per maggiori dettagli.
        </p>
      </div>
    );
  }

  const [domande, setDomande] = React.useState(window.quizData || []);
  const [indiceDomandaCorrente, setIndiceDomandaCorrente] = React.useState(0);
  const [rispostaSelezionata, setRispostaSelezionata] = React.useState('');
  const [risultatiQuiz, setRisultatiQuiz] = React.useState({
    corrette: 0,
    errate: 0,
    totale: 0,
    punteggio: 0
  });
  const [showResults, setShowResults] = React.useState(false);
  const [feedback, setFeedback] = React.useState(null);
// Icone semplici con caratteri HTML
const ICONS = {
  CheckCircle: "✓", 
  AlertTriangle: "⚠",
  ArrowRight: "→",
  RotateCw: "↻",
  Trophy: "★"
};
  // Handler per la selezione di una risposta
  const handleRispostaClick = (risposta) => {
    if (feedback) return; // Impedisci di cambiare risposta dopo il feedback
    
    setRispostaSelezionata(risposta);
    
    // Controlla se la risposta è corretta
    const domandaCorrente = domande[indiceDomandaCorrente];
    const isCorretta = risposta === domandaCorrente.rispostaEsatta;
    
    // Aggiorna il conteggio delle risposte
    setRisultatiQuiz({
      ...risultatiQuiz,
      corrette: isCorretta ? risultatiQuiz.corrette + 1 : risultatiQuiz.corrette,
      errate: !isCorretta ? risultatiQuiz.errate + 1 : risultatiQuiz.errate,
      totale: risultatiQuiz.totale + 1,
      punteggio: isCorretta ? risultatiQuiz.punteggio + 10 : risultatiQuiz.punteggio
    });
    
    // Mostra feedback
    setFeedback({
      corretta: isCorretta,
      messaggio: isCorretta ? "Risposta corretta!" : "Risposta sbagliata",
      rispostaCorretta: domandaCorrente.rispostaEsatta
    });
  };

  // Handler per passare alla domanda successiva
  const handleNextQuestion = () => {
    if (indiceDomandaCorrente < domande.length - 1) {
      setIndiceDomandaCorrente(indiceDomandaCorrente + 1);
      setRispostaSelezionata('');
      setFeedback(null);
    } else {
      // Quiz completato
      setShowResults(true);
    }
  };

  // Handler per ricominciare il quiz
  const handleRestartQuiz = () => {
    setIndiceDomandaCorrente(0);
    setRispostaSelezionata('');
    setRisultatiQuiz({
      corrette: 0,
      errate: 0,
      totale: 0,
      punteggio: 0
    });
    setShowResults(false);
    setFeedback(null);
  };

  // Renderizzo i risultati finali se il quiz è completato
  if (showResults) {
    const percentualeCorrette = Math.round((risultatiQuiz.corrette / domande.length) * 100);
    
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Risultati del Quiz</h1>
        
        <div className="mb-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {percentualeCorrette >= 70 ? "Ottimo lavoro!" : "Continua a studiare!"}
            </h2>
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-3xl text-yellow-300">{ICONS.Trophy}</span>
              <span className="text-3xl font-black">{risultatiQuiz.punteggio}</span>
              <span className="text-sm opacity-80">punti</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <div className="font-bold text-2xl text-green-300">{risultatiQuiz.corrette}</div>
                <div className="text-xs">Corrette</div>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <div className="font-bold text-2xl text-red-300">{risultatiQuiz.errate}</div>
                <div className="text-xs">Errate</div>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <div className="font-bold text-2xl">{percentualeCorrette}%</div>
                <div className="text-xs">Percentuale</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={handleRestartQuiz} 
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <span className="text-2xl mr-2">{ICONS.RotateCw}</span> RICOMINCIA QUIZ
          </button>
        </div>
      </div>
    );
  }

  // Ottenere la domanda corrente
  const domandaCorrente = domande[indiceDomandaCorrente];

  // Renderizza la schermata principale del quiz
  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl mx-auto w-full">
      {/* Header con stats */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-800 mb-2 sm:mb-0">Quiz dell'Arbitro</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-green-100 rounded-full px-3 py-1">
            <span className="text-xl text-green-600 mr-1">{ICONS.CheckCircle}</span>
            <span className="font-bold">{risultatiQuiz.corrette}</span>
          </div>
          <div className="flex items-center bg-red-100 rounded-full px-3 py-1">
            <span className="text-xl text-red-600 mr-1">{ICONS.AlertTriangle}</span>
            <span className="font-bold">{risultatiQuiz.errate}</span>
          </div>
        </div>
      </div>
      
      {/* Barra di progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-indigo-800 font-medium">{indiceDomandaCorrente + 1}/{domande.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300" 
            style={{width: `${((indiceDomandaCorrente + 1) / domande.length) * 100}%`}}
          ></div>
        </div>
      </div>
      
      {/* Domanda */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-3 py-1 rounded-lg mr-2 shadow-sm">
            #{domandaCorrente.numero}
          </span>
          <span className="text-gray-600 text-sm">Regola {domandaCorrente.regola}</span>
        </div>
        <p className="text-gray-800 font-medium text-lg">{domandaCorrente.domanda}</p>
      </div>
      
      {/* Opzioni di risposta */}
      <div className="space-y-3 mb-6">
        {['A', 'B', 'C'].map((opzione) => (
          <button
            key={opzione}
            onClick={() => handleRispostaClick(opzione)}
            disabled={feedback !== null}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              rispostaSelezionata === opzione 
                ? feedback 
                  ? feedback.corretta 
                    ? 'bg-green-100 border-green-500 shadow-md' 
                    : opzione === feedback.rispostaCorretta 
                      ? 'bg-green-100 border-green-500 shadow-md' 
                      : 'bg-red-100 border-red-500 shadow-md'
                  : 'bg-blue-100 border-blue-500 shadow-md'
                : feedback && opzione === feedback.rispostaCorretta 
                  ? 'bg-green-100 border-green-500 shadow-md' 
                  : 'bg-white border-gray-300 hover:border-blue-400'
            }`}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                rispostaSelezionata === opzione 
                  ? feedback 
                    ? feedback.corretta 
                      ? 'bg-green-500 text-white' 
                      : opzione === feedback.rispostaCorretta 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                  : feedback && opzione === feedback.rispostaCorretta 
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
              }`}>
                <span className="font-bold">{opzione}</span>
              </div>
              <span className="font-medium">{domandaCorrente[`risposta${opzione}`]}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Feedback */}
      {feedback && (
        <div className={`p-4 mb-6 rounded-lg shadow-md ${feedback.corretta ? 'bg-green-100 border-l-4 border-l-green-500' : 'bg-red-100 border-l-4 border-l-red-500'}`}>
          <div className="flex items-center">
            {feedback.corretta ? (
              <span className="text-3xl mr-3">{ICONS.CheckCircle}</span>
            ) : (
              <span className="text-3xl mr-3">{ICONS.AlertTriangle}</span>
            )}
            <div>
              <p className={`text-lg font-bold ${feedback.corretta ? 'text-green-800' : 'text-red-800'}`}>
                {feedback.messaggio}
              </p>
              {!feedback.corretta && (
                <p className="mt-1 text-green-700 font-medium">
                  La risposta corretta è: {feedback.rispostaCorretta}. {domandaCorrente[`risposta${feedback.rispostaCorretta}`]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Bottoni azione */}
      <div className="flex justify-between">
        <button 
          onClick={handleRestartQuiz} 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all flex items-center"
        >
          <span className="text-xl mr-1">{ICONS.RotateCw}</span> Ricomincia
        </button>
        
        {rispostaSelezionata && (
          <button 
            onClick={handleNextQuestion} 
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center font-bold"
          >
            {indiceDomandaCorrente < domande.length - 1 ? (
              <>Prossima <span className="text-xl ml-1">{ICONS.ArrowRight}</span></>
            ) : (
              <>Risultati <span className="text-xl ml-1">{ICONS.Trophy}</span></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Renderizza l'app nel contenitore root
ReactDOM.render(<QuizApp />, document.getElementById('root'));
