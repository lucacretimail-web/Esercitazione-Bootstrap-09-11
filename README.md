
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
9. **Tema scuro** con bottone «Tema scuro» nella navbar (dentro l'hamburger sul telefono): alterna la classe `tema-scuro` sul `body`.
10. **Stile in SCSS**: variabili (colore di brand, raggio, ombra delle card), un mixin di tema chiaro/scuro e Bootstrap personalizzato (colori, card, pulsanti, modale); contrasti verificati in entrambi i temi.

## Scelte

- **Una sola modale**, riempita da `script.js` con i dati della card cliccata: titolo, descrizione e prezzo stanno in un posto solo e un nuovo prodotto richiede solo una card.
- **Breakpoint**: card a 1 colonna sul telefono, 2 da 576 px, 3 da 1200 px; navbar espansa da 576 px; categorie da 992 px.
- **Colori delle slide** con le classi Bootstrap (`bg-primary`, `bg-dark`, `bg-success`), senza CSS a mano.
- **Un solo file SCSS** sopra Bootstrap dalla CDN: le palette stanno in due mappe (`$tema-chiaro`, `$tema-scuro`) e il mixin `tema` le applica ridefinendo le variabili CSS di Bootstrap (`--bs-body-bg`, `--bs-border-color`, …), così card, modale e pulsanti seguono il tema senza una regola per elemento.
- **Tema scuro**: il cambio tocca solo i colori; altezze e breakpoint sono identici (misurati a 360 px e a desktop). L'aside delle categorie usa `bg-body-tertiary` al posto di `bg-light`, che restava chiaro; la X della modale si inverte; il prezzo prende un colore di brand più chiaro.
- **Non c'è memoria della scelta**: ricaricando la pagina si torna al tema chiaro.
- **Immagini segnaposto** da `placehold.co` (300×180 nelle card, 600×300 nella modale), grigie come nel mockup.
- **Nomi in italiano** per ciò che ho scelto io; i nomi di Bootstrap restano in inglese.
- Codice compatto, con un commento a monte di ogni blocco e indentazione a 2 spazi.

## Assunzioni

- Il video della demo l'ho visto a campione (un fotogramma ogni 6 secondi): il punto in cui la navbar si espande (576 px) e il cambio automatico delle slide sono dedotti da lì.
- Il video mostra la modale solo per Sneaker Run. Le righe di disponibilità di T-shirt basic («Taglie dalla S alla XL.») e Borsa city («Capacità 15 litri.») le ho inventate: da sostituire con i testi veri.

## Come l'ho verificato

Sito statico senza test: ho controllato la pagina in Chrome a 375, 600 e 1280 px e confrontata col mockup, e ho provato su una copia che il clic su «Dettagli» apra la modale con i dati giusti e che il carosello cambi slide da solo.

Tema scuro: stessa verifica in Chrome a 360 px e a desktop, in chiaro e in scuro. Testi, prezzo, pulsanti e link della navbar hanno almeno 4,5:1 di contrasto (misurato), la modale si apre in scuro con la X leggibile, e l'audit di accessibilità di Lighthouse dà 100 in entrambi i temi.

## Struttura

- `index.html`: tutta la pagina, nell'ordine navbar → carosello → categorie e prodotti → footer → modale.
- `style.scss`: il sorgente dello stile (variabili, mixin, poi i blocchi nell'ordine dell'HTML). Si compila con `npx sass@1.106.1 --no-source-map style.scss style.css`.
- `style.css`: generato da `style.scss`, non si modifica a mano; è quello che carica `index.html`.
- `script.js`: il toggle del tema e la modale prodotto, che copia i dati dalla card che l'ha aperta.

l'HTML contiene la struttura e il JS la rende dinamica: legge pezzi di HTML, ascolta cosa fa l'utente e scrive nuovi valori nell'HTML. Il passaggio avviene sempre nel DOM, l'albero degli elementi che il browser costruisce dall'HTML.

Il tuo script.js ha due blocchi: il toggle del tema e la modale. Per la modale fa tre cose.

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

Il toggle del tema

È lo stesso schema, più corto.

const bottoneTema = document.getElementById('tema-toggle');   // trova il bottone nella navbar
bottoneTema.addEventListener('click', () => { ... });         // aspetta il clic
const scuro = document.body.classList.toggle('tema-scuro');   // aggiunge la classe al body se manca, la toglie se c'è, e dice come è andata
bottoneTema.setAttribute('aria-pressed', scuro);              // dice ai lettori di schermo se il tema scuro è attivo

Il JS non conosce nessun colore: mette o toglie la classe .tema-scuro sul body. I colori dei due temi stanno in style.scss: il mixin tema applica la palette chiara al body e quella scura a body.tema-scuro, ridefinendo le variabili di Bootstrap (--bs-body-bg, --bs-body-color, …). Per questo cambiano insieme sfondo, card, modale e pulsanti. Il cambio tocca solo i colori, quindi il layout resta lo stesso.

I collegamenti tra i file

Le classi e gli id dell'HTML (.card-title, .prezzo, #modale) sono i nomi che il JS usa per ritrovare gli elementi. Se li rinomini nell'HTML, il JS non trova più nulla.
Il bottone ha id="tema-toggle" in index.html, e la classe tema-scuro compare in script.js e in style.scss: se la rinomini in uno, va cambiata anche nell'altro.
In fondo a index.html, <script src="script.js"> carica il file. Sta dopo il resto della pagina perché il JS deve trovare gli elementi già creati.

