import './css/common.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './fetchimages';

const refs = {
  searchForm: document.querySelector('#search-form'),
  imagesContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', fetchImages);

refs.loadMoreBtn.classList.add('is-hidden');
const newsApiService = new NewsApiService();

function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.currentTarget.elements.searchQuery.value;

  if (newsApiService.query === '') {
    return Notify.failure('Sorry, enter a valid query. Please try again.');
  }

  newsApiService.resetPage();
  clearImagesContainer();
  fetchImages();
  // refs.loadMoreBtn.classList.remove('is-hidden');
}

function fetchImages() {
  newsApiService
    .fetchImages()
    .then(data => {
      if (data.hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      if (data.totalHits > 0) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        refs.loadMoreBtn.classList.remove('is-hidden');
      }

      if (data.totalHits % this.page < 40) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        refs.loadMoreBtn.classList.add('is-hidden');
      }

      imagesTpl(data.hits);
    })
    .catch(onFetchError);
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

function onFetchError(error) {
  Notify.failure(error.message);
}

function imagesTpl(data) {
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
          <a/>
        </div>`;
      }
    )
    .join('');
  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
}
