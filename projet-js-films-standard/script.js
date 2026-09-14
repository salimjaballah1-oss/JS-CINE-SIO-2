// ============================================================
// Gestionnaire de films - script.js
// Script classique (pas de modules, pas d'import/export)
// ============================================================

// ---------- Données en mémoire ----------
var films = [];
var prochainId = 1;

var GENRES_AUTORISES = [
  "Action",
  "Comédie",
  "Drame",
  "Science-fiction",
  "Thriller",
  "Animation"
];

// ---------- Références aux éléments du DOM ----------
var formulaire = document.getElementById("movie-form");
var champTitre = document.getElementById("titre");
var champRealisateur = document.getElementById("realisateur");
var champAnnee = document.getElementById("annee");
var champDuree = document.getElementById("duree");
var champGenre = document.getElementById("genre");

var listeFilms = document.getElementById("movie-list");
var messageVide = document.getElementById("empty-message");
var boutonToutSupprimer = document.getElementById("clear-all");

// ---------- Validation ----------

// Efface tous les anciens messages d'erreur et les styles associés
function effacerErreurs() {
  var messages = document.querySelectorAll(".error-message");
  for (var i = 0; i < messages.length; i++) {
    messages[i].textContent = "";
  }

  var champs = document.querySelectorAll(".invalid");
  for (var j = 0; j < champs.length; j++) {
    champs[j].classList.remove("invalid");
  }
}

// Affiche un message d'erreur sous le champ concerné
function afficherErreur(idChamp, message) {
  var zoneErreur = document.getElementById("error-" + idChamp);
  var champ = document.getElementById(idChamp);

  if (zoneErreur) {
    zoneErreur.textContent = message;
  }
  if (champ) {
    champ.classList.add("invalid");
  }
}

// Valide les cinq champs et renvoie un objet { valide, erreurs, valeurs }
function validerFormulaire() {
  var anneeActuelle = new Date().getFullYear();

  var titre = champTitre.value.trim();
  var realisateur = champRealisateur.value.trim();
  var annee = champAnnee.value.trim();
  var duree = champDuree.value.trim();
  var genre = champGenre.value;

  var erreurs = {};

  if (titre.length < 2) {
    erreurs.titre = "Le titre doit contenir au moins 2 caractères.";
  }

  if (realisateur.length < 2) {
    erreurs.realisateur = "Le réalisateur doit contenir au moins 2 caractères.";
  }

  var anneeNombre = Number(annee);
  if (
    annee === "" ||
    !Number.isInteger(anneeNombre) ||
    anneeNombre < 1895 ||
    anneeNombre > anneeActuelle
  ) {
    erreurs.annee =
      "L'année doit être comprise entre 1895 et " + anneeActuelle + ".";
  }

  var dureeNombre = Number(duree);
  if (duree === "" || !Number.isInteger(dureeNombre) || dureeNombre <= 0) {
    erreurs.duree = "La durée doit être un entier supérieur à 0.";
  }

  if (genre === "" || GENRES_AUTORISES.indexOf(genre) === -1) {
    erreurs.genre = "Veuillez sélectionner un genre.";
  }

  return {
    valide: Object.keys(erreurs).length === 0,
    erreurs: erreurs,
    valeurs: {
      titre: titre,
      realisateur: realisateur,
      annee: anneeNombre,
      duree: dureeNombre,
      genre: genre
    }
  };
}

// ---------- Affichage ----------

// Construit un élément <li> représentant un film
function creerElementFilm(film) {
  var element = document.createElement("li");
  element.className = "movie-item";

  var infos = document.createElement("div");
  infos.className = "movie-info";

  var titre = document.createElement("h3");
  titre.textContent = film.titre;

  var ligneRealisateur = document.createElement("p");
  ligneRealisateur.textContent = "Réalisateur : " + film.realisateur;

  var ligneAnneeDuree = document.createElement("p");
  ligneAnneeDuree.textContent = film.annee + " — " + film.duree + " min";

  var ligneGenre = document.createElement("p");
  ligneGenre.textContent = "Genre : " + film.genre;

  infos.appendChild(titre);
  infos.appendChild(ligneRealisateur);
  infos.appendChild(ligneAnneeDuree);
  infos.appendChild(ligneGenre);

  var boutonSupprimer = document.createElement("button");
  boutonSupprimer.type = "button";
  boutonSupprimer.className = "btn btn-danger";
  boutonSupprimer.textContent = "Supprimer";
  boutonSupprimer.addEventListener("click", function () {
    supprimerFilm(film.id);
  });

  element.appendChild(infos);
  element.appendChild(boutonSupprimer);

  return element;
}

// Régénère entièrement l'affichage de la collection
function afficherCollection() {
  listeFilms.innerHTML = "";

  if (films.length === 0) {
    messageVide.style.display = "block";
    return;
  }

  messageVide.style.display = "none";

  for (var i = 0; i < films.length; i++) {
    var element = creerElementFilm(films[i]);
    listeFilms.appendChild(element);
  }
}

// ---------- Actions ----------

// Supprime un film précis de la collection
function supprimerFilm(id) {
  films = films.filter(function (film) {
    return film.id !== id;
  });
  afficherCollection();
}

// Vide entièrement la collection
function toutSupprimer() {
  films = [];
  afficherCollection();
}

// Ajoute un film après validation du formulaire
function gererSoumission(evenement) {
  evenement.preventDefault();

  effacerErreurs();

  var resultat = validerFormulaire();

  if (!resultat.valide) {
    for (var champ in resultat.erreurs) {
      afficherErreur(champ, resultat.erreurs[champ]);
    }
    return;
  }

  var nouveauFilm = {
    id: prochainId,
    titre: resultat.valeurs.titre,
    realisateur: resultat.valeurs.realisateur,
    annee: resultat.valeurs.annee,
    duree: resultat.valeurs.duree,
    genre: resultat.valeurs.genre
  };

  prochainId = prochainId + 1;
  films.push(nouveauFilm);

  formulaire.reset();
  effacerErreurs();
  afficherCollection();
}

// ---------- Événements ----------
formulaire.addEventListener("submit", gererSoumission);
boutonToutSupprimer.addEventListener("click", toutSupprimer);

// ---------- Initialisation ----------
afficherCollection();
