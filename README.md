# EpiShop — esercitazione Bootstrap

Vetrina e-commerce responsive costruita con Bootstrap 5.3.3. Si apre con `index.html` nel browser (serve internet per Bootstrap e per le immagini segnaposto).

## Cosa è stato fatto

1. **Navbar** blu con brand e link Prodotti / Offerte / Contatti; sotto 576 px diventa un hamburger.
2. **Carosello** con 3 slide (Saldi di primavera, Spedizione gratis, Nuova collezione), cambio automatico e frecce.
3. **Categorie** (Scarpe, T-shirt, Borse, Accessori) in una colonna laterale, visibile da 992 px in su.
4. **Titolo «Prodotti in evidenza»** con badge rosso «-30%».
5. **Tre card prodotto** con immagine, titolo, descrizione, prezzo e bottone «Dettagli».
6. **Modale** di dettaglio con immagine, testo, prezzo e bottoni «Chiudi» / «Aggiungi al carrello».
7. **Footer** scuro con il copyright.
8. Collegati `style.css` e `script.js` (prima vuoti e non usati); il brief è copiato in `riferimenti/`.

## Scelte

- **Una sola modale**, riempita da `script.js` con i dati della card cliccata: titolo, descrizione e prezzo stanno in un posto solo e un nuovo prodotto richiede solo una card.
- **Breakpoint**: card a 1 colonna sul telefono, 2 da 576 px, 3 da 1200 px; navbar espansa da 576 px; categorie da 992 px.
- **Colori delle slide** con le classi Bootstrap (`bg-primary`, `bg-dark`, `bg-success`), senza CSS a mano.
- **CSS minimo**: una sola regola, per far scalare il titolo del carosello tra mobile e desktop; il resto è Bootstrap.
- **Immagini segnaposto** da `placehold.co` (300×180 nelle card, 600×300 nella modale), grigie come nel mockup.
- **Nomi in italiano** per ciò che ho scelto io; i nomi di Bootstrap restano in inglese.
- Codice compatto, con un commento a monte di ogni blocco e indentazione a 2 spazi.

## Assunzioni

- Il video della demo l'ho visto a campione (un fotogramma ogni 6 secondi): il punto in cui la navbar si espande (576 px) e il cambio automatico delle slide sono dedotti da lì.
- Il video mostra la modale solo per Sneaker Run. Le righe di disponibilità di T-shirt basic («Taglie dalla S alla XL.») e Borsa city («Capacità 15 litri.») le ho inventate: da sostituire con i testi veri.

## Come l'ho verificato

Sito statico senza test: ho controllato la pagina in Chrome a 375, 600 e 1280 px e confrontata col mockup, e ho provato su una copia che il clic su «Dettagli» apra la modale con i dati giusti e che il carosello cambi slide da solo.

## Struttura

- `index.html`: tutta la pagina, nell'ordine navbar → carosello → categorie e prodotti → footer → modale.
- `style.css`: solo ciò che Bootstrap non copre, annidato, nello stesso ordine dell'HTML.
- `script.js`: la modale prodotto, che copia i dati dalla card che l'ha aperta.

l'HTML contiene la struttura e il JS la rende dinamica: legge pezzi di HTML, ascolta cosa fa l'utente e scrive nuovi valori nell'HTML. Il passaggio avviene sempre nel DOM, l'albero degli elementi che il browser costruisce dall'HTML.

Il tuo script.js fa tre cose.

1. Trova un elemento dell'HTML


const modale = document.getElementById('modale');
document è la pagina e getElementById('modale') cerca l'elemento con id="modale" in index.html. Da qui modale è un oggetto JS con cui puoi leggere e cambiare quel pezzo di pagina.

2. Aspetta un evento


modale.addEventListener('show.bs.modal', ({ relatedTarget: bottone }) => { ... });
Significa: «quando la modale sta per aprirsi, esegui questa funzione». Chi l'ha aperta è bottone, cioè il «Dettagli» cliccato. L'evento show.bs.modal lo lancia Bootstrap, perché nell'HTML il bottone ha data-bs-toggle="modal".

3. Legge dall'HTML e scrive nell'HTML


const card = bottone.closest('.card');                        // sale dal bottone alla sua card
const testo = (selettore) => card.querySelector(selettore).textContent;   // legge un testo nella card

modale.querySelector('.modal-title').textContent = testo('.card-title');  // lo scrive nella modale
closest('.card') parte dal bottone e risale fino alla card che lo contiene.
querySelector('.card-title') cerca dentro la card l'elemento con quella classe.
.textContent è il testo dell'elemento: si può leggere e riassegnare.
Gli stessi passaggi riempiono descrizione e prezzo. Per la riga «Disponibile…» legge bottone.dataset.disponibilita, cioè l'attributo data-disponibilita="…" scritto nell'HTML.

Il flusso completo

Clicchi «Dettagli» su una card.
Bootstrap apre la modale e lancia l'evento.
Il JS risale alla card, copia titolo, descrizione e prezzo nella modale e apre.
Per questo c'è una sola modale: il JS la riempie con i dati della card cliccata, invece di tenere tre modali già scritte.

I collegamenti tra i due file

Le classi e gli id dell'HTML (.card-title, .prezzo, #modale) sono i nomi che il JS usa per ritrovare gli elementi. Se li rinomini nell'HTML, il JS non trova più nulla.
In fondo a index.html, <script src="script.js"> carica il file. Sta dopo il resto della pagina perché il JS deve trovare gli elementi già creati.