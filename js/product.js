const parametreUrl = window.location.search;
const parametreId = parametreUrl.slice(4);

// appel fecth pour recuperer les données d'un canapé unique avec son id
function appelFetch(id) {
    return fetch(`http://localhost:3000/api/products/${id}`)
        .then(reponse => reponse.json())
        .then((data) => { return data })
        .catch(erreur => console.log('erreur, impossible de contacter API'))
}

// affichage du canapé avec les bonnes informations
function changeHTML(a) {
    document.querySelector('.item__img').innerHTML = (` <img src="${a.imageUrl}" alt="${a.altTxt}"> `);
    document.querySelector('#title').innerHTML = (`<h1 id="title">${a.name}</h1>`);
    document.querySelector('#price').innerHTML = (`<span id="price">${a.price}</span>`);
    document.querySelector('#description').innerHTML = (`<p id="description">${a.description}</p>`);
    document.querySelector('#colors').innerHTML = (
        a.colors.map(item => (
            `<option value="${item}">${item}</option>`
        )).join('')
    )
}

// exécution des deux fonction au desssus
async function main() {
    const Produit = await appelFetch(parametreId);
    changeHTML(Produit,);
}

main();


// ajout de produit dans le local storage
document.querySelector('#addToCart').addEventListener('click', () => {
    let couleur = document.getElementById("colors").value;
    let quantite = document.querySelector('#quantity').value;
    let id = parametreId;

    let data = {
        couleur,
        quantite: parseInt(quantite),
        id
    }
// verification de la quantité
    if (quantite > 100 || quantite < 1) {
        alert('pas la bonne quantité');
    } else {
// verification si le local storage est vide ou pas
        if (localStorage.getItem('produit')) {
            let verif = JSON.parse(localStorage.getItem('produit'));
            const index = verif.findIndex(produit => produit.id === data.id && produit.couleur === data.couleur);
            if (index >= 0) {
                if(verif[index].quantite + data.quantite > 100){// sécurité pour ne pas dépasser les 100 canapé dans le storage
                    alert("vous ne pouvez pas ajouté autant de canapé car le total depasserai les 100 canapé")
                }else{
                    verif[index].quantite = data.quantite + verif[index].quantite;
                    localStorage.setItem('produit', JSON.stringify(verif));
                    alert('quantite ajouté au panier');
                }
            }else {
                verif.push(data);
                localStorage.setItem('produit', JSON.stringify(verif));
                alert('produit ajouté dans le panier !');
            }

        } else {
            let tableauData = [];
            tableauData.push(data);
            localStorage.setItem('produit', JSON.stringify(tableauData));
            alert('produit ajouté dans le panier !');
        }

    }
})