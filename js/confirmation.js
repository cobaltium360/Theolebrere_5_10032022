const parametreUrl = window.location.search;
const parametreId = parametreUrl.slice(4);

document.querySelector('.confirmation').innerHTML = `<p>Commande validée ! <br>Votre numéro de commande est : <span id="orderId">${parametreId}</span></p>`

localStorage.removeItem('produit');//suppression des données du localestorage