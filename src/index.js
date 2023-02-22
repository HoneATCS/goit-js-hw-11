const { Notify } = require("notiflix");
import getImages from './js/script';
import NewsApiService from './js/script';
import { Axios } from 'axios';
import GetApi from './js/script';
import LoadBtn from './js/Loadbtn';
import { appendToGallery, clearGallery, createMarkup } from './js/render';




const apiService = new GetApi();
const loadMoreBtn = new LoadBtn({
  selector: '.load-more',
  isHidden: true,
});

export const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchData);

function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const value = form.elements.searchQuery.value.trim();
  apiService.query = value;
  clearGallery();
  apiService.resetPage();

  loadMoreBtn.show();

  fetchData().finally(() => form.reset());
}

function fetchData() {
  loadMoreBtn.disable();
  let currentHits = apiService.currentHits();
  // console.log(currentHits);

  return apiService
    .getData()
    .then(({ hits, totalHits }) => {
      if (!hits.length) {
        loadMoreBtn.hide();
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      const markup = hits.reduce(
        (markup, hit) => createMarkup(hit) + markup,
        ''
      );
      appendToGallery(markup);

      if (currentHits >= totalHits) {
        loadMoreBtn.hide();
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
            return '';
              }

      loadMoreBtn.enable();
    })

    .catch(console.log);
}

