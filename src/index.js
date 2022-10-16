import { ImgApiService } from './js/fetchimages';
import { refs } from './js/refs';
import { smoothScroll } from './js/smooth-scroll';
import { spinerPlay, spinerStop } from './js/spiner';
import { imagesTpl } from './js/createMarkup';
import { lightbox } from './js/simpleLightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const imgApi = new ImgApiService();

async function onFormSubmit(event) {
  event.preventDefault();

  clearImagesContainer();
  // refs.loadMoreBtn.classList.add('is-hidden');

  const {
    elements: { searchQuery },
  } = event.currentTarget;
  imgApi.query = searchQuery.value.trim().toLowerCase();

  if (!imgApi.query) {
    Notify.failure('Sorry, enter a valid query. Please try again.');
    return;
  }

  refs.loadMoreBtn.classList.remove('is-hidden');
  await onLoadMore();
}

async function onLoadMore() {
  try {
    spinerPlay();
    const { totalHits, hits } = await imgApi.fetchImages();
    imgApi.calculateTotalPages(totalHits);

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

    if (imgApi.isShowLoadMore) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('is-hidden');
    }

    const markup = imagesTpl(hits);
    refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    smoothScroll();
  } catch (error) {
    onFetchError(error);
  } finally {
    spinerStop();
  }
}

function clearImagesContainer() {
  imgApi.resetPage();
  refs.imagesContainer.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}

function onFetchError(error) {
  Notify.failure(error.message);
  clearImagesContainer();
}
