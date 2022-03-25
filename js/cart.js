let product = JSON.parse(localStorage.getItem('produit'));
let form = {};
// données rentré par l'user
let prenom = document.querySelector('#firstName');
let nom = document.querySelector('#lastName');
let adresse = document.querySelector('#address');
let ville = document.querySelector('#city');
let mail = document.querySelector('#email');
// regex 
let rePrenom = /^[a-zA-Z-]+$/;
let reNom = /^[a-zA-Z-]+$/;
let reAdresse = /^[a-zA-Z0-9\s,.'-]{3,}$/;
let reVille = /^[a-zA-Z-]+$/;
let reEmail = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;

let verifPrenom = false;
let verifNom = false;
let verifAdresse = false;
let verifVille = false;
let verifMail = false;
// appel fetch des produits dans le local
function appelFetch(id) {
  return fetch(`http://localhost:3000/api/products/${id}`)
    .then(reponse => reponse.json())
    .then((data) => { return data })
    .catch(erreur => console.log(erreur))
}
// affichage des produits du local storage dans le panier complétées par les données récupérer par l'api
function changeHTML(a, b, c) {
  document.querySelector('#cart__items').innerHTML += (
    `<article class="cart__item" data-id="${a._id}" data-color="${b[c].couleur}">
        <div class="cart__item__img">
          <img src="${a.imageUrl}" alt="${a.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${a.name}</h2>
            <p>${b[c].couleur}</p>
            <p>${a.price}€</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${b[c].quantite}">
            </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
  )
}
// fonction pour calculer le prix 
async function prixEtTotal() {
  let prixTotal = 0;
  let totalArticle = 0;
  for (i = 0; i < product.length; i++) {
    const API = await appelFetch(product[i].id);
    let prix = API.price * product[i].quantite;
    prixTotal += prix;
    totalArticle += product[i].quantite;
  }
  document.querySelector('.cart__price').innerHTML = (
    `<p>Total (<span id="totalQuantity">${totalArticle}</span> articles) : <span id="totalPrice">${prixTotal}</span> €</p>`
  );
}
// fonction pour modifier la quantité d'un produit (qui modifié la quantité aussi dans le local storage)
function modifQuantite() {
  let arrayquantite = document.querySelectorAll('.itemQuantity');
  arrayquantite.forEach(element => {
    element.addEventListener('click', (e) => {
      if (e.target.value >= 1 && e.target.value <= 100) {
        let idArticle = element.closest("article").getAttribute("data-id");
        let colorArticle = element.closest("article").getAttribute("data-color");
        const index = product.findIndex(produit => produit.id === idArticle && produit.couleur === colorArticle);
        product[index].quantite = parseInt(e.target.value);
        localStorage.setItem('produit', JSON.stringify(product));
        prixEtTotal();
      } else {
        alert("non");
      }
    });
  });
}
// fonction pour supprimé un article du panier (qui le supprime aussi dans le local storage)
function deleteArt() {
  let btnSupprimer = document.querySelectorAll('.deleteItem');
  btnSupprimer.forEach(boutton => {
    boutton.addEventListener('click', () => {
      let idArticle = boutton.closest("article").getAttribute("data-id");
      let colorArticle = boutton.closest("article").getAttribute("data-color");
      const indexSupp = product.findIndex(produit => produit.id === idArticle && produit.couleur === colorArticle);
      let node = boutton.closest('article');
      node.remove();//suppréssion du produit (html - Affichage)
      let verif2 = JSON.parse(localStorage.getItem('produit'));
      if (verif2.length == 1) {
        localStorage.removeItem('produit');
        document.querySelector('.cart__price').innerHTML = (
          `<p>Total (<span id="totalQuantity"></span> articles) : <span id="totalPrice"></span> €</p>`
        );
      } else {
        product.splice(indexSupp, 1);
        localStorage.setItem('produit', JSON.stringify(product));
        prixEtTotal();
      }

    });
  });
}
// vérification des regex, remplissage du form, et envoie du form a l'api
function commander() {
  let btnCommander = document.querySelector('#order');
  btnCommander.addEventListener('click', (e) => {
    e.preventDefault();
    let verif3 = JSON.parse(localStorage.getItem('produit'));
    if (verif3 != null) {
      if (rePrenom.test(prenom.value)) {
        document.querySelector('#firstNameErrorMsg').innerHTML = '<p id="firstNameErrorMsg"></p>';
        verifPrenom = true;
      } else {
        verifPrenom = false;
        document.querySelector('#firstNameErrorMsg').innerHTML = '<p id="firstNameErrorMsg">Remplissez correctement ce champ.</p>';
      }
      if (reNom.test(nom.value)) {
        document.querySelector('#lastNameErrorMsg').innerHTML = '<p id="lastNameErrorMsg"></p>';
        verifNom = true;
      } else {
        verifNom = false;
        document.querySelector('#lastNameErrorMsg').innerHTML = '<p id="lastNameErrorMsg">Remplissez correctement ce champ.</p>';
      }
      if (reAdresse.test(adresse.value)) {
        document.querySelector('#addressErrorMsg').innerHTML = '<p id="addressErrorMsg"></p>';
        verifAdresse = true;
      } else {
        verifAdresse = false;
        document.querySelector('#addressErrorMsg').innerHTML = '<p id="addressErrorMsg">Remplissez correctement ce champ.</p>';
      }
      if (reVille.test(ville.value)) {
        document.querySelector('#cityErrorMsg').innerHTML = '<p id="cityErrorMsg"></p>';
        verifVille = true;
      } else {
        verifVille = false;
        document.querySelector('#cityErrorMsg').innerHTML = '<p id="cityErrorMsg">Remplissez correctement ce champ.</p>';
      }
      if (reEmail.test(mail.value)) {
        document.querySelector('#emailErrorMsg').innerHTML = '<p id="emailErrorMsg"></p>';
        verifMail = true;
      } else {
        verifMail = false;
        document.querySelector('#emailErrorMsg').innerHTML = '<p id="emailErrorMsg">Remplissez correctement ce champ.</p>';
      }
      if (verifPrenom && verifNom && verifAdresse && verifVille && verifMail) {
        let contact = {
          'firstName': prenom.value,
          'lastName': nom.value,
          'address': adresse.value,
          'city': ville.value,
          'email': mail.value
        }
        form.contact = contact;
        let products = [];
        let finalProduct = JSON.parse(localStorage.getItem('produit'));
        for (n = 0; n < finalProduct.length; n++) {
          products.push(finalProduct[n].id);
        }
        form.products = products;
        postFetch();
      } else {
        alert('Merci de remplir correctement les champs');
      }
    } else {
      alert('le panier est vide');
    }
  });
}
// fonction pour envoyé les informations de livraison et les coordonnées de l'user a l'api 
async function postFetch() {
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(form)
  };

  let orderData = await fetch('http://localhost:3000/api/products/order', fetchOptions)
    .then(response => response.json())
    .then(data => { return data })
    .catch(() => console.log('erreur, impossible de contacter API'));
  document.location.href = 'confirmation.html?id=' + orderData.orderId;
}
// fonction main qui appelle toute les fonctions au dessus pour faire marcher la page panier
async function main() {
  if (product) { // le code ne s'execute que si le localstorage contient des produits
    for (i = 0; i < product.length; i++) {
      let API = await appelFetch(product[i].id);
      changeHTML(API, product, i);
    }
    prixEtTotal();
    modifQuantite();
    deleteArt();
  }
  commander();
}
main();