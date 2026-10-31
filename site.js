// Core content and navigation remain usable without JavaScript.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');
function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });

const filters = document.querySelector('[data-filters]');
if (filters) {
  filters.hidden = false;
  const cards = [...document.querySelectorAll('[data-platforms]')];
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const filter = button.dataset.filter;
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = filter !== 'All' && !card.dataset.platforms.split(' ').includes(filter); });
    const count = cards.filter(card => !card.hidden).length;
    document.querySelector('[data-result-count]').textContent = `${String(count).padStart(2, '0')} games`;
  });
}

document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const slides = [...gallery.querySelectorAll('.gallery-slide')];
  const thumbs = [...gallery.querySelectorAll('[data-slide]')];
  let index = 0;
  function select(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    thumbs.forEach((thumb, i) => thumb.setAttribute('aria-pressed', String(i === index)));
    gallery.querySelector('[data-slide-count]').textContent = `${index + 1} / ${slides.length}`;
  }
  gallery.querySelectorAll('[data-gallery-control]').forEach(control => { control.hidden = false; });
  gallery.addEventListener('click', event => {
    const thumb = event.target.closest('[data-slide]');
    if (thumb) select(Number(thumb.dataset.slide));
    if (event.target.closest('[data-prev]')) select(index - 1);
    if (event.target.closest('[data-next]')) select(index + 1);
  });
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      select(index + (event.key === 'ArrowRight' ? 1 : -1));
      thumbs[index]?.focus();
    }
  });
  select(0);
});
