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

  // Fade in when scrolling into view, and fade out again when scrolling away.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
      });
    }, { threshold: 0.14 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Slow, subtle floating gold particles behind the content.
  const canvas = document.getElementById('particle-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = 0, height = 0, frame = 0;
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(65, Math.max(24, Math.floor(width / 18)));
      particles = Array.from({length: count}, () => ({
        x: Math.random() * width, y: Math.random() * height,
        r: 0.7 + Math.random() * 1.7,
        speed: 0.12 + Math.random() * 0.38,
        drift: (Math.random() - 0.5) * 0.28,
        alpha: 0.18 + Math.random() * 0.48
      }));
    }
    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -8) { p.y = height + 8; p.x = Math.random() * width; }
        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
        ctx.beginPath();
        ctx.fillStyle = `rgba(220, 183, 112, ${p.alpha})`;
        ctx.shadowColor = 'rgba(220, 183, 112, .28)';
        ctx.shadowBlur = 7;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      frame = requestAnimationFrame(animateParticles);
    }
    resizeCanvas();
    animateParticles();
    window.addEventListener('resize', resizeCanvas, {passive:true});
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else animateParticles();
    });
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

  // Try autoplay immediately. Browsers may block audible autoplay until the visitor taps.
  const backgroundMusic = document.getElementById('background-music');
  const musicWelcome = document.getElementById('music-welcome');
  const musicEnter = document.getElementById('music-enter');
  const musicEnterSilent = document.getElementById('music-enter-silent');
  const musicPlay = document.getElementById('music-play');
  const musicMute = document.getElementById('music-mute');
  const musicVolume = document.getElementById('music-volume');
  const musicStatus = document.getElementById('music-status');
  const musicHint = document.getElementById('music-hint');

  if (backgroundMusic && musicWelcome) {
    backgroundMusic.volume = 0.22;

    function closeMusicWelcome() {
      musicWelcome.classList.add('is-hidden');
      window.setTimeout(() => { musicWelcome.hidden = true; }, 700);
    }

    function setMusicUI(isPlaying) {
      if (musicPlay) {
        musicPlay.textContent = isPlaying ? 'Ⅱ' : '▶';
        musicPlay.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
      }
      if (musicStatus) musicStatus.textContent = isPlaying ? 'Music playing' : 'Music off';
    }

    async function startBackgroundMusic() {
      try {
        await backgroundMusic.play();
        setMusicUI(true);
        closeMusicWelcome();
      } catch (error) {
        setMusicUI(false);
        if (musicHint) musicHint.textContent = 'Your browser blocked autoplay. Tap “Enter with music” to start the soundtrack.';
        if (musicStatus) musicStatus.textContent = 'Tap to play';
      }
    }

    // Automatically try when the page opens; if blocked, the welcome screen stays visible.
    startBackgroundMusic();
    if (musicEnter) musicEnter.addEventListener('click', startBackgroundMusic);
    if (musicEnterSilent) musicEnterSilent.addEventListener('click', () => {
      closeMusicWelcome();
      setMusicUI(false);
    });

    if (musicPlay) musicPlay.addEventListener('click', async () => {
      if (backgroundMusic.paused) {
        try {
          await backgroundMusic.play();
          setMusicUI(true);
        } catch (error) {
          if (musicStatus) musicStatus.textContent = 'Add music file';
        }
      } else {
        backgroundMusic.pause();
        setMusicUI(false);
      }
    });

    if (musicMute) musicMute.addEventListener('click', () => {
      backgroundMusic.muted = !backgroundMusic.muted;
      musicMute.textContent = backgroundMusic.muted ? 'Unmute' : 'Mute';
      musicMute.setAttribute('aria-pressed', String(backgroundMusic.muted));
    });

    if (musicVolume) musicVolume.addEventListener('input', () => {
      backgroundMusic.volume = Number(musicVolume.value) / 100;
      if (backgroundMusic.volume > 0 && backgroundMusic.muted) {
        backgroundMusic.muted = false;
        if (musicMute) {
          musicMute.textContent = 'Mute';
          musicMute.setAttribute('aria-pressed', 'false');
        }
      }
    });

    backgroundMusic.addEventListener('ended', () => setMusicUI(false));
    backgroundMusic.addEventListener('error', () => {
      if (musicStatus) musicStatus.textContent = 'Add music file';
    });
    backgroundMusic.addEventListener('play', () => setMusicUI(true));
    backgroundMusic.addEventListener('pause', () => setMusicUI(false));
  }

  // ZYCEE 360-degree finger-controlled 3D card
  const heroFlipCard = document.getElementById('hero-flip-card');
  if (heroFlipCard) {
    let angle = 0;
    let startX = 0;
    let startAngle = 0;
    let pointerId = null;
    let dragged = false;
    let suppressClick = false;

    function setAngle(value) {
      angle = ((value % 360) + 360) % 360;
      heroFlipCard.style.setProperty('--flip-angle', angle + 'deg');
      const showingBack = angle > 90 && angle < 270;
      heroFlipCard.setAttribute('aria-pressed', String(showingBack));
    }

    heroFlipCard.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startAngle = angle;
      dragged = false;
      suppressClick = false;
      heroFlipCard.classList.add('is-dragging');
      try { heroFlipCard.setPointerCapture(pointerId); } catch (_) {}
    });

    heroFlipCard.addEventListener('pointermove', event => {
      if (pointerId !== event.pointerId) return;
      const deltaX = event.clientX - startX;
      if (Math.abs(deltaX) > 5) dragged = true;
      if (dragged) {
        // Move your finger horizontally to rotate the card through a full 360°.
        setAngle(startAngle + deltaX * 1.15);
      }
    });

    function finishDrag(event) {
      if (pointerId !== event.pointerId) return;
      if (dragged) suppressClick = true;
      pointerId = null;
      heroFlipCard.classList.remove('is-dragging');
    }
    heroFlipCard.addEventListener('pointerup', finishDrag);
    heroFlipCard.addEventListener('pointercancel', finishDrag);
    heroFlipCard.addEventListener('lostpointercapture', () => {
      pointerId = null;
      heroFlipCard.classList.remove('is-dragging');
    });

    // A simple tap still flips to the other side; dragging rotates freely.
    heroFlipCard.addEventListener('click', event => {
      if (suppressClick) {
        suppressClick = false;
        event.preventDefault();
        return;
      }
      setAngle(angle + 180);
    });

    heroFlipCard.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setAngle(angle + 180);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setAngle(angle + 30);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setAngle(angle - 30);
      }
    });
  }

})();