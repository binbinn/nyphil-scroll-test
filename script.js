// Minimal, dependency-free scroll interactions. All animation is optional.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!prefersReducedMotion.matches && 'IntersectionObserver' in window) {
  document.body.classList.add('js-motion');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

const progressBar = document.getElementById('progressBar');
let ticking = false;
function updateProgress() {
  const full = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (full > 0 ? (window.scrollY / full * 100) : 0) + '%';
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
}, { passive: true });
updateProgress();

// Active sticky-chapter label changes as content scrolls into view.
const stickyStage = document.getElementById('stickyStage');
const storySteps = [...document.querySelectorAll('.story-step')];
if ('IntersectionObserver' in window) {
  const stepObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) stickyStage.textContent = entry.target.dataset.stage;
    });
  }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });
  storySteps.forEach(el => stepObserver.observe(el));
}

// Demo-only content toggle. The graphic is intentionally NOT connected to real data.
const demoViews = {
  representation: {
    label: 'RESEARCH QUESTION ONE',
    headline: 'Whose compositions appear?',
    body: 'Explore how the representation of composers changes over time.'
  },
  repertoire: {
    label: 'RESEARCH QUESTION TWO',
    headline: 'Which composers recur?',
    body: 'Examine how frequently composers appear across the recorded concert programs.'
  }
};
const dataTabs = document.querySelectorAll('.data-tab');
const dataLabel = document.getElementById('dataLabel');
const dataHeadline = document.getElementById('dataHeadline');
const dataBody = document.getElementById('dataBody');
dataTabs.forEach(tab => tab.addEventListener('click', () => {
  const view = demoViews[tab.dataset.tab];
  dataTabs.forEach(btn => {
    const active = btn === tab;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  dataLabel.textContent = view.label;
  dataHeadline.textContent = view.headline;
  dataBody.textContent = view.body;
}));

// Autoplay is muted; visitors can pause if they prefer.
const video = document.getElementById('heroVideo');
const motionToggle = document.getElementById('motionToggle');
let isPaused = prefersReducedMotion.matches;
if (isPaused) video.pause();
function reflectPauseState() {
  motionToggle.textContent = isPaused ? 'PLAY MOTION ▶' : 'PAUSE MOTION II';
  motionToggle.setAttribute('aria-pressed', String(isPaused));
  motionToggle.setAttribute('aria-label', isPaused ? 'Play background video' : 'Pause background video');
}
reflectPauseState();
motionToggle.addEventListener('click', () => {
  isPaused = !isPaused;
  if (isPaused) video.pause();
  else video.play().catch(() => { isPaused = true; reflectPauseState(); });
  reflectPauseState();
});
