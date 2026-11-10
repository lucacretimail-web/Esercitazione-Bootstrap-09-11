/* Modale prodotto: copia titolo, descrizione e prezzo dalla card che l'ha aperta */

const modale = document.getElementById('modale');

modale.addEventListener('show.bs.modal', ({ relatedTarget: bottone }) => {
  const card = bottone.closest('.card');
  const testo = (selettore) => card.querySelector(selettore).textContent;

  modale.querySelector('.modal-title').textContent = testo('.card-title');
  modale.querySelector('img').alt = testo('.card-title');
  modale.querySelector('.testo').textContent = `${testo('.card-text')} ${bottone.dataset.disponibilita}`;
  modale.querySelector('.prezzo').textContent = testo('.prezzo');
});
