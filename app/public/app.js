// RASTA — mijoz tomonidagi minimal interaktivlik (kutubxonasiz)

/* ---- toast ---- */
let toastTimer;
function toast(text) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ---- galereya: avtomatik slayd + qo'lda surish ---- */
function initGallery(root) {
  const slides = [...root.querySelectorAll('.slide')];
  const dots = [...root.querySelectorAll('.dots i')];
  if (slides.length < 2) return;
  let index = 0;

  const show = (next) => {
    slides[index].classList.remove('on');
    dots[index]?.classList.remove('on');
    index = (next + slides.length) % slides.length;
    slides[index].classList.add('on');
    dots[index]?.classList.add('on');
  };

  let timer = setInterval(() => show(index + 1), 5000);
  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => show(index + 1), 5000);
  };

  root.querySelector('.gnav.next')?.addEventListener('click', () => { show(index + 1); restart(); });
  root.querySelector('.gnav.prev')?.addEventListener('click', () => { show(index - 1); restart(); });

  // barmoq bilan yon surish
  let startX = 0, startY = 0;
  root.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  root.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      show(index + (dx < 0 ? 1 : -1));
      restart();
    }
  }, { passive: true });
}

/* ---- like / save: sahifani yangilamasdan ---- */
async function toggleAction(button) {
  const url = button.dataset.action;
  try {
    const res = await fetch(url, { method: 'POST', headers: { accept: 'application/json' } });
    if (res.status === 401) {
      location.href = '/login?next=' + encodeURIComponent(location.pathname);
      return;
    }
    const data = await res.json();
    button.classList.toggle('on', data.on);
    if (data.count !== undefined) {
      const counter = button.querySelector('.count');
      if (counter) counter.textContent = data.count;
    }
    if (data.message) toast(data.message);
  } catch {
    toast('Amalni bajarib bo‘lmadi');
  }
}

/* ---- rasm yuklash: oldindan ko'rish ---- */
function initUpload(box) {
  const input = box.querySelector('input[type=file]');
  const list = document.querySelector(box.dataset.preview);
  if (!input) return;
  box.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    if (!list) return;
    list.innerHTML = '';
    [...input.files].slice(0, 10).forEach((file) => {
      const item = document.createElement('div');
      item.className = 'img-item';
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      item.append(img);
      list.append(item);
    });
  });
}

/* ---- e'lon turi tanlanganda formani qayta yuklash ---- */
function initTypeSwitch() {
  document.querySelectorAll('[data-type-switch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = new URL(location.href);
      url.searchParams.set('type', btn.dataset.typeSwitch);
      location.href = url.toString();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery').forEach(initGallery);
  document.querySelectorAll('.upload').forEach(initUpload);
  initTypeSwitch();

  document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]');
    if (action) {
      e.preventDefault();
      toggleAction(action);
      return;
    }
    const confirmBtn = e.target.closest('[data-confirm]');
    if (confirmBtn && !confirm(confirmBtn.dataset.confirm)) {
      e.preventDefault();
    }
  });

  const flash = new URLSearchParams(location.search).get('msg');
  if (flash) toast(flash);
});
