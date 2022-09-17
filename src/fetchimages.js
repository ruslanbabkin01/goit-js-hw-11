import axios from 'axios';

const API_KEY = '29966506-3ac2aa6cf44b4238878b6f625';
const BASE_URL = 'https://pixabay.com/api';
// const headers = {
//   Authorization: API_KEY,
// };
// const params = {
//   q: `inputValue`,
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: 'true',
// };

let page = 1;

export function fetchImages(inputValue) {
  return axios
    .get(
      `${BASE_URL}?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    )
    .then(response => {
      // console.log(response);
      return response;
    });
}

// export default class NewsApiService {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//   }

//   fetchArticles() {
//     const searchParams = new URLSearchParams({
//       q: this.searchQuery,
//       language: 'en',
//       pageSize: 10,
//       page: this.page,
//     });
//     const url = `${BASE_URL}/everything?${searchParams}`;
//     // const url = `${BASE_URL}/everything?q=${this.searchQuery}&language=en&pageSize=10&page=${this.page}`;

//     return fetch(url, options)
//       .then(response => response.json())
//       .then(({ articles }) => articles);
//   }

//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
// }
