/**
 * Dooron Dooron — Aansh.ai / Night Glow Video Engine
 * Inspired by Aansh.ai Kalyani 4-Look Aesthetic & Stitch Design System
 * 1. 3D Spotify Lyrics Card with Audio Spectrum Visualizer
 * 2. Artist Stipple Particle Portrait (3,500 dots) that breathes on the beat
 * 3. Gold Motion-Graphic Kinetic Typography & Bench Scene (Mitti Da Banda / Tu Ta Pari)
 * 4. Midnight Rain-on-Glass Music Player & Particle Outro Dissolve
 * 100% Client-Side Web Audio API & HTML5 Canvas (Zero External Bundlers)
 */

(function () {
  'use strict';

  // --- Stage & Audio References ---
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const stage = document.getElementById('stage');
  const audio = document.getElementById('audio');
  const bgVideo = document.getElementById('bg-video');

  // --- UI References ---
  const startOverlay = document.getElementById('start-overlay');
  const btnStart = document.getElementById('btn-start');
  const btnStartAction = document.getElementById('btn-start-action');
  const btnHeroFullscreen = document.getElementById('btn-hero-fullscreen');
  const orientationBanner = document.getElementById('orientation-banner');

  const controls = document.getElementById('controls');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const timeCurrent = document.getElementById('time-current');
  const timeTotal = document.getElementById('time-total');

  // Scrubber & Waveform
  const scrubberWrap = document.getElementById('scrubber-container');
  const scrubberProgress = document.getElementById('scrubber-progress');
  const scrubberThumb = document.getElementById('scrubber-thumb');
  const sectionMarkers = document.getElementById('section-markers');
  const waveformCanvas = document.getElementById('waveform-canvas');
  const wfCtx = waveformCanvas ? waveformCanvas.getContext('2d') : null;
  const tooltip = document.getElementById('scrubber-tooltip');
  const tooltipTime = document.getElementById('tooltip-time');
  const tooltipBadge = document.getElementById('tooltip-badge');

  // Volume & Fullscreen
  const btnVolume = document.getElementById('btn-volume');
  const iconVolHigh = document.getElementById('icon-volume-high');
  const iconVolMuted = document.getElementById('icon-volume-muted');
  const volumePopover = document.getElementById('volume-popover');
  const volumeSlider = document.getElementById('volume-slider');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const iconFsEnter = document.getElementById('icon-fs-enter');
  const iconFsExit = document.getElementById('icon-fs-exit');

  // Modal Sheet (In-stage)
  const btnLyricsToggle = document.getElementById('btn-lyrics-toggle');
  const lyricsModal = document.getElementById('lyrics-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const lyricsList = document.getElementById('lyrics-list');
  const lyricsScrollBox = document.getElementById('lyrics-scroll-box');

  // --- Canvas Resolution (1920x1080 Native Widescreen) ---
  const W = 1920;
  const H = 1080;
  canvas.width = W;
  canvas.height = H;

  // ============================================================
  // LEMO-OPUSCAR FILM ENGINE MATHEMATICAL CORE (core/lib.js)
  // Physics Spring Dynamics, Easing, Splines & Value Noise
  // ============================================================
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const ss = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const eio = t => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const eo = t => 1 - Math.pow(1 - clamp(t), 3);
  const ei = t => Math.pow(clamp(t), 3);
  const back = (t, s = 1.8) => { t = clamp(t) - 1; return 1 + t * t * ((s + 1) * t + s); };
  const spring = (t, k = 7, z = 0.35) => { t = Math.max(0, t); return 1 - Math.exp(-z * k * t) * Math.cos(k * Math.sqrt(1 - z * z) * t * 1.6); };
  const env = (t, a, b, fi = 0.3, fo = 0.3) => Math.min(seg(t, a, a + fi), 1 - seg(t, b - fo, b));
  const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
  const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u); };

  // LEMO-OPUSCAR 35MM PHOTOCHEMICAL FILM GRAIN & DITHER BUFFER
  let grainPattern = null;
  try {
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = 256;
    grainCanvas.height = 256;
    const gctx = grainCanvas.getContext('2d');
    const gImg = gctx.createImageData(256, 256);
    const gData = gImg.data;
    for (let i = 0; i < gData.length; i += 4) {
      const noise = (Math.random() - 0.5) * 32;
      const val = Math.min(255, Math.max(0, 128 + noise));
      gData[i] = val;
      gData[i + 1] = val;
      gData[i + 2] = val;
      gData[i + 3] = 255;
    }
    gctx.putImageData(gImg, 0, 0);
    grainPattern = ctx.createPattern(grainCanvas, 'repeat');
  } catch (e) {
    console.warn('Film grain pattern creation skipped:', e);
  }

  // --- Engine State ---
  let isPlaying = false;
  let hasStarted = false;
  let alignmentData = null;
  let beatsData = null;
  let portraitParticles = null;
  let hideControlsTimer = null;
  let isDraggingScrubber = false;
  let currentActiveLineIdx = -1;

  // --- 3D Camera & Gyroscope / Pointer Tracking ---
  const camera = {
    yaw: 0,
    pitch: 0,
    targetYaw: 0,
    targetPitch: 0
  };

  let pointerX = 0; // -1 to 1
  let pointerY = 0; // -1 to 1

  function onPointerMove(e) {
    const rect = stage.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.width / 2);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.height / 2);

    const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((clientY - rect.top) / rect.height) * 2 - 1;

    pointerX = Math.max(-1, Math.min(1, nx));
    pointerY = Math.max(-1, Math.min(1, ny));

    camera.targetYaw = pointerX * 0.06;
    camera.targetPitch = pointerY * 0.04;

    revealControls();
    resetControlsTimer();
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  // Touch & Beat Ripple Shockwaves on Water
  const waterRipples = [];
  function addRipple(canvasX, canvasY, maxRadius = 140) {
    if (canvasY >= H * 0.65) {
      waterRipples.push({
        x: canvasX,
        y: canvasY,
        r: 6,
        maxR: maxRadius,
        alpha: 0.85
      });
    }
  }

  stage.addEventListener('pointerdown', (e) => {
    const rect = stage.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    addRipple(canvasX, canvasY, 160);
    revealControls();
    resetControlsTimer();
  });

  // ============================================================
  // PROCEDURAL AESTHETICS & PARTICLE SYSTEMS
  // ============================================================

  // 1. Starfield (240 twinkling stars with parallax depth)
  const stars = [];
  for (let i = 0; i < 240; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * (H * 0.72),
      r: Math.random() * 2.2 + 0.6,
      alpha: Math.random() * 0.75 + 0.25,
      speed: Math.random() * 2.5 + 0.8,
      phase: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.8 ? '220, 240, 255' : (Math.random() > 0.6 ? '200, 225, 255' : '255, 255, 255')
    });
  }

  // 2. Shooting Stars (Comets)
  const shootingStars = [];
  let nextShootingStarTime = 4.0;

  function spawnShootingStar(currentTime) {
    const startX = Math.random() * (W * 0.75) + W * 0.1;
    const startY = Math.random() * (H * 0.30);
    const angle = Math.PI * (0.15 + Math.random() * 0.15);
    const speed = Math.random() * 16 + 22;
    shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1.0,
      life: 0,
      maxLife: Math.random() * 30 + 35
    });
    nextShootingStarTime = currentTime + Math.random() * 6 + 4;
  }

  // 3. Floating Bokeh Motes
  const motes = [];
  for (let i = 0; i < 85; i++) {
    motes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3.8 + 1.2,
      vx: (Math.random() - 0.5) * 0.65,
      vy: -(Math.random() * 0.75 + 0.3),
      baseAlpha: Math.random() * 0.55 + 0.25,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.6 ? '130, 195, 255' : (Math.random() > 0.3 ? '180, 220, 255' : '255, 240, 210')
    });
  }

  // 4. Floating Blossom Petals (For Mitti Da Banda scene)
  const blossomPetals = [];
  for (let i = 0; i < 35; i++) {
    blossomPetals.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.random() * 1.2 + 0.6,
      vy: Math.random() * 0.8 + 0.4,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.05,
      r: Math.random() * 4.5 + 2.5,
      alpha: Math.random() * 0.6 + 0.3
    });
  }

  // 5. Look 4: Rain on Glass Drops
  const raindrops = [];
  for (let i = 0; i < 120; i++) {
    raindrops.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 4.5 + 2.0,
      alpha: Math.random() * 0.6 + 0.3,
      isStreak: Math.random() > 0.85,
      streakLen: Math.random() * 45 + 20,
      vy: Math.random() * 3.5 + 2.0
    });
  }

  // 6. Active Word Sparks
  const wordSparks = [];
  const dustParticles = [];

  // 7. Outro Dissolve Particles
  const outroParticles = [];
  let outroInitialized = false;

  // Last Beat Shockwave Tracker
  let lastBeatDropTrigger = 0;

  // ============================================================
  // DATA LOADING & PREPARATION
  // ============================================================

  async function loadData() {
    try {
      const [alignRes, beatsRes, portraitRes] = await Promise.all([
        fetch('alignment.json').then(r => r.json()),
        fetch('beats.json').then(r => r.json()),
        fetch('portrait_particles.json').then(r => r.json()).catch(() => null)
      ]);
      alignmentData = alignRes;
      beatsData = beatsRes;
      portraitParticles = portraitRes;
      renderWaveform();
      renderSectionMarkers();
      buildLyricsModal();
    } catch (err) {
      console.warn('Data fetch error, running with fallback defaults:', err);
    }
  }

  loadData();

  function renderWaveform() {
    if (!wfCtx || !beatsData || !beatsData.energy) return;
    const w = waveformCanvas.width;
    const h = waveformCanvas.height;
    wfCtx.clearRect(0, 0, w, h);

    const energyArr = beatsData.energy;
    const count = energyArr.length;
    if (count === 0) return;

    wfCtx.fillStyle = 'rgba(56, 189, 248, 0.55)';
    const barWidth = Math.max(1, w / 160);
    const step = Math.max(1, Math.floor(count / 160));

    for (let i = 0; i < 160; i++) {
      const idx = Math.min(count - 1, i * step);
      const val = energyArr[idx] ? energyArr[idx].e : 0.2;
      const barH = Math.max(2, val * h * 1.35);
      const x = (i / 160) * w;
      const y = (h - barH) / 2;
      wfCtx.fillRect(x, y, barWidth - 0.5, barH);
    }
  }

  function renderSectionMarkers() {
    if (!beatsData || !beatsData.sections || !sectionMarkers) return;
    sectionMarkers.innerHTML = '';
    const total = beatsData.duration || 189.43;

    beatsData.sections.forEach(sec => {
      const pct = (sec.start / total) * 100;
      const tick = document.createElement('div');
      tick.className = 'section-tick';
      tick.style.left = `${pct}%`;
      tick.title = sec.label;
      sectionMarkers.appendChild(tick);
    });
  }

  function buildLyricsModal() {
    if (!alignmentData || !alignmentData.lines) return;
    lyricsList.innerHTML = '';
    alignmentData.lines.forEach((line, idx) => {
      const li = document.createElement('li');
      li.className = 'lyric-item';
      li.id = `modal-line-${idx}`;
      li.textContent = `${idx + 1}. ${line.text}`;
      li.addEventListener('click', () => {
        seekTo(line.start / (audio.duration || 189.43));
        lyricsModal.classList.add('hidden');
      });
      lyricsList.appendChild(li);
    });
  }

  // ============================================================
  // PLAYBACK CONTROLS & EVENT WIRING
  // ============================================================

  function startPlayback() {
    if (bgVideo) {
      bgVideo.currentTime = audio.currentTime;
      bgVideo.play().catch(() => {});
    }
    audio.play().then(() => {
      isPlaying = true;
      hasStarted = true;
      startOverlay.classList.remove('visible');
      revealControls();
      resetControlsTimer();
      updatePlayIcons();
    }).catch(err => {
      console.warn('Audio play was prevented:', err);
    });
  }

  btnStart.addEventListener('click', startPlayback);
  if (btnStartAction) {
    btnStartAction.addEventListener('click', startPlayback);
  }

  if (btnHeroFullscreen) {
    btnHeroFullscreen.addEventListener('click', () => {
      toggleFullscreen();
    });
  }

  function togglePlayPause() {
    if (audio.paused) {
      audio.play();
      if (bgVideo) bgVideo.play().catch(() => {});
      isPlaying = true;
    } else {
      audio.pause();
      if (bgVideo) bgVideo.pause();
      isPlaying = false;
    }
    updatePlayIcons();
    revealControls();
    resetControlsTimer();
  }

  btnPlayPause.addEventListener('click', togglePlayPause);

  function updatePlayIcons() {
    if (audio.paused) {
      iconPlay.classList.remove('hidden');
      iconPause.classList.add('hidden');
    } else {
      iconPlay.classList.add('hidden');
      iconPause.classList.remove('hidden');
    }
  }

  audio.addEventListener('play', updatePlayIcons);
  audio.addEventListener('pause', updatePlayIcons);

  function revealControls() {
    controls.classList.remove('hidden');
  }

  function resetControlsTimer() {
    clearTimeout(hideControlsTimer);
    if (!isPlaying) return;
    hideControlsTimer = setTimeout(() => {
      if (lyricsModal.classList.contains('hidden') && volumePopover.classList.contains('hidden')) {
        controls.classList.add('hidden');
      }
    }, 3200);
  }

  revealControls();
  resetControlsTimer();

  // Scrubber Seeking
  function getScrubberPos(e) {
    const rect = scrubberWrap.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }

  function seekTo(pos) {
    const total = audio.duration || (beatsData ? beatsData.duration : 189.43);
    const seekTime = pos * total;
    audio.currentTime = seekTime;
    if (bgVideo) bgVideo.currentTime = seekTime;
  }

  function updateScrubberTooltip(pos) {
    const total = audio.duration || (beatsData ? beatsData.duration : 189.43);
    const targetTime = pos * total;
    tooltipTime.textContent = formatTime(targetTime);

    if (beatsData && beatsData.sections) {
      const sec = beatsData.sections.find(s => targetTime >= s.start && targetTime <= s.end);
      tooltipBadge.textContent = sec ? sec.label : 'Dooron Dooron';
    }

    tooltip.style.left = `${pos * 100}%`;
    tooltip.classList.remove('hidden');
  }

  scrubberWrap.addEventListener('pointerdown', (e) => {
    isDraggingScrubber = true;
    const pos = getScrubberPos(e);
    seekTo(pos);
    updateScrubberTooltip(pos);
  });

  window.addEventListener('pointermove', (e) => {
    if (isDraggingScrubber) {
      const pos = getScrubberPos(e);
      seekTo(pos);
      updateScrubberTooltip(pos);
    }
  });

  window.addEventListener('pointerup', () => {
    if (isDraggingScrubber) {
      isDraggingScrubber = false;
      tooltip.classList.add('hidden');
    }
  });

  scrubberWrap.addEventListener('pointerenter', (e) => {
    if (!isDraggingScrubber) {
      const pos = getScrubberPos(e);
      updateScrubberTooltip(pos);
    }
  });

  scrubberWrap.addEventListener('pointerleave', () => {
    if (!isDraggingScrubber) {
      tooltip.classList.add('hidden');
    }
  });

  // Volume Popover
  btnVolume.addEventListener('click', (e) => {
    e.stopPropagation();
    volumePopover.classList.toggle('hidden');
  });

  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    audio.muted = (val === 0);
    updateVolumeIcon();
  });

  function updateVolumeIcon() {
    if (audio.muted || audio.volume === 0) {
      iconVolHigh.classList.add('hidden');
      iconVolMuted.classList.remove('hidden');
    } else {
      iconVolHigh.classList.remove('hidden');
      iconVolMuted.classList.add('hidden');
    }
  }

  window.addEventListener('click', (e) => {
    if (!volumePopover.contains(e.target) && e.target !== btnVolume && !btnVolume.contains(e.target)) {
      volumePopover.classList.add('hidden');
    }
  });

  // Fullscreen
  btnFullscreen.addEventListener('click', toggleFullscreen);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      (stage.requestFullscreen || stage.webkitRequestFullscreen || stage.mozRequestFullScreen).call(stage);
      iconFsEnter.classList.add('hidden');
      iconFsExit.classList.remove('hidden');
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen).call(document);
      iconFsEnter.classList.remove('hidden');
      iconFsExit.classList.add('hidden');
    }
  }

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      iconFsEnter.classList.remove('hidden');
      iconFsExit.classList.add('hidden');
    }
  });

  // Lyrics Sheet Modal (Contained within stage)
  btnLyricsToggle.addEventListener('click', () => {
    lyricsModal.classList.remove('hidden');
    if (currentActiveLineIdx >= 0) {
      const activeEl = document.getElementById(`modal-line-${currentActiveLineIdx}`);
      if (activeEl) {
        lyricsScrollBox.scrollTop = activeEl.offsetTop - lyricsScrollBox.offsetTop - 60;
      }
    }
  });

  btnCloseModal.addEventListener('click', () => {
    lyricsModal.classList.add('hidden');
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!hasStarted) startPlayback();
      else togglePlayPause();
    } else if (e.code === 'KeyF') {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.code === 'KeyM') {
      e.preventDefault();
      audio.muted = !audio.muted;
      updateVolumeIcon();
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      audio.currentTime = Math.min((audio.duration || 189.43), audio.currentTime + 5);
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    }
  });

  function formatTime(sec) {
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  }

  function getEnergy(t) {
    if (!beatsData || !beatsData.energy) return 0.25;
    const arr = beatsData.energy;
    const idx = Math.min(arr.length - 1, Math.max(0, Math.floor(t * 10)));
    return arr[idx] ? arr[idx].e : 0.25;
  }

  function getBeatPulse(t) {
    if (!beatsData || !beatsData.beat_times) return 0;
    const bt = beatsData.beat_times;
    let closestDiff = 999;
    for (let i = 0; i < bt.length; i++) {
      const diff = Math.abs(t - bt[i]);
      if (diff < closestDiff) closestDiff = diff;
      if (bt[i] > t + 0.3) break;
    }
    return Math.max(0, 1.0 - closestDiff / 0.22);
  }

  // ============================================================
  // CINEMATIC PROCEDURAL CANVAS RENDER ENGINE (AANSH.AI 4-LOOKS)
  // ============================================================

  function render(time) {
    requestAnimationFrame(render);

    const currentTime = audio.currentTime || 0;
    const totalDuration = audio.duration || (beatsData ? beatsData.duration : 189.43);

    const energy = getEnergy(currentTime);
    const beatPulse = getBeatPulse(currentTime);

    // Spawn water shockwave on hard bass beats
    if (beatPulse > 0.75 && (currentTime - lastBeatDropTrigger > 0.45)) {
      lastBeatDropTrigger = currentTime;
      addRipple(W * 0.50 + (Math.random() - 0.5) * 200, H * 0.72, 280);
    }

    // Sync video time with audio if drifted
    if (bgVideo && !bgVideo.paused && Math.abs(bgVideo.currentTime - currentTime) > 0.3) {
      bgVideo.currentTime = currentTime;
    }

    // Camera 3D Interpolation
    camera.pitch += (camera.targetPitch - camera.pitch) * 0.08;
    camera.yaw += (camera.targetYaw - camera.yaw) * 0.08;

    // Slow push-in scale during quiet opening (0:00 to 5.0s)
    let pushInScale = 1.0;
    if (currentTime < 5.0) {
      pushInScale = 1.0 + (currentTime / 5.0) * 0.05;
    }

    // Update Scrubber Progress
    if (totalDuration > 0) {
      const pct = (currentTime / totalDuration) * 100;
      scrubberProgress.style.width = `${pct}%`;
      scrubberThumb.style.left = `${pct}%`;
      timeCurrent.textContent = formatTime(currentTime);
      timeTotal.textContent = formatTime(totalDuration);
    }

    // Clear Canvas
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    // 3D Parallax Camera Translation & Gentle Tilt
    ctx.translate(W / 2, H / 2);
    ctx.scale(pushInScale, pushInScale);
    ctx.rotate(camera.yaw * 0.25);
    ctx.translate(-W / 2, -H / 2);

    // 1. Background Layer: Video Clip or Deep Midnight Abyss Gradient
    if (bgVideo && bgVideo.readyState >= 2 && !bgVideo.paused && !bgVideo.ended) {
      ctx.save();
      // One look: night blue grade, dimmed per spec ("Dim any blown-out clip moment so the text always wins")
      ctx.filter = 'brightness(0.68) contrast(1.18) saturate(0.82) hue-rotate(15deg)';
      ctx.drawImage(bgVideo, 0, 0, W, H);
      ctx.restore();

      // Soft night-blue vignette & contrast backing
      const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.22, W / 2, H / 2, W * 0.78);
      vig.addColorStop(0, 'rgba(2, 4, 10, 0.30)');
      vig.addColorStop(0.65, 'rgba(3, 8, 22, 0.75)');
      vig.addColorStop(1, 'rgba(2, 4, 10, 0.94)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    } else {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#02040a');
      skyGrad.addColorStop(0.35, '#040b1e');
      skyGrad.addColorStop(0.70, '#081c3e');
      skyGrad.addColorStop(1, '#153664');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Starfield (Far Layer with depth parallax)
    stars.forEach(st => {
      const px = st.x + camera.yaw * 160 * st.depth;
      const py = st.y + camera.pitch * 120 * st.depth;
      const alpha = Math.min(1, st.alpha + Math.sin(time * 0.002 * st.speed + st.phase) * 0.35);
      ctx.fillStyle = `rgba(${st.color}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, st.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Shooting Stars (Comets)
    if (currentTime >= nextShootingStarTime) {
      spawnShootingStar(currentTime);
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life++;
      const p = ss.life / ss.maxLife;
      ss.alpha = Math.max(0, 1 - p);

      if (p >= 1.0) {
        shootingStars.splice(i, 1);
        continue;
      }

      ctx.save();
      const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 3.5, ss.y - ss.vy * 3.5);
      grad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
      grad.addColorStop(0.3, `rgba(130, 210, 255, ${ss.alpha * 0.8})`);
      grad.addColorStop(1, 'rgba(130, 210, 255, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.vx * 3.5, ss.y - ss.vy * 3.5);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Star Constellations (Dynamic star linking during Verses)
    if (currentTime >= 43.8 && currentTime < 96.0) {
      renderConstellations(time, energy);
    }

    // 5. Procedural Aurora Borealis (Bioluminescent Emerald & Cyan Ribbons)
    renderAuroraBorealis(time, energy, beatPulse);

    // 6. Glowing Moon & Multi-Layer Corona
    const moonX = W * 0.76 + camera.yaw * 110;
    const moonY = H * 0.22 + camera.pitch * 70;

    // Corona Bloom
    const corona = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 280);
    corona.addColorStop(0, `rgba(225, 245, 255, ${0.45 + beatPulse * 0.22})`);
    corona.addColorStop(0.35, `rgba(56, 189, 248, ${0.22 + energy * 0.16})`);
    corona.addColorStop(1, 'rgba(2, 4, 10, 0)');
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 280, 0, Math.PI * 2);
    ctx.fill();

    // Sharp Crescent Moon
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 28;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.95)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#060f25';
    ctx.beginPath();
    ctx.arc(moonX - 16, moonY - 6, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Parallax Horizon, Mountains, Water & Volumetric Mist
    const waterLevel = H * 0.70;
    renderHorizonAndWater(waterLevel, time, beatPulse, energy, moonX);

    // 8. Dynamic Water Ripples & Shockwaves
    for (let i = waterRipples.length - 1; i >= 0; i--) {
      const rip = waterRipples[i];
      rip.r += 3.8;
      rip.alpha -= 0.016;
      if (rip.alpha <= 0 || rip.r >= rip.maxR) {
        waterRipples.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${rip.alpha})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 9. Floating Bokeh Light Motes
    motes.forEach(m => {
      m.y += m.vy * (1 + energy * 0.9);
      m.x += m.vx + Math.sin(time * 0.001 + m.phase) * 0.4;
      if (m.y < -20) { m.y = H + 20; m.x = Math.random() * W; }
      if (m.x < -20) m.x = W + 20;
      if (m.x > W + 20) m.x = -20;

      const alpha = Math.min(1, m.baseAlpha + beatPulse * 0.35);
      const r = m.r * (1 + beatPulse * 0.2);
      ctx.fillStyle = `rgba(${m.color}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // ============================================================
    // AANSH.AI / NIGHT-GLOW OPENING SEQUENCE (0:00 to 16.36s)
    // 0:00 - 5.0s: Quiet scene with no typography, slow cinematic push-in
    // 5.0s - 12.0s: Frosted-glass Instagram post card of clip 2 (likes, caption, audio tag)
    // 12.0s - 16.36s: 3D camera dive through card into glowing Song Title
    // ============================================================
    if (currentTime >= 5.0 && currentTime < 12.0) {
      renderInstagramPostCard(currentTime, beatPulse);
    } else if (currentTime >= 12.0 && currentTime < 16.36) {
      renderInstagramDiveAndTitle(currentTime, beatPulse);
    }

    // LOOK 2: Artist Stipple Particle Portrait (3,500 dots that breathe on beat) (16.36s to 86.5s)
    if (currentTime >= 16.36 && currentTime < 86.5) {
      renderArtistParticlePortrait(time, energy, beatPulse);
      renderObserverSilhouette(currentTime, beatPulse);
    }

    // LOOK 3: Gold Motion Graphics & Signature Bench Scene (86.5s to 150s)
    if (currentTime >= 86.5 && currentTime <= 150.0) {
      renderMittiPariScene(currentTime, beatPulse, time);
    }

    // Harbor Twinkles & Rising Lanterns (43.8s to 71.5s)
    if (currentTime >= 43.8 && currentTime < 71.5) {
      renderHarborLightsAndLanterns(time, currentTime, beatPulse);
    }

    // LOOK 4: Rain on Glass Ending & Outro Particle Dissolve (150s to 189.43s)
    if (currentTime >= 150.0) {
      renderRainOnGlass(time, currentTime);
      renderOutroDissolve(currentTime);
    }

    // ============================================================
    // NIGHT-GLOW KINETIC TYPOGRAPHY (KEY HIERARCHY & MEANING MOMENTS)
    // ============================================================
    if (currentTime >= 16.36) {
      renderNightGlowTypography(currentTime, beatPulse, energy);
    }

    // ============================================================
    // LEMO-OPUSCAR 35MM PHOTOCHEMICAL FILM GRAIN PASS
    // Micro-dither eliminating banding on deep night-blue gradients
    // ============================================================
    if (grainPattern) {
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.038 + beatPulse * 0.010;
      ctx.fillStyle = grainPattern;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    ctx.restore();
  }

  // --- Constellations (Star Connections) ---
  function renderConstellations(time, energy) {
    ctx.save();
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 + energy * 0.12})`;
    ctx.lineWidth = 1;

    for (let i = 0; i < 40; i += 3) {
      const a = stars[i];
      const b = stars[i + 1];
      const c = stars[i + 2];
      if (!a || !b || !c) continue;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Aurora Borealis (Bioluminescent Emerald & Cyan Ribbons) ---
  function renderAuroraBorealis(time, energy, beatPulse) {
    ctx.save();
    const ribbons = [
      { color: '16, 185, 129', baseAlpha: 0.18, yOffset: H * 0.18, freq: 0.0012, amp: 55 },
      { color: '56, 189, 248', baseAlpha: 0.15, yOffset: H * 0.24, freq: 0.0016, amp: 45 },
      { color: '138, 43, 226', baseAlpha: 0.12, yOffset: H * 0.14, freq: 0.0009, amp: 65 }
    ];

    ribbons.forEach((rib, rIdx) => {
      const alpha = (rib.baseAlpha + energy * 0.18 + beatPulse * 0.10);
      const amp = rib.amp * (1 + energy * 0.8);
      const grad = ctx.createLinearGradient(0, rib.yOffset - 90, 0, rib.yOffset + 120);
      grad.addColorStop(0, `rgba(${rib.color}, 0)`);
      grad.addColorStop(0.5, `rgba(${rib.color}, ${alpha})`);
      grad.addColorStop(1, `rgba(${rib.color}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, rib.yOffset);

      for (let x = 0; x <= W; x += 30) {
        const wave1 = Math.sin(x * 0.0025 + time * rib.freq + rIdx) * amp;
        const wave2 = Math.cos(x * 0.005 - time * rib.freq * 0.7) * (amp * 0.45);
        ctx.lineTo(x, rib.yOffset + wave1 + wave2);
      }

      ctx.lineTo(W, H * 0.55);
      ctx.lineTo(0, H * 0.55);
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
  }

  // --- Parallax Mountain Treeline, Water Reflections & Mist ---
  function renderHorizonAndWater(baseY, time, beatPulse, energy, moonX) {
    const shiftX = camera.yaw * 60;
    const shiftY = camera.pitch * 35;

    // Distant Mountain Ridges
    ctx.save();
    ctx.fillStyle = '#040b1c';
    ctx.beginPath();
    ctx.moveTo(0, baseY + shiftY);
    ctx.quadraticCurveTo(W * 0.22 + shiftX, baseY - 65 + shiftY, W * 0.48 + shiftX, baseY - 25 + shiftY);
    ctx.quadraticCurveTo(W * 0.72 + shiftX, baseY - 70 + shiftY, W, baseY - 35 + shiftY);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Near Forest Silhouette Ridge
    ctx.fillStyle = '#020713';
    ctx.beginPath();
    ctx.moveTo(0, baseY + shiftY);
    for (let x = 0; x <= W; x += 40) {
      const treeH = Math.sin(x * 0.08) * 12 + 10;
      ctx.lineTo(x + shiftX * 0.4, baseY - treeH + shiftY);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // Water Surface Gradient
    const waterGrad = ctx.createLinearGradient(0, baseY, 0, H);
    waterGrad.addColorStop(0, 'rgba(4, 10, 28, 0.98)');
    waterGrad.addColorStop(0.35, 'rgba(6, 18, 44, 0.92)');
    waterGrad.addColorStop(1, '#02040a');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, baseY, W, H - baseY);

    // Silhouette-Rhythm Moon Reflection Column with Organic Noise Wobble
    const wobbleMoon = moonX + (vnoise(time * 0.0015) - 0.5) * 35;
    const reflGrad = ctx.createRadialGradient(wobbleMoon, baseY + 60, 10, wobbleMoon, baseY + 200, 340);
    reflGrad.addColorStop(0, `rgba(224, 242, 254, ${0.45 + beatPulse * 0.28})`);
    reflGrad.addColorStop(0.35, `rgba(56, 189, 248, ${0.22 + energy * 0.16})`);
    reflGrad.addColorStop(1, 'rgba(2, 4, 10, 0)');
    ctx.fillStyle = reflGrad;
    ctx.fillRect(wobbleMoon - 220, baseY, 440, H - baseY);

    // Silhouette-Rhythm Dual Perspective Ripples: Dark Trough + Luminous Crest
    for (let r = 0; r < 9; r++) {
      const perspectiveScale = 1.0 + r * 0.32;
      const y = baseY + 14 + Math.pow(r / 9, 1.4) * (H - baseY - 24);
      const wave = Math.sin(time * 0.0018 + r * 1.2) * (20 * perspectiveScale + energy * 22);

      // Dark Trough (occlusion)
      ctx.strokeStyle = 'rgba(2, 6, 23, 0.75)';
      ctx.lineWidth = 2.4 * perspectiveScale;
      ctx.beginPath();
      ctx.moveTo(W * 0.04, y + 2.5);
      ctx.bezierCurveTo(
        W * 0.30 + wave, y + 6,
        W * 0.70 - wave, y - 2,
        W * 0.96, y + 2.5
      );
      ctx.stroke();

      // Luminous Crest (starlight highlight)
      ctx.strokeStyle = `rgba(147, 197, 253, ${0.22 + beatPulse * 0.18})`;
      ctx.lineWidth = 1.4 * perspectiveScale;
      ctx.beginPath();
      ctx.moveTo(W * 0.04, y);
      ctx.bezierCurveTo(
        W * 0.30 + wave, y + 4,
        W * 0.70 - wave, y - 4,
        W * 0.96, y
      );
      ctx.stroke();
    }

    // Volumetric Rolling Lake Mist
    const mistGrad = ctx.createLinearGradient(0, baseY - 20, 0, baseY + 90);
    mistGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    mistGrad.addColorStop(0.5, `rgba(56, 189, 248, ${0.08 + Math.sin(time * 0.001) * 0.03})`);
    mistGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, baseY - 20, W, 110);

    ctx.restore();
  }

  // --- Opening: Frosted-Glass Instagram Post Card (5.0s to 12.0s) ---
  function renderInstagramPostCard(t, beatPulse) {
    ctx.save();

    // Subtle breathing / tilt
    const cardW = 520;
    const cardH = 650;
    const cx = W / 2;
    const cy = H / 2 - 15;

    ctx.translate(cx, cy);
    ctx.rotate(pointerX * 0.035);

    // Fade in from 5.0s to 5.8s
    let cardAlpha = 1.0;
    if (t < 5.8) {
      cardAlpha = (t - 5.0) / 0.8;
    }
    ctx.globalAlpha = Math.max(0, Math.min(1, cardAlpha));

    // Outer Glow & Shadow
    ctx.shadowBlur = 48;
    ctx.shadowColor = 'rgba(2, 6, 23, 0.88)';

    // Card Surface - Specular Glassmorphism
    const cardBg = ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2);
    cardBg.addColorStop(0, 'rgba(10, 20, 44, 0.88)');
    cardBg.addColorStop(0.6, 'rgba(6, 12, 28, 0.92)');
    cardBg.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
    ctx.fillStyle = cardBg;
    ctx.strokeStyle = 'rgba(130, 185, 255, 0.32)';
    ctx.lineWidth = 1.6;
    roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 22);
    ctx.fill();
    ctx.stroke();

    // 1. Post Header: User Profile
    ctx.shadowBlur = 0;
    const headerY = -cardH / 2 + 36;
    const avatarX = -cardW / 2 + 36;

    // Avatar Story Ring (Instagram gradient)
    const ringGrad = ctx.createLinearGradient(avatarX - 18, headerY - 18, avatarX + 18, headerY + 18);
    ringGrad.addColorStop(0, '#f43f5e');
    ringGrad.addColorStop(0.5, '#ec4899');
    ringGrad.addColorStop(1, '#8b5cf6');
    ctx.strokeStyle = ringGrad;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(avatarX, headerY, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Avatar Circle
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(avatarX, headerY, 17, 0, Math.PI * 2);
    ctx.fill();

    // Stylized User Silhouette in Avatar
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.arc(avatarX, headerY - 4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(avatarX, headerY + 12, 10, Math.PI, 0, false);
    ctx.fill();

    // Username & Verified Badge
    ctx.fillStyle = '#ffffff';
    ctx.font = "600 15px 'Inter', sans-serif";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('pareshpahuja', avatarX + 30, headerY - 7);

    // Blue Verified Badge Circle
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(avatarX + 144, headerY - 7, 7, 0, Math.PI * 2);
    ctx.fill();
    // Checkmark inside badge
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(avatarX + 141, headerY - 7);
    ctx.lineTo(avatarX + 143.5, headerY - 4.5);
    ctx.lineTo(avatarX + 147.5, headerY - 9);
    ctx.stroke();

    // Location / Audio subtitle
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.font = "400 11px 'Inter', sans-serif";
    ctx.fillText('Night Glow · Dooron Dooron', avatarX + 30, headerY + 11);

    // Three Dots Menu on Right
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = "700 18px 'Inter', sans-serif";
    ctx.textAlign = 'right';
    ctx.fillText('···', cardW / 2 - 28, headerY);

    // 2. Media Viewport Window (Scene 2 Couple Frame)
    const mediaW = cardW - 40;
    const mediaH = 370;
    const mediaX = -mediaW / 2;
    const mediaY = -cardH / 2 + 72;

    ctx.save();
    roundRect(ctx, mediaX, mediaY, mediaW, mediaH, 14);
    ctx.clip();

    // Background within media: Video clip or procedural couple under starry night
    if (bgVideo && bgVideo.readyState >= 2 && !bgVideo.paused) {
      ctx.drawImage(bgVideo, 0, 0, W, H, mediaX, mediaY, mediaW, mediaH);
      // Soft color overlay
      ctx.fillStyle = 'rgba(2, 6, 23, 0.35)';
      ctx.fillRect(mediaX, mediaY, mediaW, mediaH);
    } else {
      // Procedural Night Deep View
      const innerGrad = ctx.createLinearGradient(mediaX, mediaY, mediaX, mediaY + mediaH);
      innerGrad.addColorStop(0, '#040b1e');
      innerGrad.addColorStop(0.5, '#081c3e');
      innerGrad.addColorStop(1, '#02040a');
      ctx.fillStyle = innerGrad;
      ctx.fillRect(mediaX, mediaY, mediaW, mediaH);

      // Distant Crescent Moon
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#38bdf8';
      ctx.beginPath();
      ctx.arc(mediaX + mediaW * 0.75, mediaY + 70, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#040b1e';
      ctx.beginPath();
      ctx.arc(mediaX + mediaW * 0.75 - 8, mediaY + 66, 20, 0, Math.PI * 2);
      ctx.fill();

      // Couple Silhouette in media
      ctx.fillStyle = '#020617';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(mediaX + mediaW * 0.42, mediaY + mediaH - 85, 18, 0, Math.PI * 2);
      ctx.arc(mediaX + mediaW * 0.54, mediaY + mediaH - 80, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(mediaX + mediaW * 0.48, mediaY + mediaH - 25, 62, 50, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Audio Tag Pill in Bottom-Right of Media
    const pillW = 190;
    const pillH = 26;
    const pillX = mediaX + mediaW - pillW - 12;
    const pillY = mediaY + mediaH - pillH - 12;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    roundRect(ctx, pillX, pillY, pillW, pillH, 13);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = "500 11px 'Inter', sans-serif";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('♫ Dooron Dooron', pillX + 14, pillY + pillH / 2);

    // 4 Animated EQ Bars
    for (let b = 0; b < 4; b++) {
      const bh = Math.sin(t * 7 + b * 1.5) * 6 + 9;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(pillX + pillW - 32 + b * 6, pillY + pillH / 2 + 6 - bh, 3.5, bh);
    }
    ctx.restore();

    // 3. Action Icons Bar
    const actionY = mediaY + mediaH + 24;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Heart Icon (Filled Crimson with pulse)
    const heartScale = 1.0 + beatPulse * 0.14;
    const heartX = -cardW / 2 + 36;
    ctx.save();
    ctx.translate(heartX, actionY);
    ctx.scale(heartScale, heartScale);
    ctx.fillStyle = '#f43f5e';
    ctx.shadowBlur = 12 + beatPulse * 15;
    ctx.shadowColor = 'rgba(244, 63, 94, 0.8)';
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-7, -4, -13, 0, -13, 6);
    ctx.bezierCurveTo(-13, 12, -3, 17, 0, 21);
    ctx.bezierCurveTo(3, 17, 13, 12, 13, 6);
    ctx.bezierCurveTo(13, 0, 7, -4, 0, 4);
    ctx.fill();
    ctx.restore();

    // Comment Bubble Icon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.shadowBlur = 0;
    const commentX = heartX + 38;
    ctx.beginPath();
    ctx.arc(commentX, actionY + 6, 9, 0, Math.PI * 2);
    ctx.stroke();

    // Share Paper Plane Icon
    const shareX = commentX + 38;
    ctx.beginPath();
    ctx.moveTo(shareX - 8, actionY + 14);
    ctx.lineTo(shareX + 10, actionY + 3);
    ctx.lineTo(shareX - 1, actionY + 16);
    ctx.closePath();
    ctx.stroke();

    // Bookmark Icon on far right
    const bookmarkX = cardW / 2 - 36;
    ctx.beginPath();
    ctx.rect(bookmarkX - 12, actionY - 2, 14, 17);
    ctx.stroke();

    // 4. Social Counts & Narrative Caption
    const captionX = -cardW / 2 + 30;
    const likesY = actionY + 34;

    ctx.fillStyle = '#ffffff';
    ctx.font = "700 13px 'Inter', sans-serif";
    ctx.fillText('248,392 likes', captionX, likesY);

    // Caption Row
    const textY = likesY + 22;
    ctx.font = "700 13px 'Inter', sans-serif";
    ctx.fillText('pareshpahuja', captionX, textY);
    ctx.font = "400 13px 'Inter', sans-serif";
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(' Dooron dooron main vekhan tainu soneyo... ✨', captionX + 88, textY);

    // Hashtags
    const hashY = textY + 20;
    ctx.font = "500 12px 'Inter', sans-serif";
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('#DooronDooron  #PareshPahuja  #HarleenSethi  #NightGlow', captionX, hashY);

    // Timestamp
    const timeY = hashY + 18;
    ctx.font = "500 10px 'Inter', sans-serif";
    ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
    ctx.fillText('2 HOURS AGO · VIEW ALL 1,842 COMMENTS', captionX, timeY);

    ctx.restore();
  }

  // --- Opening: 3D Camera Dive through Card into Song Title (12.0s to 16.36s) ---
  function renderInstagramDiveAndTitle(t, beatPulse) {
    const p = Math.min(1.0, Math.max(0, (t - 12.0) / 4.36));

    // 1. Diving Card
    ctx.save();
    const cardScale = 1.0 + Math.pow(p, 3.2) * 8.5;
    const cardAlpha = Math.max(0, 1.0 - Math.pow(p, 1.6) * 1.5);

    if (cardAlpha > 0.01) {
      ctx.translate(W / 2, H / 2 - 15);
      ctx.scale(cardScale, cardScale);
      ctx.globalAlpha = cardAlpha;

      const cardW = 520;
      const cardH = 650;
      ctx.fillStyle = 'rgba(10, 20, 44, 0.9)';
      ctx.strokeStyle = 'rgba(130, 185, 255, 0.4)';
      ctx.lineWidth = 1.6;
      roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 22);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // 2. Radial Speed Lines during Dive
    ctx.save();
    const numLines = 26;
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2 + p * 0.4;
      const r1 = (70 + (i % 4) * 25) * (1 + p * 2.5);
      const r2 = (280 + (i % 3) * 60) * (1 + p * 4.2);
      const lineAlpha = Math.sin(p * Math.PI) * (0.35 + (i % 2) * 0.35);
      ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(W / 2 + Math.cos(angle) * r1, H / 2 + Math.sin(angle) * r1);
      ctx.lineTo(W / 2 + Math.cos(angle) * r2, H / 2 + Math.sin(angle) * r2);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Song Title Landing Reveal (Emerges at p >= 0.22)
    if (p >= 0.22) {
      const titleProgress = Math.min(1.0, (p - 0.22) / 0.45);
      const titleAlpha = titleProgress;
      const titleScale = 0.88 + titleProgress * 0.12;

      ctx.save();
      ctx.translate(W / 2, H / 2 - 12);
      ctx.scale(titleScale, titleScale);
      ctx.globalAlpha = titleAlpha;

      // Dark Backing Shadow for extreme contrast over any clip
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(2, 6, 23, 0.95)';

      // Small tracked caps context label (Inter 300)
      ctx.font = "300 15px 'Inter', sans-serif";
      ctx.letterSpacing = '0.50em';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(186, 230, 253, 0.92)';
      ctx.fillText('AANSH.AI · NIGHT GLOW', 0, -68);

      // ONE HUGE Instrument Serif Italic Title
      ctx.font = "italic 400 110px 'Instrument Serif', Georgia, serif";
      ctx.letterSpacing = '0.02em';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 45 + beatPulse * 28;
      ctx.shadowColor = 'rgba(147, 197, 253, 0.95)';
      ctx.fillText('Dooron Dooron', 0, 10);

      // Artists below in small tracked caps (Inter 300)
      ctx.font = "300 17px 'Inter', sans-serif";
      ctx.letterSpacing = '0.45em';
      ctx.fillStyle = 'rgba(224, 242, 254, 0.88)';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.fillText('PARESH PAHUJA ft. HARLEEN SETHI', 0, 78);

      ctx.restore();
    }
  }

  // --- Look 2: Artist Stipple Particle Portrait (3,500 dots that breathe on beat) ---
  function renderArtistParticlePortrait(time, energy, beatPulse) {
    if (!portraitParticles || portraitParticles.length === 0) return;
    ctx.save();

    const pCenterX = W * 0.28;
    const pCenterY = H * 0.48;
    const breathe = 1.0 + beatPulse * 0.08;

    ctx.translate(pCenterX, pCenterY);
    ctx.rotate(pointerX * 0.03);

    // Soft Ambient Cyan/Emerald Backlit Aura behind Portrait
    const auraGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, 260);
    auraGrad.addColorStop(0, `rgba(16, 185, 129, ${0.16 + beatPulse * 0.12})`);
    auraGrad.addColorStop(0.5, `rgba(56, 189, 248, ${0.12 + energy * 0.08})`);
    auraGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 260, 0, Math.PI * 2);
    ctx.fill();

    // Draw 3,500 Breathing Stipple Dots
    const dotCount = portraitParticles.length;
    for (let i = 0; i < dotCount; i++) {
      const pt = portraitParticles[i];
      const px = pt[0] * breathe;
      const py = pt[1] * breathe;

      const driftX = Math.sin(time * 0.0015 + i * 0.3) * 1.5;
      const driftY = Math.cos(time * 0.0015 + i * 0.3) * 1.5;

      const alpha = Math.min(1.0, (pt[2] * 0.8 + 0.2) * (1 + beatPulse * 0.25));
      ctx.fillStyle = `rgba(225, 245, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px + driftX, py + driftY, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rising Stardust Embers from the portrait
    if (Math.random() > 0.40) {
      wordSparks.push({
        x: pCenterX + (Math.random() - 0.5) * 200,
        y: pCenterY + 180,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 2.2 + 1.2),
        life: 1.0,
        r: Math.random() * 2.8 + 1.2
      });
    }

    ctx.restore();
  }

  // --- Scene B: Lone Observer Silhouette on Shore (16.36s to 43.8s) ---
  function renderObserverSilhouette(t, beatPulse) {
    ctx.save();
    const obsX = W * 0.14;
    const obsY = H * 0.70;

    // Rock Bluff
    ctx.fillStyle = '#020611';
    ctx.beginPath();
    ctx.moveTo(obsX - 100, obsY + 80);
    ctx.quadraticCurveTo(obsX - 20, obsY - 10, obsX + 60, obsY);
    ctx.quadraticCurveTo(obsX + 110, obsY + 30, obsX + 130, obsY + 80);
    ctx.closePath();
    ctx.fill();

    // Standing Silhouette
    ctx.fillStyle = '#02050f';
    ctx.beginPath();
    ctx.arc(obsX + 20, obsY - 55, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(obsX + 14, obsY - 43);
    ctx.lineTo(obsX + 26, obsY - 43);
    ctx.lineTo(obsX + 32, obsY);
    ctx.lineTo(obsX + 10, obsY);
    ctx.closePath();
    ctx.fill();

    // Soft Moonlight Rim Highlight on Observer
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.35 + beatPulse * 0.2})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(obsX + 20, obsY - 55, 12, -Math.PI * 0.5, Math.PI * 0.2);
    ctx.stroke();

    ctx.restore();
  }

  // --- Scene C: Harbor Twinkles & Rising Lanterns (43.8s to 71.5s) ---
  function renderHarborLightsAndLanterns(time, t, beatPulse) {
    ctx.save();
    const harborY = H * 0.69;

    // Distant City Lights on Shore
    for (let i = 0; i < 28; i++) {
      const hx = W * 0.35 + i * 36;
      const alpha = Math.sin(time * 0.003 + i) * 0.3 + 0.6;
      ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(hx, harborY - 4 + (i % 3) * 2, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Upward Floating Lanterns
    for (let l = 0; l < 6; l++) {
      const lx = W * 0.40 + l * 85 + Math.sin(time * 0.001 + l) * 25;
      const ly = harborY - ((t * 14 + l * 65) % (H * 0.45));
      const lAlpha = Math.min(0.85, Math.max(0.2, 1.0 - (harborY - ly) / (H * 0.45)));

      ctx.fillStyle = `rgba(251, 191, 36, ${lAlpha})`;
      ctx.shadowBlur = 16;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.9)';
      ctx.beginPath();
      ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- Look 3: Gold Motion Graphics Bench Scene: Mitti Da Banda / Tu Ta Pari (86.5s to 150s) ---
  function renderMittiPariScene(t, beatPulse, time) {
    ctx.save();
    const benchY = H * 0.70;

    // Glowing Weeping Willow / Blossom Tree on Left Shore
    const treeX = W * 0.16;
    ctx.fillStyle = '#02050f';
    ctx.beginPath();
    ctx.moveTo(treeX - 18, benchY + 40);
    ctx.quadraticCurveTo(treeX, benchY - 80, treeX + 35, benchY - 180);
    ctx.quadraticCurveTo(treeX + 45, benchY - 80, treeX + 18, benchY + 40);
    ctx.closePath();
    ctx.fill();

    // Floating Glowing Blossom Petals
    blossomPetals.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      if (p.y > benchY + 50) { p.y = benchY - 200; p.x = treeX + Math.random() * 260; }
      if (p.x > W) { p.x = 0; }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = `rgba(255, 215, 235, ${p.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 175, 215, 0.8)';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Classic Park Bench
    const bMidX = W * 0.50;
    ctx.fillStyle = '#020612';
    // Backrest
    ctx.fillRect(bMidX - 110, benchY - 42, 220, 8);
    ctx.fillRect(bMidX - 110, benchY - 30, 220, 8);
    // Seat
    ctx.fillRect(bMidX - 115, benchY - 18, 230, 10);
    // Legs
    ctx.fillRect(bMidX - 95, benchY - 18, 8, 28);
    ctx.fillRect(bMidX + 87, benchY - 18, 8, 28);

    // Left Figure: Woman ("Tu Ta Pari" — Luminous Angelic White & Gold)
    const womanX = bMidX - 45;
    const womanY = benchY - 18;

    ctx.save();
    ctx.shadowBlur = 45 + beatPulse * 28;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.98)';
    ctx.fillStyle = '#ffffff';
    // Halo & Head
    ctx.beginPath();
    ctx.arc(womanX, womanY - 58, 15, 0, Math.PI * 2);
    ctx.fill();
    // Torso / Gown
    ctx.beginPath();
    ctx.moveTo(womanX - 16, womanY);
    ctx.quadraticCurveTo(womanX - 10, womanY - 44, womanX, womanY - 44);
    ctx.quadraticCurveTo(womanX + 10, womanY - 44, womanX + 16, womanY);
    ctx.closePath();
    ctx.fill();

    // Rising Stardust Halo from Pari
    if (Math.random() > 0.45) {
      wordSparks.push({
        x: womanX + (Math.random() - 0.5) * 40,
        y: womanY - 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 2.5 + 1.2),
        life: 1.0,
        r: Math.random() * 2.8 + 1.2
      });
    }
    ctx.restore();

    // Right Figure: Man ("Mitti Da Banda" — Grounded Midnight Shadow with Violet Contours)
    const manX = bMidX + 45;
    const manY = benchY - 18;

    ctx.save();
    ctx.fillStyle = '#030816';
    // Head
    ctx.beginPath();
    ctx.arc(manX, manY - 60, 16, 0, Math.PI * 2);
    ctx.fill();
    // Torso
    ctx.beginPath();
    ctx.moveTo(manX - 18, manY);
    ctx.quadraticCurveTo(manX - 12, manY - 46, manX, manY - 46);
    ctx.quadraticCurveTo(manX + 12, manY - 46, manX + 18, manY);
    ctx.closePath();
    ctx.fill();

    // Violet / Indigo Digital Contour Rim
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.85)';
    ctx.lineWidth = 2.2;
    ctx.shadowBlur = 18;
    ctx.shadowColor = 'rgba(139, 92, 246, 0.9)';
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // --- Look 4: Rain on Glass Ending (150s to 189.43s) ---
  function renderRainOnGlass(time, t) {
    ctx.save();

    // 1. Frosted Glass Tint
    ctx.fillStyle = 'rgba(2, 6, 18, 0.40)';
    ctx.fillRect(0, 0, W, H);

    // 2. Water Droplets with Refraction and Streak Trails
    raindrops.forEach(drop => {
      if (drop.isStreak) {
        drop.y += drop.vy;
        if (drop.y > H + 50) {
          drop.y = -30;
          drop.x = Math.random() * W;
        }

        ctx.strokeStyle = `rgba(180, 225, 255, ${drop.alpha * 0.45})`;
        ctx.lineWidth = drop.r * 0.7;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y - drop.streakLen);
        ctx.lineTo(drop.x, drop.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(235, 250, 255, ${drop.alpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(200, 235, 255, ${drop.alpha * 0.65})`;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(drop.x - drop.r * 0.3, drop.y - drop.r * 0.3, drop.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 3. Cinematic Vignette
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, W * 0.65);
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(2, 4, 12, 0.65)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    ctx.restore();
  }

  // --- Outro Particle Dissolve (172s to 189.43s) ---
  function renderOutroDissolve(t) {
    if (!outroInitialized) {
      outroInitialized = true;
      for (let i = 0; i < 180; i++) {
        outroParticles.push({
          x: W * 0.50 + (Math.random() - 0.5) * 800,
          y: H * 0.45 + (Math.random() - 0.5) * 160,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -(Math.random() * 2.2 + 0.8),
          r: Math.random() * 3.2 + 1.0,
          alpha: 1.0,
          color: Math.random() > 0.5 ? '56, 189, 248' : '255, 255, 255'
        });
      }
    }

    ctx.save();
    outroParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = Math.max(0, p.alpha - 0.0035);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // ============================================================
  // NIGHT-GLOW KINETIC TYPOGRAPHY ENGINE (NO COLLAPSING · HIERARCHY SPEC)
  // - Key Lines: Editorial Hierarchy Block in negative space (Inter 300 tracked caps + ONE HUGE Instrument Serif italic keyword + medium phrase row)
  // - In-Between Lines: Understated centered line at bottom (H * 0.82)
  // - Meaning Moments:
  //   * Mitti da banda main, tu ta pari: Split into grey dusty words & radiant glowing gold/white pari with rising sparkles
  //   * Dooron dooron: Horizontal letter expansion drift
  //   * Kahaan main: Dissolve into light starlight motes
  // ============================================================

  const KEY_LINE_CONFIG = {
    0: { keyword: 'DOORON', side: 'right', tag: 'CHORUS · PARESH PAHUJA', hasDrift: true },
    2: { keyword: 'SONEYO', side: 'left', tag: 'CHORUS · HARLEEN SETHI', hasDrift: true },
    4: { keyword: 'NAZAR', side: 'right', tag: 'VERSE I · THE QUESTION' },
    8: { keyword: 'DOORON', side: 'right', tag: 'CHORUS · INTENSITY', hasDrift: true },
    10: { keyword: 'SOCHUN', side: 'left', tag: 'VERSE II · CONTEMPLATION' },
    11: { keyword: 'SHAYARI', side: 'right', tag: 'POETRY IN SPEECH · SHAYARI' },
    13: { isMittiPari: true, tag: 'CONTRAST · DUST & LIGHT' },
    18: { keyword: 'DOORON', side: 'right', tag: 'FINAL CHORUS · CLIMAX', hasDrift: true },
    20: { keyword: 'DOORON', side: 'left', tag: 'OUTRO CHORUS · ECHO', hasDrift: true },
    21: { isOutroDissolve: true, tag: 'OUTRO · DISSOLVE INTO LIGHT' }
  };

  function renderNightGlowTypography(t, beatPulse, energy) {
    if (!alignmentData || !alignmentData.lines) return;

    let activeLine = null;
    let activeIdx = -1;
    for (let i = 0; i < alignmentData.lines.length; i++) {
      const l = alignmentData.lines[i];
      if (t >= l.start - 0.35 && t <= l.end + 0.85) {
        activeLine = l;
        activeIdx = i;
        break;
      }
    }

    // Sync modal list active state
    if (activeIdx !== currentActiveLineIdx) {
      currentActiveLineIdx = activeIdx;
      if (activeIdx !== -1) {
        document.querySelectorAll('.lyric-item').forEach((el, idx) => {
          if (idx === activeIdx) el.classList.add('active');
          else el.classList.remove('active');
        });
      }
    }

    if (!activeLine) return;

    ctx.save();

    // Lemo-Opuscar Physics Spring Settle & Smoothstep Transitions
    let lineAlpha = 1.0;
    let floatY = 0;
    let springScale = 1.0;

    if (t < activeLine.start) {
      const enterP = seg(t, activeLine.start - 0.40, activeLine.start + 0.15);
      const spr = spring(enterP * 2.2, 7.5, 0.40);
      lineAlpha = ss(seg(t, activeLine.start - 0.40, activeLine.start));
      floatY = (1 - spr) * 26;
      springScale = 0.92 + spr * 0.08;
    } else if (t > activeLine.end) {
      const exitP = seg(t, activeLine.end, activeLine.end + 0.75);
      lineAlpha = 1.0 - eo(exitP);
      floatY = -eo(exitP) * 16;
      springScale = 1.0 - eo(exitP) * 0.06;
    }
    ctx.globalAlpha = lineAlpha;

    const config = KEY_LINE_CONFIG[activeIdx];
    const isGoldLook = (t >= 86.5 && t <= 150.0);
    const words = activeLine.words || [];

    if (config && config.isMittiPari) {
      // -------------------------------------------------------------
      // SIGNATURE MOMENT 1: MITTI DA BANDA MAIN, TU TA PARI SPLIT
      // -------------------------------------------------------------
      const centerX = W * 0.50;
      const centerY = H * 0.44 + floatY;

      // Row 1: Inter 300 tracked caps
      ctx.save();
      ctx.font = "300 16px 'Inter', sans-serif";
      ctx.letterSpacing = '0.42em';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(186, 230, 253, 0.90)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.45)';
      ctx.fillText('CONTRAST · DUST & LIGHT', centerX, centerY - 65);
      ctx.restore();

      // Row 2 Left: "Mitti da banda main," (Ash-Grey Dusty text)
      ctx.save();
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = "400 46px 'Plus Jakarta Sans', 'Inter', sans-serif";
      ctx.fillStyle = '#8b93a1';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(2, 6, 23, 0.95)';
      ctx.fillText('Mitti da banda main,', centerX - 24, centerY + 8);

      // Downward drifting dust particles
      if (Math.random() > 0.45) {
        dustParticles.push({
          x: centerX - 200 + (Math.random() - 0.5) * 280,
          y: centerY + (Math.random() - 0.5) * 25,
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 1.6 + 0.6,
          life: 1.0,
          r: Math.random() * 2.2 + 0.8
        });
      }
      ctx.restore();

      // Row 2 Right: "tu ta " and ONE HUGE "Pari" (Radiant Gold / White with sparkles)
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = "400 44px 'Plus Jakarta Sans', 'Inter', sans-serif";
      ctx.fillStyle = '#ffffff';
      ctx.fillText('tu ta ', centerX + 24, centerY + 8);

      // HUGE PARI KEYWORD
      ctx.font = "italic 400 104px 'Instrument Serif', Georgia, serif";
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 48 + beatPulse * 24;
      ctx.shadowColor = 'rgba(254, 240, 138, 0.95)'; // Golden bloom
      ctx.fillText('Pari', centerX + 130, centerY + 8);

      // Upward rising gold starlight sparkles around Pari
      if (Math.random() > 0.35) {
        wordSparks.push({
          x: centerX + 160 + (Math.random() - 0.5) * 120,
          y: centerY + (Math.random() - 0.5) * 45,
          vx: (Math.random() - 0.5) * 2.4,
          vy: -(Math.random() * 3.2 + 1.2),
          life: 1.0,
          r: Math.random() * 3.5 + 1.5,
          color: '254, 240, 138'
        });
      }
      ctx.restore();

    } else if (config && config.isOutroDissolve) {
      // -------------------------------------------------------------
      // SIGNATURE MOMENT 2: OUTRO DISSOLVE INTO LIGHT
      // -------------------------------------------------------------
      const centerX = W * 0.50;
      const centerY = H * 0.48 + floatY;

      // When t >= 169.5s, spawn light particles dissolving the text
      if (t >= 169.5 && !outroInitialized) {
        outroInitialized = true;
        for (let i = 0; i < 280; i++) {
          outroParticles.push({
            x: centerX + (Math.random() - 0.5) * 450,
            y: centerY + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 2.2,
            vy: -(Math.random() * 2.8 + 1.0),
            r: Math.random() * 3.6 + 1.2,
            alpha: 1.0,
            decay: Math.random() * 0.008 + 0.004
          });
        }
      }

      const dissolveProgress = Math.min(1.0, Math.max(0, (t - 169.5) / 3.0));
      const textAlpha = Math.max(0, 1.0 - dissolveProgress);

      if (textAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = lineAlpha * textAlpha;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Context tag
        ctx.font = "300 15px 'Inter', sans-serif";
        ctx.letterSpacing = '0.45em';
        ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
        ctx.fillText('OUTRO · KALAAM', centerX, centerY - 60);

        // Huge Serif line
        ctx.font = "italic 400 86px 'Instrument Serif', Georgia, serif";
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 40 + beatPulse * 25;
        ctx.shadowColor = 'rgba(147, 197, 253, 0.95)';
        ctx.fillText('Kahaan tu, kahaan main', centerX, centerY + 8);
        ctx.restore();
      }

    } else if (config) {
      // -------------------------------------------------------------
      // KEY LINE: EDITORIAL HIERARCHY BLOCK IN NEGATIVE SPACE
      // Row 1: Inter 300 tracked caps
      // Row 2: ONE HUGE Instrument Serif italic keyword (with letter drift if dooron)
      // Row 3: Medium row with sung word-level synchronization
      // -------------------------------------------------------------
      const anchorX = config.side === 'right' ? W * 0.68 : W * 0.32;
      const centerY = H * 0.45 + floatY;

      // Row 1: Small tracked caps (Inter 300)
      ctx.save();
      ctx.font = "300 16px 'Inter', sans-serif";
      ctx.letterSpacing = '0.40em';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isGoldLook ? 'rgba(251, 191, 36, 0.95)' : 'rgba(186, 230, 253, 0.92)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = isGoldLook ? 'rgba(245, 158, 11, 0.5)' : 'rgba(56, 189, 248, 0.45)';
      ctx.fillText(config.tag || 'DOORON DOORON', anchorX, centerY - 72);
      ctx.restore();

      // Row 2: ONE HUGE Instrument Serif italic keyword (Lemo-Opuscar Multi-Level Splatting)
      ctx.save();
      let driftSpacing = 0;
      if (config.hasDrift) {
        const driftP = eo(seg(t, activeLine.start, activeLine.end));
        driftSpacing = driftP * 22;
      }
      ctx.translate(anchorX, centerY + 8);
      ctx.scale(springScale, springScale);
      ctx.font = "italic 400 104px 'Instrument Serif', Georgia, serif";
      ctx.letterSpacing = `${driftSpacing}px`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Level 1: Sub-layer Occlusion Contrast Shadow
      ctx.shadowBlur = 24;
      ctx.shadowColor = 'rgba(2, 6, 23, 0.96)';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(config.keyword, 0, 0);

      // Level 2: Outer Bokeh Halo Splat (Large & Faint)
      ctx.shadowBlur = 55 + beatPulse * 28;
      ctx.shadowColor = isGoldLook ? 'rgba(251, 191, 36, 0.50)' : 'rgba(147, 197, 253, 0.50)';
      ctx.fillText(config.keyword, 0, 0);

      // Level 3: Midtone Chromatic Bloom
      ctx.shadowBlur = 25 + beatPulse * 14;
      ctx.shadowColor = isGoldLook ? 'rgba(245, 158, 11, 0.92)' : 'rgba(56, 189, 248, 0.92)';
      ctx.fillText(config.keyword, 0, 0);

      // Level 4: Burnt Pure White Core
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(config.keyword, 0, 0);
      ctx.restore();

      // Row 3: Medium Row with active word sync
      ctx.save();
      ctx.font = "500 44px 'Plus Jakarta Sans', 'Inter', sans-serif";
      ctx.textBaseline = 'middle';
      const spaceWidth = 14;

      // Measure words in active line
      let totalRowWidth = 0;
      const measuredWords = words.map(w => {
        ctx.save();
        ctx.font = "500 44px 'Plus Jakarta Sans', 'Inter', sans-serif";
        const ww = ctx.measureText(w.word).width;
        ctx.restore();
        totalRowWidth += ww + spaceWidth;
        return { ...w, width: ww };
      });
      totalRowWidth -= spaceWidth;

      let curX = anchorX - totalRowWidth / 2;
      const rowY = centerY + 85;

      measuredWords.forEach(w => {
        const isWordActive = t >= w.start && t <= w.end;
        const isWordPast = t > w.end;

        ctx.save();
        ctx.font = "500 44px 'Plus Jakarta Sans', 'Inter', sans-serif";
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // Sub-layer dark contrast shadow
        ctx.shadowBlur = 16;
        ctx.shadowColor = 'rgba(2, 6, 23, 0.95)';

        if (isWordActive) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 35 + beatPulse * 20;
          ctx.shadowColor = isGoldLook ? 'rgba(251, 191, 36, 0.98)' : 'rgba(147, 197, 253, 0.98)';
          ctx.fillText(w.word, curX, rowY);

          // Word spark
          if (Math.random() > 0.40) {
            wordSparks.push({
              x: curX + w.width / 2 + (Math.random() - 0.5) * 30,
              y: rowY + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 2.5,
              vy: -(Math.random() * 2.8 + 1.2),
              life: 1.0,
              r: Math.random() * 3.2 + 1.2,
              color: isGoldLook ? '251, 191, 36' : '147, 197, 253'
            });
          }
        } else if (isWordPast) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(147, 197, 253, 0.4)';
          ctx.fillText(w.word, curX, rowY);
        } else {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.42)';
          ctx.shadowBlur = 0;
          ctx.fillText(w.word, curX, rowY);
        }
        ctx.restore();
        curX += w.width + spaceWidth;
      });
      ctx.restore();

    } else {
      // -------------------------------------------------------------
      // IN-BETWEEN LINE: UNDERSTATED CENTERED LINE AT BOTTOM (H * 0.82)
      // Never looks like movie captions: clean dark backing shadow, soft glowing highlights
      // -------------------------------------------------------------
      const anchorX = W * 0.50;
      const anchorY = H * 0.82 + floatY;
      const spaceWidth = 16;

      ctx.save();
      ctx.font = "500 42px 'Plus Jakarta Sans', 'Inter', sans-serif";
      ctx.textBaseline = 'middle';

      let totalLineWidth = 0;
      const measuredWords = words.map(w => {
        ctx.save();
        ctx.font = "500 42px 'Plus Jakarta Sans', 'Inter', sans-serif";
        const ww = ctx.measureText(w.word).width;
        ctx.restore();
        totalLineWidth += ww + spaceWidth;
        return { ...w, width: ww };
      });
      totalLineWidth -= spaceWidth;

      let curX = anchorX - totalLineWidth / 2;

      measuredWords.forEach(w => {
        const isWordActive = t >= w.start && t <= w.end;
        const isWordPast = t > w.end;

        ctx.save();
        ctx.font = "500 42px 'Plus Jakarta Sans', 'Inter', sans-serif";
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // Understated contrast shadow
        ctx.shadowBlur = 16;
        ctx.shadowColor = 'rgba(2, 6, 23, 0.95)';

        if (isWordActive) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 32 + beatPulse * 18;
          ctx.shadowColor = 'rgba(147, 197, 253, 0.95)';
          ctx.fillText(w.word, curX, anchorY);

          if (Math.random() > 0.45) {
            wordSparks.push({
              x: curX + w.width / 2,
              y: anchorY,
              vx: (Math.random() - 0.5) * 2.2,
              vy: -(Math.random() * 2.5 + 1.0),
              life: 1.0,
              r: Math.random() * 2.8 + 1.0,
              color: '147, 197, 253'
            });
          }
        } else if (isWordPast) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(147, 197, 253, 0.35)';
          ctx.fillText(w.word, curX, anchorY);
        } else {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.38)';
          ctx.shadowBlur = 0;
          ctx.fillText(w.word, curX, anchorY);
        }
        ctx.restore();
        curX += w.width + spaceWidth;
      });
      ctx.restore();
    }

    // Render Dust Particles
    for (let i = dustParticles.length - 1; i >= 0; i--) {
      const dp = dustParticles[i];
      dp.x += dp.vx;
      dp.y += dp.vy;
      dp.life -= 0.025;
      if (dp.life <= 0) {
        dustParticles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(139, 147, 161, ${dp.life * 0.8})`;
      ctx.beginPath();
      ctx.arc(dp.x, dp.y, dp.r * dp.life, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render Sparks
    for (let i = wordSparks.length - 1; i >= 0; i--) {
      const sp = wordSparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life -= 0.035;
      if (sp.life <= 0) {
        wordSparks.splice(i, 1);
        continue;
      }
      const col = sp.color || '147, 197, 253';
      ctx.fillStyle = `rgba(${col}, ${sp.life})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${col}, 0.9)`;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r * sp.life, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render Outro Dissolve Particles
    for (let i = outroParticles.length - 1; i >= 0; i--) {
      const op = outroParticles[i];
      op.x += op.vx;
      op.y += op.vy;
      op.alpha -= op.decay;
      if (op.alpha <= 0) {
        outroParticles.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${op.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(147, 197, 253, 0.9)';
      ctx.beginPath();
      ctx.arc(op.x, op.y, op.r * op.alpha, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Utility: Canvas Rounded Rectangle
  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  // Kick off render loop
  requestAnimationFrame(render);

})();
