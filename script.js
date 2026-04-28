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

// === FORM SUBMISSION ===
const form      = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', e => {
  e.preventDefault();

  // Basic validation
  const inputs = form.querySelectorAll('[required]');
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) { input.style.borderColor = '#EF4444'; valid = false; }
    else input.style.borderColor = '';
  });
  if (!valid) return;

  // Simulate async submit
  const original = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Sending…';
  submitBtn.disabled  = true;

  setTimeout(() => {
    submitBtn.innerHTML = '✓ Request Sent!';
    submitBtn.style.background = 'var(--green-dark)';

    setTimeout(() => {
      submitBtn.innerHTML       = original;
      submitBtn.disabled        = false;
      submitBtn.style.background = '';
      form.reset();
    }, 3200);
  }, 1100);
});

// Remove red border on re-type
form.querySelectorAll('[required]').forEach(input => {
  input.addEventListener('input', () => { input.style.borderColor = ''; });
});
