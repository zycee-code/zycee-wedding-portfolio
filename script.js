(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      menuButton.textContent = isOpen ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    }));
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // Buttons can preselect the matching service before the visitor fills the form.
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const select = document.getElementById('service');
      if (select) select.value = link.dataset.service;
    });
  });

  // Soft optional UI click tone. Browsers require the visitor to opt in first.
  const soundButton = document.querySelector('.sound-toggle');
  let soundEnabled = false;
  let audioContext = null;
  function playSoftClick() {
    if (!soundEnabled) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(520, audioContext.currentTime + 0.055);
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.075);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + 0.08);
    } catch (e) { /* Sound is optional; the site works without it. */ }
  }
  if (soundButton) {
    soundButton.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundButton.setAttribute('aria-pressed', String(soundEnabled));
      soundButton.querySelector('.sound-label').textContent = soundEnabled ? 'Sounds on' : 'Sounds off';
      if (soundEnabled) playSoftClick();
    });
  }
  document.addEventListener('click', event => {
    if (event.target.closest('a, button') && !event.target.closest('.sound-toggle')) playSoftClick();
  });

  const form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const service = (data.get('service') || '').toString().trim();
      const date = (data.get('date') || '').toString().trim();
      const notes = (data.get('notes') || '').toString().trim();
      const message = [
        'Hi ZYCEE! I would like to enquire about an edit.',
        '',
        `Name: ${name}`,
        `Service: ${service}`,
        date ? `Event date: ${date}` : '',
        notes ? `Project details: ${notes}` : ''
      ].filter(Boolean).join('\n');
      const url = 'https://wa.me/919496134192?text=' + encodeURIComponent(message);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();