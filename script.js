'use strict';

let categoriesWrap = document.getElementById('categories');
let form = document.getElementById('jokeForm');
let jokesMap = new Map();
let favouriteJokesMap = new Map();

getCategories();

function getCategories() {
    fetch("https://api.chucknorris.io/jokes/categories")
        .then(response => response.json())
        .then(categories => {
            createCategoriesList(categories);
        })
        .catch(error => {
            console.log("Error: " + error);
        });
}

form.addEventListener("submit", event => {
    let data = new FormData(event.target);
    let radioValue = data.get('getBy');
    let categoryValue = data.get('category');
    let searchInput = data.get('searchInput');

    if (radioValue === 'random') {
        fetch("https://api.chucknorris.io/jokes/random")
            .then(response => response.json())
            .then(newJoke => {
                updateJokesFeed(createJokeElem(newJoke));
                jokesMap.set(newJoke.id, newJoke);
            })
            .catch(error => {
                console.log("Error: " + error);
            });
    } else if (radioValue === 'category') {
        fetch(`https://api.chucknorris.io/jokes/random?category=${categoryValue}`)
            .then(response => response.json())
            .then(newJoke => {
                updateJokesFeed(createJokeElem(newJoke));
                jokesMap.set(newJoke.id, newJoke);
            })
            .catch(error => {
                console.log("Error: " + error);
            });
    } else if (radioValue === 'search') {
        fetch(`https://api.chucknorris.io/jokes/search?query=${searchInput}`)
            .then(response => response.json())
            .then(result => {
                if (result.result.length > 0) {
                    result.result.forEach(joke => {
                            updateJokesFeed(createJokeElem(joke));
                            jokesMap.set(joke.id, joke);
                        }
                    );
                } else {
                    noResultsMessage();
                }
            })
            .catch(error => {
                console.log("Error: " + error);
            });
    }

    event.preventDefault();
}, false);

function favouriteToggle(event) {
    event.target.classList.toggle('active');
    let targetJoke = event.target.parentElement;
    let targetJokeId = targetJoke.querySelector('.joke-id__link').getAttribute('href');

    if(!favouriteJokesMap.has(targetJokeId)) {
        favouriteJokesMap.set(targetJokeId, jokesMap.get(targetJokeId));
    } else {
        favouriteJokesMap.delete(targetJokeId);
    }

    updateFavouriteList();

    console.log('favouriteJokesMap', favouriteJokesMap);
}

function updateFavouriteList(){
    let jokesFeed = document.getElementById('favouriteFeed');
    jokesFeed.innerHTML = '';
 favouriteJokesMap.forEach((newJoke, b) => {
     jokesFeed.append(createJokeElem(newJoke));
 })
}

function updateJokesFeed(newJoke) {
    let jokesFeed = document.getElementById('jokesFeed');
    jokesFeed.append(newJoke);
}



function createJokeElem(joke, isFavourite) {
    let newJoke = document.createElement('div');
    newJoke.classList.add('joke');

    let favouriteBtn = document.createElement('span');
    favouriteBtn.classList.add('favourite-btn');
    if (isFavourite) {
        favouriteBtn.classList.add('active');
    }
    favouriteBtn.addEventListener("click", favouriteToggle);
    newJoke.append(favouriteBtn);

    let jokeContent = document.createElement('div');
    jokeContent.classList.add('joke-content');
    jokeContent.innerHTML = '<div class="joke-content__left">\n' +
        '                        <img class="joke__img" src="images/joke-static-icon.svg" alt="">\n' +
        '                    </div>';


    let jokeContentRight = document.createElement('div');
    jokeContentRight.classList.add('joke-content__right');

    let jokeID = document.createElement('p');
    jokeID.classList.add('joke-id');
    jokeID.appendChild(document.createTextNode('ID: '));

    let jokeIDLink = document.createElement('a');
    jokeIDLink.classList.add('joke-id__link');
    jokeIDLink.setAttribute('href', joke.id);
    jokeIDLink.innerHTML = joke.id + ' <img src="images/link-icon.svg" alt="">';
    jokeID.append(jokeIDLink);

    jokeContentRight.append(jokeID);

    let jokeText = document.createElement('p');
    jokeText.classList.add('joke-text');
    jokeText.appendChild(document.createTextNode(joke.value));
    jokeContentRight.append(jokeText);

    let jokeInfo = document.createElement('div');
    jokeInfo.classList.add('joke-info');
    jokeContentRight.append(jokeInfo);


    let lastUpdate = document.createElement('span');
    lastUpdate.classList.add('joke-info__last-update');

    let updateTime = new Date() - new Date(joke.updated_at);
    updateTime = Math.floor(updateTime / (1000 * 60 * 60));


    lastUpdate.appendChild(document.createTextNode('Last update: ' + updateTime + ' hours ago'));
    jokeInfo.append(lastUpdate);

        if (joke.categories.length > 0) {
            let categoriesList = document.createElement('div');
            categoriesList.classList.add('joke-info__categories-list');
            jokeInfo.append(categoriesList);

            for (let i = 0; i < joke.categories.length; i++) {
               let category = document.createElement('span');
                category.classList.add('joke-info__category-name');
                category.appendChild(document.createTextNode(joke.categories[i]));
                categoriesList.append(category);
            }
        }

    jokeContent.append(jokeContentRight);
    newJoke.append(jokeContent);

    jokeContent.append(jokeContentRight);

    return newJoke;
}

function createCategoriesList(categories) {
    for (let i = 0; i < categories.length; i++) {
        let categoryInput = document.createElement("input");
        categoryInput.classList.add('category-input');
        categoryInput.setAttribute('type', 'radio');
        categoryInput.setAttribute('name', 'category');
        categoryInput.setAttribute('value', categories[i]);
        categoryInput.setAttribute('id', `${categories[i]}Category`);

        if (i === 0) {
            categoryInput.setAttribute('checked', true);
        }

        let categoryLabel = document.createElement('label');
        categoryLabel.innerHTML = `${categories[i]}`;
        categoryLabel.setAttribute('for', `${categories[i]}Category`);

        categoriesWrap.append(categoryInput, categoryLabel);
    }
}

function noResultsMessage() {
    let jokesFeed = document.getElementById('jokesFeed');

    let newJoke = document.createElement('div');
    newJoke.classList.add('joke');

    let jokeText = document.createElement('p');
    jokeText.classList.add('joke-text');
    jokeText.appendChild(document.createTextNode('The search has not given any results'));
    newJoke.append(jokeText);
    jokesFeed.append(newJoke);
}


