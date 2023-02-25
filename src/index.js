import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { loadMoreBtn } from './js/loadMoreBtn';
import { pixabayApiService } from './js/pixabayApiService';
import { refs } from './js/refs';
import { clearGallery, appendToGallery } from './js/renderMarkupFunction';

// const { formEl, galleryEl, loadMoreBtn } = refs;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 100,
  captionType: 'alt',
  widthRatio: 0.8,
  heightRatio: 0.9,
});

refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onFormSubmit(evt) {
  evt.preventDefault();
  loadMoreBtn.hide();

  const inputValue = evt.target.elements.searchQuery.value.trim();
  if (inputValue === '') {
    Notify.failure('Please provide search data!');
    return;
  }
  pixabayApiService.searchQuery = inputValue;
  pixabayApiService.resetPage();

  clearGallery();

  processingReceivedImg();

  refs.formEl.reset();
}

function onLoadMoreBtnClick() {
  processingReceivedImg();
}

async function processingReceivedImg() {
  loadMoreBtn.loading();

  try {
    const { hits, totalHits } = await pixabayApiService.fetchPhotos();

    if (hits.length === 0) {
      loadMoreBtn.hide();
      clearGallery();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    appendToGallery(hits);
    loadMoreBtn.show();

    if (refs.galleryEl.children.length === hits.length) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    if (refs.galleryEl.children.length >= totalHits) {
      loadMoreBtn.hide();
      Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }

    lightbox.refresh();

    loadMoreBtn.endLoading();
  } catch (error) {
    console.error(error);
  }
}
