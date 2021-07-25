// Change to demo key while pushing


//Count = number of objects to be loaded 
const count = 10;
const nasaApiKey = "0O1j0hfam19uCysGw37tiAXHTQa3f6mbbGL6oRsN"
const nasaApodLink = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&count=${count}`;
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');
const imagesContainer = document.querySelector('.images-container');
const favoritesBtn = document.getElementById('favorites-btn');
let resultsArray = [];
let favorites = {};


async function getApodData() {
    //Show loader
    loader.classList.remove('hidden');
    try {
        const apodResponse = await fetch(nasaApodLink);
        resultsArray = await apodResponse.json();
        updateDOM('results');
        console.log(resultsArray);


    } catch (err) {
        console.log(err)
    }

}

function createDOMNodes(page) {
    console.log('page == ', page);
    const currentArray = page === 'favorites' ? Object.values(favorites) : resultsArray;
    currentArray.forEach(result => {
        const card = document.createElement('div');
        card.classList.add('card');
        const imageLink = document.createElement('a');
        //Link
        imageLink.href = `${result.hdurl}`;
        imageLink.title = "Viw Full Image";
        imageLink.target = '_blank';
        //Image
        const img = document.createElement('img');
        img.src = result.hdurl;
        img.alt = result.title;
        img.loading = 'lazy'
        img.classList.add('card-img-top');

        imageLink.appendChild(img);
        //Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Title
        const cardTitle = document.createElement('h5');
        cardTitle.textContent = `${result.title}`;
        cardTitle.classList.add('card-title');
        //Add to Favorites Button
        const favoriteBtn = document.createElement('p');
        favoriteBtn.classList.add('clickable');
        favoriteBtn.classList.add('card-fav-btn')
        if (page === 'favorites') {
            favoriteBtn.textContent = "Remove From Favourites ⭐";
            favoriteBtn.setAttribute('onclick', `deleteFavourite('${result.url}')`);
        } else {
            favoriteBtn.textContent = "Add to Favourites ⭐";
            favoriteBtn.setAttribute('onclick', `saveFavourite('${result.url}')`);
        }
        //Card Text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = `${result.explanation}`;
        //Footer 
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //Date
        const copyrightDate = document.createElement('strong');
        copyrightDate.setAttribute('id', 'copyright-date');
        copyrightDate.textContent = `${result.date}`;
        //Copyright Info
        const copyrightInfo = document.createElement('span');
        copyrightInfo.setAttribute('id', 'copyright-info');
        const resultCopyright = result.copyright === undefined ? '' : result.copyright;
        copyrightInfo.textContent = `${resultCopyright}`;

        //Appending to cardBody
        footer.appendChild(copyrightDate);
        footer.appendChild(copyrightInfo);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(favoriteBtn);
        cardBody.appendChild(cardText);
        cardBody.appendChild(footer);
        //Appending to Card
        card.appendChild(imageLink);
        card.appendChild(img);
        card.appendChild(cardBody);
        //Appending to images container
        imagesContainer.appendChild(card);


    });
}
//Hide Loader 
function showContent(page) {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
    if (page === 'favorites') {
        favoritesNav.classList.remove('hidden');
        resultsNav.classList.add('hidden');
    } else {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }
    loader.classList.add('hidden');
}
//Update DOM function
function updateDOM(page) {
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        console.log('Favorites from browser local storage', favorites);
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);

}

// Save favourite function called on click of favoriteBtn in card
function saveFavourite(itemUrl) {
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;

            //Show Save Confirmation for two seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            //Set Favourites in local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    })
}

function deleteFavourite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        //Show Delete Confirmation for two seconds
        saveConfirmed.textContent = 'Deleted!'
        saveConfirmed.hidden = false;
        setTimeout(() => {
            saveConfirmed.hidden = true;
        }, 2000);
        //Set Favourites in local storage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}
//Event Listener


//On Load 
getApodData();