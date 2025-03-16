// NOTA: Questo script utilizza quizData importato da domande.js
// Assicurati che domande.js sia caricato prima di questo script

import React, { useState, useEffect } from 'react';

// Sostituisco le icone lucide con emojis
const ICONS = {
  AlertOctagon: "⛔",
  AlertTriangle: "⚠️",
  CheckCircle: "✅", 
  ArrowRight: "➡️",
  RotateCw: "🔄",
  Award: "🏅",
  Trophy: "🏆",
  Clock: "⏱️",
  Zap: "⚡",
  Fire: "🔥",
  Star: "⭐",
  Smile: "😊",
  Frown: "☹️",
  Medal: "🎖️", 
  ThumbsUp: "👍",
  Heart: "❤️",
  PartyPopper: "🎉"
};

// Otteniamo le regole uniche per il filtro
const regoleUniche = [...new Set(quizData.map(domanda => domanda.regola))].sort((a, b) => a - b);

// Componente principale dell'applicazione
function QuizApp() {
  const [domande, setDomande] = useState([]);
  const [indiceDomandaCorrente, setIndiceDomandaCorrente] = useState(0);
  const [rispostaSelezionata, setRispostaSelezionata] = useState('');
  const [risultatiQuiz, setRisultatiQuiz] = useState({
    corrette: 0,
    errate: 0,
    totale: 0,
    streak: 0,
    maxStreak: 0,
    punteggio: 0
  });
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [modalitaQuiz, setModalitaQuiz] = useState('tutte'); // 'tutte', 'casuale', 'perRegola'
  const [regolaSelezionata, setRegolaSelezionata] = useState('');
  const [quizCompletato, setQuizCompletato] = useState(false);
  const [risposteUtente, setRisposteUtente] = useState({});
  const [numeroDomande, setNumeroDomande] = useState(10);
  const [modalitaTempo, setModalitaTempo] = useState(false);
  const [tempoRimanente, setTempoRimanente] = useState(15);
  const [timer, setTimer] = useState(null);
  const [badge, setBadge] = useState([]);
  const [avatarSelezionato, setAvatarSelezionato] = useState(1);
  const [mostraAvatar, setMostraAvatar] = useState(false);
  const [animazione, setAnimazione] = useState('');

  // Inizializza il quiz
  useEffect(() => {
    inizializzaQuiz();
  }, [modalitaQuiz, regolaSelezionata, numeroDomande]);
  
  // Timer per modalità a tempo
  useEffect(() => {
    if (modalitaTempo && tempoRimanente > 0 && !feedback && domande.length > 0) {
      const id = setTimeout(() => {
        setTempoRimanente(prevTempo => prevTempo - 1);
      }, 1000);
      
      setTimer(id);
      
      return () => clearTimeout(id);
    } else if (modalitaTempo && tempoRimanente === 0 && !feedback && domande.length > 0) {
      // Tempo scaduto
      handleTimeUp();
    }
  }, [modalitaTempo, tempoRimanente, feedback, domande]);

  const inizializzaQuiz = () => {
    let domandeSelezionate = [];
    
    if (modalitaQuiz === 'tutte') {
      domandeSelezionate = [...quizData];
    } else if (modalitaQuiz === 'casuale') {
      // Seleziona un numero di domande casuali
      domandeSelezionate = selezionaDomandeCasuali(quizData, numeroDomande);
    } else if (modalitaQuiz === 'perRegola' && regolaSelezionata) {
      // Filtra per regola
      const domandePerRegola = quizData.filter(domanda => domanda.regola === parseInt(regolaSelezionata));
      domandeSelezionate = domandePerRegola.length > numeroDomande ? 
                          selezionaDomandeCasuali(domandePerRegola, numeroDomande) : 
                          domandePerRegola;
    }
    
    setDomande(domandeSelezionate);
    setIndiceDomandaCorrente(0);
    setRispostaSelezionata('');
    setRisultatiQuiz({
      corrette: 0,
      errate: 0,
      totale: 0,
      streak: 0,
      maxStreak: 0,
      punteggio: 0
    });
    setShowResults(false);
    setFeedback(null);
    setQuizCompletato(false);
    setRisposteUtente({});
    setTempoRimanente(15);
    setBadge([]);
    setAnimazione('');
  };

  const selezionaDomandeCasuali = (array, numero) => {
    const arrayCopy = [...array];
    const result = [];
    const count = Math.min(numero, arrayCopy.length);
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * arrayCopy.length);
      result.push(arrayCopy[randomIndex]);
      arrayCopy.splice(randomIndex, 1);
    }
    
    return result;
  };

  // Gestisce il tempo scaduto
  const handleTimeUp = () => {
    if (feedback) return;
    
    // Salva una risposta vuota
    setRisposteUtente({
      ...risposteUtente,
      [indiceDomandaCorrente]: ''
    });
    
    const domandaCorrente = domande[indiceDomandaCorrente];
    
    // Aggiorna il conteggio delle risposte
    setRisultatiQuiz({
      ...risultatiQuiz,
      errate: risultatiQuiz.errate + 1,
      totale: risultatiQuiz.totale + 1,
      streak: 0
    });
    
    // Mostra feedback
    setFeedback({
      corretta: false,
      messaggio: 'Tempo scaduto!',
      rispostaCorretta: domandaCorrente.rispostaEsatta
    });
    
    // Animazione di tempo scaduto
    setAnimazione('tempoScaduto');
    setTimeout(() => setAnimazione(''), 1000);
  };

  // Messaggi di feedback divertenti
  const getMessaggioFeedback = (isCorretta) => {
    const messaggiCorretti = [
      "Ottimo!", 
      "Perfetto!", 
      "Grande!", 
      "Sei un asso!", 
      "Che campione!",
      "Arbitro internazionale!",
      "Collina sarebbe fiero di te!",
      "Fischio d'oro!",
      "Hai occhio!",
      "Decisione impeccabile!"
    ];
    
    const messaggiErrati = [
      "Ops!", 
      "Non proprio...", 
      "Ripassiamo la regola...", 
      "Cartellino giallo per te!",
      "Il VAR ha controllato... è errore!",
      "Questa volta hai fischiato male!",
      "Il pubblico protesta!",
      "I giocatori non sono d'accordo!",
      "Ricontrolliamo il regolamento..."
    ];
    
    return isCorretta 
      ? messaggiCorretti[Math.floor(Math.random() * messaggiCorretti.length)]
      : messaggiErrati[Math.floor(Math.random() * messaggiErrati.length)];
  };

  // Handler per la selezione di una risposta
  const handleRispostaClick = (risposta) => {
    if (feedback) return; // Impedisci di cambiare risposta dopo il feedback
    
    setRispostaSelezionata(risposta);
    
    // Ferma il timer se in modalità tempo
    if (modalitaTempo && timer) {
      clearTimeout(timer);
    }
    
    // Salva la risposta dell'utente
    setRisposteUtente({
      ...risposteUtente,
      [indiceDomandaCorrente]: risposta
    });
    
    // Controlla se la risposta è corretta
    const domandaCorrente = domande[indiceDomandaCorrente];
    const isCorretta = risposta === domandaCorrente.rispostaEsatta;
    
    // Calcola punteggio bonus
    let puntiBonus = 10; // Punti base
    let nuovaStreak = isCorretta ? risultatiQuiz.streak + 1 : 0;
    let nuovaMaxStreak = Math.max(nuovaStreak, risultatiQuiz.maxStreak);
    
    // Bonus per streak
    if (nuovaStreak > 2) {
      puntiBonus += Math.min(nuovaStreak * 2, 20); // Max 20 punti bonus per streak
    }
    
    // Bonus per tempo (se in modalità tempo)
    if (modalitaTempo && isCorretta) {
      puntiBonus += Math.ceil(tempoRimanente * 0.5); // Max 7 punti bonus per tempo
    }
    
    // Aggiorna il conteggio delle risposte
    setRisultatiQuiz({
      ...risultatiQuiz,
      corrette: isCorretta ? risultatiQuiz.corrette + 1 : risultatiQuiz.corrette,
      errate: !isCorretta ? risultatiQuiz.errate + 1 : risultatiQuiz.errate,
      totale: risultatiQuiz.totale + 1,
      streak: nuovaStreak,
      maxStreak: nuovaMaxStreak,
      punteggio: isCorretta ? risultatiQuiz.punteggio + puntiBonus : risultatiQuiz.punteggio
    });
    
    // Controlla badge speciali
    if (nuovaStreak === 3 && !badge.includes('streak3')) {
      setBadge(prev => [...prev, 'streak3']);
    } else if (nuovaStreak === 5 && !badge.includes('streak5')) {
      setBadge(prev => [...prev, 'streak5']);
    } else if (isCorretta && tempoRimanente < 3 && modalitaTempo && !badge.includes('lastSecond')) {
      setBadge(prev => [...prev, 'lastSecond']);
    }
    
    // Animazione
    setAnimazione(isCorretta ? 'corretta' : 'errata');
    setTimeout(() => setAnimazione(''), 800);
    
    // Mostra feedback
    setFeedback({
      corretta: isCorretta,
      messaggio: getMessaggioFeedback(isCorretta),
      rispostaCorretta: domandaCorrente.rispostaEsatta,
      puntiGuadagnati: isCorretta ? puntiBonus : 0
    });
    
    // Reimposta il timer se in modalità tempo
    if (modalitaTempo) {
      setTempoRimanente(15);
    }
  };

  // Componente Avatar dell'arbitro
  const ArbitroAvatar = ({ tipo }) => {
    const avatars = {
      1: (
        <div className="relative">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full"></div>
          </div>
          {tipo === 'felice' && (
            <div className="absolute top-5 left-5 w-14 h-7 bg-white rounded-full flex items-center justify-around">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          )}
          {tipo === 'triste' && (
            <div className="absolute bottom-5 left-5 w-14 h-7 bg-white rounded-full flex items-center justify-around rotate-180">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          )}
        </div>
      ),
      2: (
        <div className="relative">
          <div className="w-24 h-24 bg-purple-700 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </div>
          {tipo === 'felice' && (
            <div className="absolute top-6 left-6 w-12 h-6 flex items-center justify-around">
              <div className="w-2 h-4 bg-black rounded-full"></div>
              <div className="w-2 h-4 bg-black rounded-full"></div>
            </div>
          )}
          {tipo === 'triste' && (
            <div className="absolute bottom-6 left-6 w-12 h-6 flex items-center justify-around">
              <div className="w-4 h-2 bg-black rounded-full"></div>
              <div className="w-4 h-2 bg-black rounded-full"></div>
            </div>
          )}
        </div>
      ),
      3: (
        <div className="relative">
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </div>
          {tipo === 'felice' && (
            <div className="absolute top-8 left-4 w-16 h-4 flex items-center justify-around">
              <div className="w-3 h-3 bg-black rounded-full"></div>
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
          )}
          {tipo === 'triste' && (
            <div className="absolute top-10 left-4 w-16 h-4 flex items-center justify-around">
              <div className="w-3 h-3 bg-black rounded-full"></div>
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
          )}
        </div>
      )
    };
    
    return avatars[avatarSelezionato] || avatars[1];
  };

  // Componente Badge
  const Badge = ({ tipo }) => {
    const badges = {
        'streak3': (
        <div className="bg-yellow-100 text-yellow-800 rounded-lg p-2 flex items-center">
          <span className="text-xl mr-2 text-yellow-600">{ICONS.Fire}</span>
          <span className="font-medium">Serie di 3!</span>
        </div>
      ),
      'streak5': (
        <div className="bg-orange-100 text-orange-800 rounded-lg p-2 flex items-center">
          <span className="text-xl mr-2 text-orange-600">{ICONS.Zap}</span>
          <span className="font-medium">Serie di 5! Sei infuocato!</span>
        </div>
      ),
      'lastSecond': (
        <div className="bg-blue-100 text-blue-800 rounded-lg p-2 flex items-center">
          <span className="text-xl mr-2 text-blue-600">{ICONS.Clock}</span>
          <span className="font-medium">All'ultimo secondo!</span>
        </div>
      ),
      'perfectScore': (
        <div className="bg-purple-100 text-purple-800 rounded-lg p-2 flex items-center">
          <span className="text-xl mr-2 text-purple-600">{ICONS.Trophy}</span>
          <span className="font-medium">Punteggio perfetto!</span>
        </div>
      ),
      'highScore': (
        <div className="bg-green-100 text-green-800 rounded-lg p-2 flex items-center">
          <span className="text-xl mr-2 text-green-600">{ICONS.Medal}</span>
          <span className="font-medium">Punteggio elevato!</span>
        </div>
      )
    };
    
    return badges[tipo] || null;
  };

  // Handler per passare alla domanda successiva
  const handleNextQuestion = () => {
    if (indiceDomandaCorrente < domande.length - 1) {
      setIndiceDomandaCorrente(indiceDomandaCorrente + 1);
      setRispostaSelezionata('');
      setFeedback(null);
    } else {
      // Quiz completato
      setQuizCompletato(true);
      setShowResults(true);
    }
  };

  // Handler per ricominciare il quiz
  const handleRestartQuiz = () => {
    inizializzaQuiz();
  };

  // Renderizzo un messaggio se non ci sono domande
  if (domande.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-indigo-700 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Quiz dell'Arbitro</h1>
            <p className="text-gray-600">Metti alla prova la tua conoscenza del regolamento!</p>
          </div>
          
          <div className="flex justify-center mb-8">
            <ArbitroAvatar tipo="felice" />
          </div>
          
          <div className="mb-2">
            <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
              <span className="text-2xl mr-2">{ICONS.Trophy}</span> Scegli il tuo avatar:
            </h2>
            <div className="flex space-x-4 justify-center mb-6">
              <button 
                onClick={() => setAvatarSelezionato(1)} 
                className={`p-2 rounded-full transition-transform ${avatarSelezionato === 1 ? 'ring-4 ring-blue-500 scale-110' : 'hover:scale-105'}`}
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
                </div>
              </button>
              <button 
                onClick={() => setAvatarSelezionato(2)} 
                className={`p-2 rounded-full transition-transform ${avatarSelezionato === 2 ? 'ring-4 ring-blue-500 scale-110' : 'hover:scale-105'}`}
              >
                <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full"></div>
                </div>
              </button>
              <button 
                onClick={() => setAvatarSelezionato(3)} 
                className={`p-2 rounded-full transition-transform ${avatarSelezionato === 3 ? 'ring-4 ring-blue-500 scale-110' : 'hover:scale-105'}`}
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full"></div>
                </div>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
              <span className="text-2xl mr-2">{ICONS.Zap}</span> Modalità quiz:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <button 
                onClick={() => setModalitaQuiz('tutte')} 
                className={`p-4 rounded-lg shadow transition-transform hover:scale-105 ${modalitaQuiz === 'tutte' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                <span className={`text-3xl block mx-auto mb-2 ${modalitaQuiz === 'tutte' ? 'text-yellow-300' : 'text-gray-500'}`}>{ICONS.Trophy}</span>
                <div className="font-bold">Tutte le domande</div>
                <div className="text-xs mt-1">Il quiz completo!</div>
              </button>
              <button 
                onClick={() => setModalitaQuiz('casuale')} 
                className={`p-4 rounded-lg shadow transition-transform hover:scale-105 ${modalitaQuiz === 'casuale' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                <span className={`text-3xl block mx-auto mb-2 ${modalitaQuiz === 'casuale' ? 'text-yellow-300' : 'text-gray-500'}`}>{ICONS.RotateCw}</span>
                <div className="font-bold">Domande casuali</div>
                <div className="text-xs mt-1">Una selezione a sorpresa!</div>
              </button>
              <button 
                onClick={() => setModalitaQuiz('perRegola')} 
                className={`p-4 rounded-lg shadow transition-transform hover:scale-105 ${modalitaQuiz === 'perRegola' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                <span className={`text-3xl block mx-auto mb-2 ${modalitaQuiz === 'perRegola' ? 'text-yellow-300' : 'text-gray-500'}`}>{ICONS.Medal}</span>
                <div className="font-bold">Per regola</div>
                <div className="text-xs mt-1">Specializzati!</div>
              </button>
            </div>
            
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                id="modalitaTempo" 
                checked={modalitaTempo} 
                onChange={() => setModalitaTempo(!modalitaTempo)} 
                className="w-4 h-4"
              />
              <label htmlFor="modalitaTempo" className="ml-2 flex items-center">
                <span className="text-xl mr-1 text-red-500">{ICONS.Clock}</span>
                <span className="font-medium">Modalità a tempo</span>
                <span className="ml-2 text-xs text-gray-500">(15 secondi per domanda)</span>
              </label>
            </div>
            
            {modalitaQuiz === 'perRegola' && (
              <div className="mb-4">
                <label className="block mb-2 font-medium">Seleziona la regola:</label>
                <select 
                  value={regolaSelezionata} 
                  onChange={(e) => setRegolaSelezionata(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleziona una regola</option>
                  {regoleUniche.map(regola => (
                    <option key={regola} value={regola}>Regola {regola}</option>
                  ))}
                </select>
              </div>
            )}
            
            {(modalitaQuiz === 'casuale' || modalitaQuiz === 'perRegola') && (
              <div className="mb-4">
                <label className="block mb-2 font-medium">Numero di domande:</label>
                <input 
                  type="range" 
                  min="5" 
                  max="20" 
                  value={numeroDomande} 
                  onChange={(e) => setNumeroDomande(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center mt-1 font-bold">{numeroDomande}</div>
              </div>
            )}
            
            <button 
              onClick={inizializzaQuiz} 
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={(modalitaQuiz === 'perRegola' && !regolaSelezionata)}
            >
              INIZIA QUIZ
            </button>
          </div>
          
          {modalitaQuiz === 'perRegola' && !regolaSelezionata && (
            <p className="text-red-600 text-center">Per favore seleziona una regola per iniziare.</p>
          )}
          
          <div className="text-center text-gray-500 text-sm">
            <p>Conosci tutte le regole da vero arbitro?</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizzo i risultati finali se il quiz è completato
  if (quizCompletato && showResults) {
    const percentualeCorrette = Math.round((risultatiQuiz.corrette / domande.length) * 100);
    
    // Determina il messaggio di risultato in base alla percentuale
    const getMessaggioRisultato = () => {
      if (percentualeCorrette === 100) return "Sei un arbitro professionista!";
      if (percentualeCorrette >= 90) return "Quasi perfetto! Sei pronto per fischiare in serie A!";
      if (percentualeCorrette >= 75) return "Ottimo lavoro! Fischio promettente!";
      if (percentualeCorrette >= 60) return "Buon risultato! Con un po' di pratica diventerai un grande arbitro!";
      if (percentualeCorrette >= 40) return "Devi ripassare il regolamento! Il campo ti aspetta!";
      return "Hai bisogno di un po' più di allenamento con il regolamento!";
    };
    
    // Aggiunge un badge se necessario
    useEffect(() => {
      if (percentualeCorrette === 100 && !badge.includes('perfectScore')) {
        setBadge(prev => [...prev, 'perfectScore']);
      } else if (percentualeCorrette >= 80 && risultatiQuiz.punteggio > 200 && !badge.includes('highScore')) {
        setBadge(prev => [...prev, 'highScore']);
      }
    }, [percentualeCorrette, risultatiQuiz.punteggio]);
    
    return (
      <div className="bg-gradient-to-br from-blue-500 to-indigo-700 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Risultati del Quiz</h1>
          
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-6">
              <ArbitroAvatar tipo={percentualeCorrette >= 60 ? "felice" : "triste"} />
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-2xl font-bold mb-2">{getMessaggioRisultato()}</h2>
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
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {badge.includes('streak3') && <Badge tipo="streak3" />}
              {badge.includes('streak5') && <Badge tipo="streak5" />}
              {badge.includes('lastSecond') && <Badge tipo="lastSecond" />}
              {badge.includes('perfectScore') && <Badge tipo="perfectScore" />}
              {badge.includes('highScore') && <Badge tipo="highScore" />}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center text-indigo-700">
              <span className="text-2xl mr-2">{ICONS.CheckCircle}</span> Riepilogo risposte:
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto p-2">
              {domande.map((domanda, indice) => {
                const rispostaUtente = risposteUtente[indice] || '';
                const isCorretta = rispostaUtente === domanda.rispostaEsatta;
                
                return (
                  <div key={indice} className={`p-4 rounded-lg shadow-sm border-l-4 ${isCorretta ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {isCorretta ? (
                          <span className="text-2xl text-green-600">{ICONS.CheckCircle}</span>
                        ) : (
                          <span className="text-2xl text-red-600">{ICONS.AlertTriangle}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{domanda.numero}. {domanda.domanda}</p>
                        <p className="mt-1">
                          <span className="font-medium">La tua risposta:</span> {rispostaUtente ? `${rispostaUtente}. ${domanda[`risposta${rispostaUtente}`]}` : 'Nessuna risposta'}
                        </p>
                        {!isCorretta && (
                          <p className="mt-1 text-green-700">
                            <span className="font-medium">Risposta corretta:</span> {domanda.rispostaEsatta}. {domanda[`risposta${domanda.rispostaEsatta}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
      </div>
    );
  }

  // Ottenere la domanda corrente
  const domandaCorrente = domande[indiceDomandaCorrente];

  // Renderizza la schermata principale del quiz
  return (
    <div className={`bg-gradient-to-br from-blue-500 to-indigo-700 min-h-screen flex items-center justify-center p-4 ${animazione === 'corretta' ? 'animate-pulse-green' : animazione === 'errata' ? 'animate-pulse-red' : animazione === 'tempoScaduto' ? 'animate-shake' : ''}`}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl mx-auto w-full relative overflow-hidden">
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
            <div className="flex items-center bg-blue-100 rounded-full px-3 py-1">
              <span className="text-xl text-blue-600 mr-1">{ICONS.Trophy}</span>
              <span className="font-bold">{risultatiQuiz.punteggio}</span>
            </div>
          </div>
        </div>
        
        {/* Barra di progresso */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-indigo-800 font-medium">{indiceDomandaCorrente + 1}/{domande.length}</span>
            {risultatiQuiz.streak >= 2 && (
              <div className="flex items-center">
                <span className="text-xl text-orange-500 mr-1">{ICONS.Fire}</span>
                <span className="font-bold text-orange-500">{risultatiQuiz.streak}x</span>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300" 
              style={{width: `${((indiceDomandaCorrente + 1) / domande.length) * 100}%`}}
            ></div>
          </div>
        </div>
        
        {/* Timer (se attivo) */}
        {modalitaTempo && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 flex items-center">
                <span className="text-lg mr-1">{ICONS.Clock}</span> Tempo rimanente:
              </span>
              <div 
                className={`font-bold rounded-full w-8 h-8 flex items-center justify-center ${
                  tempoRimanente > 7 ? 'bg-green-100 text-green-700' : 
                  tempoRimanente > 3 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-red-100 text-red-700 animate-pulse'
                }`}
              >
                {tempoRimanente}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  tempoRimanente > 7 ? 'bg-green-500' : 
                  tempoRimanente > 3 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{width: `${(tempoRimanente / 15) * 100}%`}}
              ></div>
            </div>
          </div>
        )}
        
        {/* Avatar e domanda */}
        <div className="mb-4 flex">
          {mostraAvatar && (
            <div className="hidden sm:block mr-4">
              <ArbitroAvatar tipo={feedback ? (feedback.corretta ? "felice" : "triste") : "felice"} />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-3 py-1 rounded-lg mr-2 shadow-sm">
                #{domandaCorrente.numero}
              </span>
              <span className="text-gray-600 text-sm">Regola {domandaCorrente.regola}</span>
              
              <button 
                onClick={() => setMostraAvatar(!mostraAvatar)} 
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <span className="text-xl">{mostraAvatar ? ICONS.Smile : ICONS.Frown}</span>
              </button>
            </div>
            <p className="text-gray-800 font-medium text-lg">{domandaCorrente.domanda}</p>
          </div>
        </div>
        
        {/* Badge guadagnati */}
        {badge.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {badge.map((b, index) => (
              <Badge key={index} tipo={b} />
            ))}
          </div>
        )}
        
        {/* Opzioni di risposta */}
        <div className="space-y-3 mb-6">
          {['A', 'B', 'C'].map((opzione) => (
            <button
              key={opzione}
              onClick={() => handleRispostaClick(opzione)}
              disabled={feedback !== null}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all transform hover:scale-102 hover:shadow-md ${
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
          <div className={`p-4 mb-6 rounded-lg shadow-md ${feedback.corretta ? 'bg-green-100 border-l-4 border-l-green-500' : 'bg-red-100 border-l-4 border-l-red-500'} animate-fadeIn`}>
            <div className="flex items-center">
              {feedback.corretta ? (
                <span className="text-3xl mr-3">{ICONS.PartyPopper}</span>
              ) : (
                <span className="text-3xl mr-3">{ICONS.AlertOctagon}</span>
              )}
              <div>
                <p className={`text-lg font-bold ${feedback.corretta ? 'text-green-800' : 'text-red-800'}`}>
                  {feedback.messaggio}
                </p>
                {feedback.corretta && feedback.puntiGuadagnati > 0 && (
                  <p className="text-indigo-600 flex items-center mt-1">
                    <span className="text-xl mr-1">{ICONS.Trophy}</span>
                    <span>+{feedback.puntiGuadagnati} punti</span>
                    {risultatiQuiz.streak > 1 && (
                      <span className="ml-2 flex items-center text-orange-500">
                        <span className="text-xl mr-1">{ICONS.Fire}</span>
                        <span>{risultatiQuiz.streak}x combo!</span>
                      </span>
                    )}
                  </p>
                )}
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
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all transform hover:scale-105 flex items-center"
          >
            <span className="text-xl mr-1">{ICONS.RotateCw}</span> Ricomincia
          </button>
          
          {rispostaSelezionata && (
            <button 
              onClick={handleNextQuestion} 
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md flex items-center font-bold"
            >
              {indiceDomandaCorrente < domande.length - 1 ? (
                <>Prossima <span className="text-xl ml-1">{ICONS.ArrowRight}</span></>
              ) : (
                <>Risultati <span className="text-xl ml-1">{ICONS.Trophy}</span></>
              )}
            </button>
          )}
        </div>
        
        {/* Stile per animazioni */}
        <style jsx>{`
          @keyframes pulse-green {
            0%, 100% { background-color: rgba(209, 250, 229, 0); }
            50% { background-color: rgba(209, 250, 229, 0.4); }
          }
          
          @keyframes pulse-red {
            0%, 100% { background-color: rgba(254, 202, 202, 0); }
            50% { background-color: rgba(254, 202, 202, 0.4); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-pulse-green {
            animation: pulse-green 0.5s;
          }
          
          .animate-pulse-red {
            animation: pulse-red 0.5s;
          }
          
          .animate-shake {
            animation: shake 0.5s;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s;
          }
          
          .hover-scale-102:hover {
            transform: scale(1.02);
          }
        `}</style>
      </div>
    </div>
  );
}

// Renderizza l'app nel contenitore root
ReactDOM.render(<QuizApp />, document.getElementById('root'));