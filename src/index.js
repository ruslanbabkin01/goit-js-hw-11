import './css/common.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchimages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './fetchimages';

const refs = {
  searchForm: document.querySelector('#search-form'),
  imagesContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', fetchArticles);
const newsApiService = new NewsApiService();
refs.loadMoreBtn.classList.add('is-hidden');

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.searchQuery.value;

  if (newsApiService.query === '') {
    return alert('Введи что-то нормальное');
  }
  refs.loadMoreBtn.classList.remove('is-hidden');
  newsApiService.resetPage();
  clearArticlesContainer();
  fetchArticles();
}

function fetchArticles() {
  // refs.loadMoreBtn.classList.remove('is-hidden');
  newsApiService
    .fetchArticles()
    .then(data => {
      console.log(data.hits);
      // if (data.hits === []) {
      //   onFetchError();
      // }
      articlesTpl(data.hits);
      // refs.loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(onFetchError);
}

function clearArticlesContainer() {
  refs.imagesContainer.innerHTML = '';
}

function onFetchError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function articlesTpl(data) {
  const markup = data
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
          <a class="photo__link" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <a/>
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </div>`;
      }
    )
    .join('');
  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
}
