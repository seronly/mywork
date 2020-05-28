const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'e847b6b99aee2fac5e539b32777173e4';
const SERVER = 'https://api.themoviedb.org/3/';

const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal'),
  tvShows = document.querySelector('.tv-shows'),
  tvCardImg = document.querySelector('.tv-card__img'),
  modalTitle = document.querySelector('.modal__title'),
  genresList = document.querySelector('.genres-list'),
  rating = document.querySelector('.rating'),
  description = document.querySelector('.description'),
  modalLink = document.querySelector('.modal__link'),
  searchForm = document.querySelector('.search__form'),
  searchFormInput = document.querySelector('.search__form-input'),
  modalImg = document.querySelector('.image__content'),
  tvShowsHead = document.querySelector('.tv-shows__head'),
  preloader = document.querySelector('.preloader'),
  dropdown = document.querySelectorAll('.dropdown'),
  modalContent = document.querySelector('.modal__content');

const loading = document.createElement('div');
loading.className = 'loading';

const DBService = class {

  getData = async (url) => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Not enought data from : ${url}`);
    }
  }
  getTestData = async () => {
    return await this.getData('test.json');
  }

  getTestCard = async () => {
    return await this.getData('card.json');
  }

  getSearchResult = query => {
    return this.getData(`${SERVER}search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`)
  }

  getTvShow = id => {
    return this.getData(`${SERVER}tv/${id}?api_key=${API_KEY}&language=ru-RU`);
  }

}


// рендер карточек
const renderCard = response => {

  tvShowsList.textContent = '';

  if (response.total_results) {

    tvShowsHead.textContent = 'Результаты поиска';
    tvShowsHead.style.color = 'black';
    response.results.forEach(item => {
      const {
        name: title,
        vote_average: vote,
        poster_path: poster,
        backdrop_path: backdrop,
        id
      } = item;

      const posterIMG = poster ? IMG_URL + poster : backdrop ? IMG_URL + backdrop : 'img/no-poster.jpg';
      const backdropIMG = backdrop ? IMG_URL + backdrop : '';
      const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

      const card = document.createElement('li');
      card.idTV = id;
      card.className = 'tv-shows__item';
      card.innerHTML = `
      <a href="#" id="${id}" class="tv-card">
        ${voteElem}
        <img class="tv-card__img"
          src="${posterIMG}"
          data-backdrop="${backdropIMG}"
          alt="${title}">
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;

      tvShowsList.append(card);
    });
    loading.remove();
  }
  else {
    loading.remove();
    tvShowsHead.textContent = 'К сожалению, по вашему запросу ничего не найдено...';
    tvShowsHead.style.cssText = 'color: red; text-decoration: underline;'
    return;
  };
}

//поиск
searchForm.addEventListener('submit', event => {
  event.preventDefault();

  const value = searchFormInput.value.trim(); // trim удаляет по бокам пробелы

  if (value) {
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
  }
  searchFormInput.value = '';
});

// Меню (открытие, закрытие и др.)

const closeDropdown = () => {
  dropdown.forEach(item => {
    item.classList.remove('active');
  })
}

hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
  closeDropdown();
});

document.addEventListener('click', event => {
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
    closeDropdown();
  }
});

leftMenu.addEventListener('click', event => {
  event.preventDefault();
  const target = event.target;
  const dropdown = target.closest('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});


// Открытие модального окна
tvShowsList.addEventListener('click', event => {
  event.preventDefault();


  const target = event.target;
  const card = target.closest('.tv-card');

  if (card) {

    preloader.style.display = 'flex'; //прелоадер +

    new DBService().getTvShow(card.id)
      .then(({ poster_path: posterPath, name: title, genres, vote_average: voteAver, overview, homepage }) => {
        //не показывать в карточке постер, если его нет
        if (!posterPath) {
          modalImg.classList.add('hide');
          modalContent.style.paddingLeft = '30px';
        } else {
          modalImg.classList.remove('hide')
        }
        tvCardImg.src = IMG_URL + posterPath;
        tvCardImg.alt = title;
        modalTitle.textContent = title;
        //genresList.innerHTML = response.genres.reduce((acc, item) => { return `${acc}<li>${item.name}</li>` }, '');
        genresList.textContent = '';
        for (const item of genres) {
          genresList.innerHTML += `<li>${item.name}</li>`;
        }
        rating.textContent = voteAver;
        description.textContent = overview;
        modalLink.href = homepage;
      })
      .then(() => {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
      })
      .finally(() => { //finally отработается в любом случае, а then из-за ошибки отменяется
        preloader.style.display = 'none'; // прелоадер -
      });
  }
});

// Закрытие модального окна
modal.addEventListener('click', event => {
  if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
});

// Смена изображения при наведении
const changeImage = event => {
  const card = event.target.closest('.tv-shows__item');
  if (card) {
    const img = card.querySelector('.tv-card__img');
    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);