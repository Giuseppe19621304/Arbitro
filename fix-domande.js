// Questo script deve essere eseguito prima del quiz principale
// Converte il formato stringa in quizData in un array di oggetti JavaScript

// Funzione che converte la stringa originale in un array JavaScript
function convertiDomandeInArray() {
  // Verifica se quizData è già definito e se è un array
  if (typeof quizData !== 'undefined' && Array.isArray(quizData)) {
    console.log("quizData è già un array, nessuna conversione necessaria");
    return;
  }

  // Se quizData non è definito o è una stringa
  try {
    // Suddivide la stringa in singoli oggetti
    const stringaOriginale = typeof quizData === 'string' ? quizData : quizDataOriginal;
    
    // Crea un array temporaneo per memorizzare le domande
    let arrayDomande = [];
    
    // Suddivide la stringa di input in blocchi di oggetti
    // Ogni oggetto inizia con "{ numero:" e termina con "};
    const regex = /\{\s*numero:\s*\d+;.*?regola:\s*[^}]*\};?/gs;
    const matches = stringaOriginale.match(regex) || [];
    
    matches.forEach(match => {
      try {
        // Prepara la stringa per la conversione in oggetto
        // 1. Rimuove i punti e virgola finali
        let stringa = match.replace(/};$/, '}');
        
        // 2. Sostituisce tutti i punti e virgola con virgole
        stringa = stringa.replace(/;/g, ',');
        
        // 3. Aggiunge virgolette ai nomi delle proprietà
        stringa = stringa.replace(/([a-zA-Z0-9_]+):/g, '"$1":');
        
        // 4. Gestisce le stringhe interne (sostituisce le doppie virgolette con singole se necessario)
        stringa = stringa.replace(/""/g, '\\"');
        
        // Converte la stringa in oggetto JavaScript
        const oggetto = eval('(' + stringa + ')');
        
        // Aggiunge l'oggetto all'array
        arrayDomande.push(oggetto);
      } catch (e) {
        console.error("Errore nella conversione dell'oggetto:", match, e);
      }
    });
    
    // Assegna l'array convertito a quizData
    window.quizData = arrayDomande;
    console.log("Conversione completata. quizData contiene ora", arrayDomande.length, "domande");
    
    // Aggiungiamo un controllo dopo 3 secondi per verificare che tutto sia ok
    setTimeout(() => {
      console.log("Stato quizData dopo 3 secondi:", 
        typeof quizData, 
        Array.isArray(quizData) ? quizData.length : "non è un array"
      );
      
      if (Array.isArray(quizData) && quizData.length > 0) {
        console.log("Prima domanda:", quizData[0]);
      }
    }, 3000);
  } catch (error) {
    console.error("Errore durante la conversione:", error);
  }
}

// Salva una copia dell'originale
window.quizDataOriginal = typeof quizData !== 'undefined' ? quizData : [];

// Esegui la conversione quando il documento è pronto
document.addEventListener('DOMContentLoaded', convertiDomandeInArray);