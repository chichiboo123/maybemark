/* =========================================================
   MAYBEMARK · 인트로 '문 열기' 연출
   - 애니메이션: anime.js v3.2.2 (MIT, https://github.com/juliangarnier/anime) → js/vendor/
   - 빛가루: 캔버스로 직접 그림 (떠다니는 금빛 먼지 + 문이 열릴 때 쏟아지는 빛)
   흐름: 손잡이가 돌고 → 문이 3D로 열리며 빛이 새어 나오고 → 문 안으로 걸어 들어가듯 다가가며
         빛가루가 스쳐 지나가고 → 빛이 화면을 채운 뒤 걷히면서 첫 화면이 제자리를 찾음 (약 3초)
   ========================================================= */
(function () {
  'use strict';

  var intro = document.getElementById('intro');
  if (!intro) return;
  var $ = function (s) { return intro.querySelector(s); };
  var door = $('#introDoor'), stage = $('#introStage'), flash = $('#introFlash'), canvas = $('#introDust');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 빛가루 캔버스 ---------- */
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
  var dust = [], sparks = [], warp = 0, cx = 0, cy = 0, running = false;

  /* 부드러운 빛 점 하나를 미리 그려 두고 크기만 바꿔 찍음 (빠름) */
  var sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  (function () {
    var s = sprite.getContext('2d'), g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,253,236,1)');
    g.addColorStop(0.18, 'rgba(255,240,190,.9)');
    g.addColorStop(0.45, 'rgba(255,214,110,.35)');
    g.addColorStop(1, 'rgba(255,200,80,0)');
    s.fillStyle = g; s.fillRect(0, 0, 64, 64);
  })();

  function size() {
    if (!ctx) return;
    W = intro.clientWidth; H = intro.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    findDoor();
  }
  function findDoor() {
    var r = door.getBoundingClientRect(), ir = intro.getBoundingClientRect();
    cx = r.left - ir.left + r.width / 2; cy = r.top - ir.top + r.height * 0.58;
  }
  function mote(anywhere) {
    return {
      x: Math.random() * W, y: anywhere ? Math.random() * H : H + 12,
      r: 0.8 + Math.random() * 2.2, vx: (Math.random() - 0.5) * 0.15, vy: -(0.1 + Math.random() * 0.3),
      ph: Math.random() * 6.283, sp: 0.012 + Math.random() * 0.03
    };
  }
  function burst(n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.283, sp = 1.2 + Math.random() * 4.2;
      sparks.push({
        x: cx + (Math.random() - 0.5) * 70, y: cy + (Math.random() - 0.5) * 140,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.2, r: 0.8 + Math.random() * 2.6,
        life: 1, decay: 0.006 + Math.random() * 0.012
      });
    }
  }
  function dot(x, y, r, a) {
    if (a <= 0) return;
    var s = r * 6;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sprite, x - s / 2, y - s / 2, s, s);
  }
  function frame() {
    if (!running || intro.hidden) { running = false; return; }
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    var k = warp * warp * 0.09;   /* 문 안으로 들어설수록 빛가루가 바깥으로 스쳐 지나감 */
    for (var i = 0; i < dust.length; i++) {
      var p = dust[i];
      p.ph += p.sp;
      p.x += p.vx + (p.x - cx) * k; p.y += p.vy + (p.y - cy) * k;
      if (p.y < -20 || p.x < -40 || p.x > W + 40 || p.y > H + 40) dust[i] = mote(false);
      dot(p.x, p.y, p.r * (1 + warp * 2), 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(p.ph)));
    }
    for (var j = sparks.length - 1; j >= 0; j--) {
      var q = sparks[j];
      q.vx *= 0.985; q.vy = q.vy * 0.985 - 0.012;
      q.x += q.vx + (q.x - cx) * k; q.y += q.vy + (q.y - cy) * k;
      q.life -= q.decay;
      if (q.life <= 0) { sparks.splice(j, 1); continue; }
      dot(q.x, q.y, q.r * (1 + warp * 2.5), q.life);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  function start() {
    if (!ctx || running || reduce) return;
    size();
    dust = [];
    for (var i = 0, n = W < 600 ? 36 : 64; i < n; i++) dust.push(mote(true));
    running = true;
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', function () { if (running) size(); });
  /* main.js가 인트로를 숨기지 않았을 때만(=처음 방문) 먼지를 띄움 */
  setTimeout(function () { if (!intro.hidden) start(); }, 0);

  /* ---------- 문 열기 연출 ---------- */
  function open(opts) {
    opts = opts || {};
    var A = window.anime;
    if (!A || reduce) return false;   /* 라이브러리가 없으면 main.js의 간단한 대체 동작으로 */
    start(); findDoor();
    intro.classList.add('is-playing');

    /* 다가갈 기준점 = 문 안쪽 빛의 가운데 */
    var dr = door.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    stage.style.transformOrigin = (dr.left - sr.left + dr.width / 2) + 'px ' + (dr.top - sr.top + dr.height * 0.58) + 'px';
    flash.style.setProperty('--fx', cx + 'px'); flash.style.setProperty('--fy', cy + 'px');

    var tl = A.timeline({ complete: function () { if (opts.done) opts.done(); } });
    tl
      /* 글자·버튼은 조용히 물러남 */
      .add({ targets: intro.querySelectorAll('.intro-kicker, .intro-quote, #introOpen, .ding-toast, .intro-skip, .intro-lang, .intro-sound'),
        opacity: 0, translateY: 8, duration: 480, easing: 'easeOutQuad', delay: A.stagger(35) }, 0)
      .add({ targets: intro.querySelector('.idoor-frame'), translateY: [0, -2], duration: 160, easing: 'easeOutQuad' }, 0)
      /* 손잡이가 돌고 */
      .add({ targets: intro.querySelector('.idoor-knob'), rotate: [0, -70], duration: 300, easing: 'easeInOutSine' }, 60)
      /* 문이 3D로 활짝: 처음엔 무겁게, 끝은 부드럽게 */
      .add({ targets: intro.querySelector('.idoor-leaf'), rotateY: [0, -118], duration: 1500, easing: 'cubicBezier(.55, 0, .12, 1)',
        begin: function () { burst(window.innerWidth < 600 ? 60 : 110); if (opts.onOpen) opts.onOpen(); } }, 260)
      /* 문 안의 빛이 커지고 빛줄기가 번짐 */
      .add({ targets: intro.querySelector('.idoor-rays'), opacity: [0.25, 1], scale: [1, 1.5], duration: 1500, easing: 'easeOutCubic' }, 380)
      .add({ targets: intro.querySelector('.idoor-core'), opacity: [0.7, 1], scale: [1, 2.6], duration: 1500, easing: 'easeOutCubic' }, 380)
      .add({ targets: intro.querySelector('.idoor-glow'), opacity: [0.8, 1], scale: [1, 1.7], duration: 1400, easing: 'easeOutCubic',
        begin: function () { burst(window.innerWidth < 600 ? 30 : 60); } }, 700)
      /* 문 안으로 걸어 들어가듯 다가감 */
      /* 세로로 긴 화면(휴대폰)은 문 안이 화면을 다 채우도록 더 깊이 들어감 */
      .add({ targets: stage, scale: [1, window.innerHeight > window.innerWidth ? 16 : 10], duration: 1150, easing: 'easeInCubic',
        update: function (a) { warp = a.progress / 100; } }, 1350)
      /* 빛이 화면을 채움 */
      .add({ targets: flash, opacity: [0, 1], duration: 760, easing: 'easeInQuad' }, 1620)
      /* 빛이 걷히며 첫 화면 */
      .add({ targets: intro, opacity: [1, 0], duration: 850, easing: 'easeOutQuad',
        begin: function () { if (opts.arrive) opts.arrive(); } }, 2520);
    return true;
  }

  window.MM_INTRO = { open: open };
})();
