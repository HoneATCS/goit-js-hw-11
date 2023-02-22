import axios from "axios";

const BASIC_URL = 'https://pixabay.com/api/';
const API_KEY = '33774181-bed99a30315d4582da4b976c0';

const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
}).toString();

export default class GetApi {
  constructor() {
    this.page = 1;
    this.query = '';
    this.per_page = 40;
  }

  async getData() {
    const URL = `${BASIC_URL}?key=${API_KEY}&q=${this.query}&${searchParams}'&per_page=${this.per_page}&page=${this.page}`;

    const response = await axios.get(URL);
    this.nextPage();

    return response.data;

  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  currentHits() {
    return this.page * this.per_page;
  }
}