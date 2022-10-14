import { ImgApiService } from './js/fetchimages';
import { refs } from './js/refs';
import { smoothScroll } from './js/smooth-scroll';
import { spinerPlay, spinerStop } from './js/spiner';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', fetchImages);

const imgApi = new ImgApiService();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function onFormSubmit(e) {
  e.preventDefault();
  clearImagesContainer();
  imgApi.resetPage();
  refs.loadMoreBtn.classList.add('is-hidden');

  imgApi.query = e.currentTarget.elements.searchQuery.value;

  if (imgApi.query === '') {
    Notify.failure('Sorry, enter a valid query. Please try again.');
    return;
  }

  refs.loadMoreBtn.classList.remove('is-hidden');
  await fetchImages();
}

async function fetchImages() {
  spinerPlay();
  try {
    const { totalHits, hits } = await imgApi.fetchImages();
    const totalPages = totalHits / imgApi.per_page;

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }

    if (imgApi.page === 2) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (imgApi.page > totalPages + 1) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('is-hidden');
    }

    imagesTpl(hits);
    smoothScroll();
  } catch (error) {
    onFetchError(error);
  }
  spinerStop();
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

function onFetchError(error) {
  Notify.failure(error.message);
  refs.loadMoreBtn.classList.add('is-hidden');
  clearImagesContainer();
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

  lightbox.refresh();
}
