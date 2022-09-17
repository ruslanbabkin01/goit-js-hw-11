import './css/common.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchimages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.querySelector('#search-form'),
  imagesContainer: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  const inputValue = e.currentTarget.elements.searchQuery.value;
  console.log(inputValue);

  if (inputValue === ' ') {
    return alert('Введи что-то нормальное');
  }

  fetchFullImages();
  // clearContainer();
}

function fetchFullImages() {
  // loadMoreBtn.disable();
  fetchImages()
    .then(hits => {
      console.log(hits);
      appendMarkup(hits);
    })
    .catch(onFetchError);
  // loadMoreBtn.enable();
}

function onFetchError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

// function addMarkup(data) {
//   appendTotalMarkup(data);

//   if (data === []) {
//     Notify.info(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//     return;
//   }

function appendMarkup(hits) {
  const markup = hits
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">${likes}
              <b>Likes</b>
            </p>
            <p class="info-item">${views}
              <b>Views</b>
            </p>
            <p class="info-item">${comments}
              <b>Comments</b>
            </p>
            <p class="info-item">${downloads}
              <b>Downloads</b>
            </p>
          </div>
        </div>`;
    })
    .join('');
  refs.imagesContainer.innerHTML = markup;
}

// function clearContainer() {
//   refs.listUl.innerHTML = ' ';
//   refs.divInfo.innerHTML = ' ';
// }
