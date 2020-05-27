const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'e847b6b99aee2fac5e539b32777173e4';

const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal');


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
    return await this.getData('test.json')
  }
}

const renderCard = response => {
  console.log(response);
  tvShowsList.textContent = '';
  response.results.forEach(item => {
    const {
      name: title,
      vote_average: vote,
      poster_path: poster,
      backdrop_path: backdrop,
      overview: disr
    } = item;


    const posterIMG = poster ? IMG_URL + poster : backdrop ? IMG_URL + backdrop : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? IMG_URL + backdrop : '';
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';


    const card = document.createElement('li');
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a href="#" class="tv-card">
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

};

new DBService().getTestData().then(renderCard);


// Меню (открытие, закрытие и др.)
hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});

leftMenu.addEventListener('click', event => {
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
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hide');
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