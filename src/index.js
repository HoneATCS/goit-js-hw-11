
import { refs } from './js/refs';
import simpleLightbox from 'simplelightbox';
import { clearImagesFromGallery, renderGalleryMarkup } from './js/render';
import { Notify } from 'notiflix';
import { LoadMoreBtn } from './js/loadMoreBtn';
import { pixabayApiService } from './js/script';




refs.form.addEventListener('submit', onFormSubmit);
refs.LoadMoreBtn.button.addEventListener('click', getImages);

const lightbox = new simpleLightbox('.gallery', {
  captionDelay: 250,
  close: true,
});

export function onFormSubmit(event) {
  event.preventDefault();


  const inputValue = event.target.elements.searchQuery.value.trim();
  if (inputValue === '') {
    Notify.info('Enter request');
    return;
  }

  pixabayApiService.searchQuery = inputValue;
  pixabayApiService.resetPage();

  clearImagesFromGallery();

  getCheckAndRender();

  refs.form.reset();
}

export async function onLoadMoreBtnClick() {
  getCheckAndRender();
}

export async function getCheckAndRender() {
  LoadMoreBtn.loading();

  try {
    const { hits, totalHits } = await pixabayApiService.getImages();

    if (!hits.length) {
      LoadMoreBtn.hide();
      clearImagesFromGallery();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderGalleryMarkup(hits);
    LoadMoreBtn.show();
    if (refs.galleryBox.children.length === hits.length) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    if (refs.galleryBox.children.length >= totalHits) {
      LoadMoreBtn.hide();
      Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }

    lightbox.refresh();
    observer.observe(refs.observeElement);

    LoadMoreBtn.endLoading();
  } catch (error) {
    console.error(error);
  }
}

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};
const callback = function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      getCheckAndRender();
    }
  });
};
const observer = new IntersectionObserver(callback, options);

export { observer };