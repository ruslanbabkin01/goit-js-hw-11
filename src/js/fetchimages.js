import axios from 'axios';

const API_KEY = '29966506-3ac2aa6cf44b4238878b6f625';
const BASE_URL = 'https://pixabay.com/api/';

export class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImages() {
    const url = `${BASE_URL}?key=${API_KEY}`;

    const params = {
      q: `${this.searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: `${this.page}`,
      per_page: `${this.per_page}`,
    };

    const response = await axios.get(url, { params });
    this.incrementPage();
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
