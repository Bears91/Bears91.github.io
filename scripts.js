const cards = document.querySelectorAll('.memory-card');
const dialogue = document.getElementById('Dialogue');
const jeumemoire = document.getElementById('jeu-memoire');
const memoire = document.getElementById('memoire');
const NbPaires = document.getElementById('NbPaires');
const body = document.getElementById('body');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let nbpairestrouver = 0;

jeumemoire.classList.remove('page-disabled');
fondimage();

function flipCard() { // retourne la carte quand on clique dessus
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;

  checkForMatch();
}

function checkForMatch() { //Regarde si les cartes sont pareille
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch == true)
  {
    disableCards();
    nbpairestrouver += 1;
  }
  else 
  {
    unflipCards();
  }
}

function disableCards() { // quand pareille, enleve le retournement des cartes
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() { // detourne les cartes quand pas pareille 
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() { // Réinitialise les cartes quand elles ne correspondent pas
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() { // Melangeur de cartes
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));

// Active AfficherFenetre() quand la page html est charger
document.addEventListener('DOMContentLoaded', () => {
  verifierAffichageDialogue();
});

// Désactiver la page html lorsque le dialogue est ouvert
function AfficherFenetre() {
  dialogue.close();
  dialogue.showModal(); 
  fondBlanc();
  jeumemoire.classList.add('page-disabled'); 
}

// Activer la page html lorsque le dialogue est fermé
function CacherFenetre() {
  dialogue.classList.add('hidden'); 
  jeumemoire.classList.remove('page-disabled'); 
  fondimage();
  jeustop();
}
// Vérifie si le dialogue doit être affiché
function verifierAffichageDialogue() {
  const dialogueCache = localStorage.getItem('dialogueCache');
  if (dialogueCache === 'true') {
    dialogue.classList.add('hidden'); 
    jeumemoire.classList.remove('page-disabled'); 
  } else {
    AfficherFenetre();
  }
}
// Cache le dialogue de façon permanente
function cacherFenetrePourToujours() {
  localStorage.setItem('dialogueCache', 'true'); 
  CacherFenetre(); 
  jeustop();
}
// Active la verification du dialogue au chargement de la page html
document.addEventListener('DOMContentLoaded', () => {
  verifierAffichageDialogue();
});

let meilleurTemps = localStorage.getItem('meilleurTemps') || null;  

let timerInterval;  
let temps = 0; 

const timerElement = document.getElementById("timer");
const meilleurTempsElement = document.getElementById("meilleurTemps");  

// Fonction appelée toutes les secondes
function Timer() {

  commencerjeu();
  // Démarre l'intervalle et le stocke dans timerInterval
  timerInterval = setInterval(() => {
    let minutes = parseInt(temps / 60, 10);
    let secondes = parseInt(temps % 60, 10);
    VerifierCartesTrouve();
    MettreAJourPairesTrouver();

    minutes = minutes < 10 ? "0" + minutes : minutes;
    secondes = secondes < 10 ? "0" + secondes : secondes;

    timerElement.innerText = minutes + ':' +secondes;

    temps++;
    
  }, 1000);
}

// Fonction pour vérifier si toutes les cartes sont retournées
function VerifierCartesTrouve() {
  let verifier = true;
  for (let i = 0; i < cards.length; i++) {
    if (!cards[i].classList.contains("flip")) {
      verifier = false;  
    }
  }

  if (verifier) {
    // Si toutes les cartes sont retournées, arrête le timer et met à jour le meilleur temps
    clearInterval(timerInterval);
    console.log("Toutes les cartes sont retournées !");

    mettreAJourMeilleurTemps(temps);  
  }

  return verifier;
}

// Mettre à jour le meilleur temps
function mettreAJourMeilleurTemps(nouveauTemps) {
  if (meilleurTemps === null || nouveauTemps < meilleurTemps) {
    meilleurTemps = nouveauTemps;  

    localStorage.setItem('meilleurTemps', meilleurTemps);

    afficherMeilleurTemps();
  }
}

// Afficher le meilleur temps
function afficherMeilleurTemps() {
  let minutes = parseInt(meilleurTemps / 60, 10);
  let secondes = parseInt(meilleurTemps % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  secondes = secondes < 10 ? "0" + secondes : secondes;

  meilleurTempsElement.innerText = 'Meilleur temps : ' + minutes + ':' + secondes;
}

// Affichage du meilleur temps dès le début
if (meilleurTemps !== null) {
  afficherMeilleurTemps();
}

// Rend le jeu inutilisable tant que le boutton n'est pas cliquer
function jeustop()
{
  memoire.classList.add('page-disabled');
}

function commencerjeu() // Quand boutton cliquer, jeu commence
{
  memoire.classList.remove('page-disabled');
}

function MettreAJourPairesTrouver()
{
  NbPaires.innerText = 'Nombre de paires trouvées : ' + nbpairestrouver;
}

function fondBlanc() // Change le fond de la page html en blanc
{
  body.classList.remove('backgroundimg')
  body.classList.add('backgroundblanc');
}

function fondimage() // Change le fond de la page html en page
{
  body.classList.add('backgroundimg');
  body.classList.remove('backgroundblanc');
}