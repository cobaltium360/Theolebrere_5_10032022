// Appel fetch pour recupérer nos canapés
function appelFetch() {
    return fetch('http://localhost:3000/api/products')
        .then(reponse => reponse.json())
        .then((data) => { return data })
        .catch(erreur => console.log('erreur, impossible de contacter API'))
}

// Modification de l'hmtl pour affiché les canapé recupérer avec fetch
function changeHTML(a) {
    document.querySelector('#items').innerHTML = (
        a.map(item => (
            `<a href="./product.html?id=${item._id}">
                            <article>
                                <img src="${item.imageUrl}" alt="${item.altTxt}">
                                <h3 class="productName">${item.name}</h3>
                                <p class="productDescription">${item.description}</p>
                            </article>
                        </a>`
        )).join('')
    )
}

// fonction principale regroupant les 2 autres fonctions avec en arguments les données de l'api 
async function affichageProduits() {
    const allProducts = await appelFetch();
    changeHTML(allProducts);
}

//appel de ma fonction qui va executé les deux autres fonctions
affichageProduits();