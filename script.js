let categoriesWrap = document.getElementById('categories');
let form = document.getElementById('jokeForm');

getCategories();

function getCategories() {
    fetch("https://api.chucknorris.io/jokes/categories")
        .then(function (response) {
            return response.json();
        })
        .then(function (categories) {
            createCategoriesList(categories);
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });
}



form.addEventListener("submit", event => {
    let data = new FormData(event.target);
    let radioValue = data.get('getBy');
    let categoryValue = data.get('category');

    if (radioValue === 'random') {
        fetch("https://api.chucknorris.io/jokes/random")
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                console.log(myJson);
                createJokeElem(myJson);
            })
            .catch(function (error) {
                console.log("Error: " + error);
            });
    } else if (radioValue === 'category') {
        fetch(`https://api.chucknorris.io/jokes/random?category=${categoryValue}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (categoriesList) {
                console.log(categoriesList);
                createJokeElem(categoriesList);
            })
            .catch(function (error) {
                console.log("Error: " + error);
            });
    }


    console.log(data.get('getBy'));

    event.preventDefault();
}, false);

function createJokeElem(joke) {
    let newJoke = document.createElement('div');
    newJoke.classList.add('joke');
    newJoke.innerHTML  = '<span class="favourite-btn"></span>';

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
    let jokesFeed = document.getElementById('jokesFeed');
    jokesFeed.append(newJoke);
}

function createCategoriesList(categories) {
    console.log(categories.length);
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
