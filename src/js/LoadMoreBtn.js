export class LoadMoreBtn {
  constructor({ selector, isHidden }) {
    this.button = document.querySelector(selector);
    if (isHidden) this.hide();
    else this.show();
  }

  hide() {
    this.button.classList.add('is-hidden');
  }
  show() {
    this.button.classList.remove('is-hidden');
  }
  loading() {
    this.button.disabled = true;
    this.button.textContent = 'Loading...';
  }
  endLoading() {
    this.button.disabled = false;
    this.button.textContent = 'Load more';
  }
}

export const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

