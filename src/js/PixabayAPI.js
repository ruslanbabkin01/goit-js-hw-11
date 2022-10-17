import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';
// axios.defaults.headers.common['Authorization'] =
//   'KEY 29966506-3ac2aa6cf44b4238878b6f625';
const API_KEY = '29966506-3ac2aa6cf44b4238878b6f625';

export class PixabayAPI {
  #totalPages = 0;
  #page = 1;
  #searchQuery = '';
  #per_page = 40;
  #params = {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  };

  async fetchImages() {
    const urlAXIOS = `/?key=${API_KEY}&page=${this.#page}&q=${
      this.#searchQuery
    }&per_page=${this.#page}`;

    const { data } = await axios.get(urlAXIOS, this.#params);
    this.incrementPage();
    return data;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  get page() {
    return this.#page;
  }

  get query() {
    return this.#searchQuery;
  }

  set query(newQuery) {
    this.#searchQuery = newQuery;
  }

  calculateTotalPages(total) {
    this.#totalPages = Math.ceil(total / this.#per_page);
  }

  get isShowLoadMore() {
    return this.#page > this.#totalPages;
  }
}
