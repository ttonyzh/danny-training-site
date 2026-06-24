// === CAROUSEL ===
(function () {
  const track   = document.getElementById('carouselTrack');
  const slides  = track.querySelectorAll('.carousel__slide');
  const dots    = document.querySelectorAll('.carousel__dot');
  const prev    = document.getElementById('carouselPrev');
  const next    = document.getElementById('carouselNext');
  const total   = slides.length;
  let current   = 0;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Pause all videos, play current if it's a video
    track.querySelectorAll('video').forEach(v => v.pause());
    const activeVideo = slides[current].querySelector('video');
    if (activeVideo) activeVideo.play();
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.index)));

  // Keyboard arrows
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch / trackpad swipe
  let startX = 0, startY = 0, isDragging = false;

  track.addEventListener('pointerdown', e => {
    startX = e.clientX; startY = e.clientY;
    isDragging = true;
    track.classList.add('dragging');
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointerup', e => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1);
    }
  });

  // Trackpad horizontal scroll → carousel
  const panel = document.getElementById('carousel');
  let scrollBuffer = 0;
  panel.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // vertical scroll, ignore
    e.preventDefault();
    scrollBuffer += e.deltaX;
    if (scrollBuffer > 60)  { goTo(current + 1); scrollBuffer = 0; }
    if (scrollBuffer < -60) { goTo(current - 1); scrollBuffer = 0; }
  }, { passive: false });

  // Init — play video if it's the first slide
  goTo(0);
})();

// === NAVIGATION: scroll shadow + sticky behavior ===
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// === MOBILE MENU ===
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu when any nav link is clicked
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// === SCROLL ANIMATIONS (IntersectionObserver) ===
const animEls = document.querySelectorAll('.animate-fadeup, .animate-left, .animate-right');

const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

animEls.forEach(el => {
  // Hero elements animate via CSS keyframe — skip them here
  if (!el.closest('.hero')) observer.observe(el);
});

// === SMOOTH SCROLL for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

// === TRAINER SELECTION ===
document.querySelectorAll('.trainer-option').forEach(function (option) {
  option.addEventListener('click', function () {
    document.querySelectorAll('.trainer-option').forEach(function (o) {
      o.classList.remove('trainer-option--active');
    });
    option.classList.add('trainer-option--active');
    const trainerInput = document.getElementById('selectedTrainer');
    if (trainerInput) trainerInput.value = option.dataset.trainer;
  });
});

// === FORM SUBMISSION ===
const form      = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async e => {
  e.preventDefault();

  // Basic validation
  const inputs = form.querySelectorAll('[required]');
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) { input.style.borderColor = '#22C55E'; valid = false; }
    else input.style.borderColor = '';
  });
  if (!valid) return;

  const original = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Sending…';
  submitBtn.disabled  = true;

  const data = new FormData(form);

  try {
    const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
    const json = await res.json();

    if (json.success) {
      // Get selected trainer info
      const activeOption  = document.querySelector('.trainer-option.trainer-option--active');
      const trainerName   = activeOption ? activeOption.dataset.trainer   : 'Danny';
      const calendlyUrl   = activeOption ? activeOption.dataset.calendly  : '';

      // Update step 2 sub-text with trainer name
      const step2Sub = document.getElementById('step2Sub');
      if (step2Sub) step2Sub.textContent = 'Choose a date and time below to lock in your free first session with ' + trainerName + '.';

      // Hide the form — confirmation is in the Step 2 header
      const formWrapper = form.closest('.signup__form-wrapper');
      formWrapper.style.display = 'none';

      // Flip step tabs
      const stepTab1 = document.getElementById('stepTab1');
      const stepTab2 = document.getElementById('stepTab2');
      if (stepTab1) stepTab1.classList.remove('signup__tab--active');
      if (stepTab2) stepTab2.classList.add('signup__tab--active');

      // Expand card to full width
      const layout = document.querySelector('.signup__layout');
      if (layout) layout.classList.add('signup__layout--wide');

      const calendlyStep = document.getElementById('calendlyStep');
      if (calendlyStep) {
        calendlyStep.classList.remove('signup__step--hidden');

        // Inject Calendly for the selected trainer
        function launchCalendly() {
          if (typeof Calendly !== 'undefined' && calendlyUrl) {
            Calendly.initInlineWidget({
              url: calendlyUrl,
              parentElement: document.getElementById('calendlyContainer')
            });
          } else if (calendlyUrl) {
            setTimeout(launchCalendly, 150);
          }
        }
        launchCalendly();

        setTimeout(function () {
          const navEl = document.getElementById('nav');
          const offset = (navEl ? navEl.offsetHeight : 0) + 24;
          window.scrollTo({ top: calendlyStep.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        }, 80);
      }
    } else {
      submitBtn.innerHTML = 'Something went wrong — try again';
      submitBtn.disabled  = false;
    }
  } catch {
    submitBtn.innerHTML = 'Network error — try again';
    submitBtn.disabled  = false;
  }
});

// Remove red border on re-type
form.querySelectorAll('[required]').forEach(input => {
  input.addEventListener('input', () => { input.style.borderColor = ''; });
});
