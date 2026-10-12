/* =========================================================
   MAYBEMARK · 모름표 탐험대 — 동작
   ========================================================= */
(function () {
  'use strict';

  var D = window.MM_DATA;
  var C = window.MM_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* 글자 번역 (js/i18n.js). 없으면 키를 그대로 */
  var T = window.MM_T || function (k) { return k; };

  /* ---------- 브라우저 저장(없어도 동작) ---------- */
  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };
  function esc(t) { var d = document.createElement('div'); d.textContent = t == null ? '' : String(t); return d.innerHTML; }
  /* '아기 질문 외' 처럼 역할 뒤에 붙는 말 */
  function roleName(c) { return c.role + (c.extra ? ' ' + c.extra : ''); }

  /* =========================================================
     소리: '딩동' 안내음 (파일 없이 Web Audio로 만듦)
     ========================================================= */
  var soundOn = store.get('mm_sound') === '1';
  var actx = null;
  function ding() {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var now = actx.currentTime;
      [[1318.5, 0], [1046.5, 0.32]].forEach(function (n) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, now + n[1]);
        g.gain.exponentialRampToValueAtTime(0.25, now + n[1] + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + n[1] + 0.9);
        o.connect(g); g.connect(actx.destination);
        o.start(now + n[1]); o.stop(now + n[1] + 1);
      });
    } catch (e) {}
  }
  function paintSound() {
    $$('[data-sound-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      b.setAttribute('aria-label', T(soundOn ? 'sound.off' : 'sound.on'));
      $('.material-icons-outlined', b).textContent = soundOn ? 'volume_up' : 'volume_off';
      var l = $('.sound-label', b); if (l) l.textContent = T(soundOn ? 'sound.off' : 'sound.on');
    });
  }
  $$('[data-sound-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      soundOn = !soundOn; store.set('mm_sound', soundOn ? '1' : '0'); paintSound();
      if (soundOn) ding();
    });
  });
  paintSound();

  /* =========================================================
     0. 인트로
     ========================================================= */
  var intro = $('#intro'), introBusy = false;
  /* 문이 열릴 때 '스으' 하고 공기가 지나가는 소리 (소리를 켰을 때만) */
  function whoosh() {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var now = actx.currentTime, len = actx.sampleRate * 1.6, buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      var src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
      src.buffer = buf; f.type = 'bandpass'; f.Q.value = 0.9;
      f.frequency.setValueAtTime(300, now); f.frequency.exponentialRampToValueAtTime(2400, now + 1.3);
      g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.16, now + 0.5); g.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      src.connect(f); f.connect(g); g.connect(actx.destination); src.start(now); src.stop(now + 1.6);
    } catch (e) {}
  }
  function closeIntro(animated) {
    if (introBusy) return; introBusy = true;
    store.set('mm_intro', '1', true);
    if (!animated || reduceMotion) { finish(false); return; }
    ding();
    /* 고급 연출(js/intro.js + anime.js). 없으면 간단한 대체 동작 */
    var played = window.MM_INTRO && window.MM_INTRO.open({
      onOpen: whoosh,
      arrive: function () {
        document.body.classList.add('is-arrive');
        document.body.classList.remove('is-intro');
        setTimeout(function () { document.body.classList.remove('is-arrive'); }, 1600);
      },
      done: function () { finish(true); }
    });
    if (!played) { intro.classList.add('is-opening'); setTimeout(function () { finish(false); }, 1800); }
    function finish(faded) {
      document.body.classList.remove('is-intro');
      if (faded) intro.hidden = true;
      else { intro.classList.add('is-gone'); setTimeout(function () { intro.hidden = true; }, 900); }
      onScroll();
    }
  }
  if (store.get('mm_intro', true) === '1' || location.hash) {
    intro.hidden = true; document.body.classList.remove('is-intro');
  } else {
    $('#introDoor').addEventListener('click', function () { closeIntro(true); });
    $('#introOpen').addEventListener('click', function () { closeIntro(true); });
    $('#introSkip').addEventListener('click', function () { closeIntro(false); });
  }

  /* =========================================================
     상단 메뉴 · 진행줄
     ========================================================= */
  var topbar = $('#topbar'), nav = $('#nav'), menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    $('.material-icons-outlined', menuBtn).textContent = open ? 'close' : 'menu';
  });
  $$('a', nav).forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); $('.material-icons-outlined', menuBtn).textContent = 'menu'; });
  });

  var progressQ = $('#progressQ'), progressPath = $('.progress-path');
  var lightIds = { prologue: 1, world: 1, cast: 1, numbers: 1, stop: 1, stages: 1 };
  /* 메뉴에 없는 구역은 가장 가까운 메뉴로 묶음 */
  var navOf = { world: 'world', story: 'world', cast: 'cast', numbers: 'numbers', stop: 'numbers', stages: 'stages', ask: 'ask', epilogue: 'review' };
  var navLinks = $$('a', nav), curNav = null;
  function paintNav(id) {
    var key = navOf[id] || null;
    if (key === curNav) return; curNav = key;
    navLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + key;
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  var ticking = false, lastY = window.scrollY, scrollDir = 1;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      if (y !== lastY) { scrollDir = y > lastY ? 1 : -1; lastY = y; }
      paintDepth(y);
      topbar.classList.toggle('is-solid', y > 40);
      progressQ.style.top = (max > 0 ? Math.min(1, y / max) * 100 : 0) + '%';
      var el = document.elementFromPoint(window.innerWidth - 30, window.innerHeight / 2);
      var sec = el && el.closest ? el.closest('section') : null;
      progressPath.classList.toggle('on-light', !!(sec && lightIds[sec.id]));
      paintNav(sec ? sec.id : null);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* =========================================================
     패럴랙스: 장식이 글보다 조금 느리게 움직여 깊이감을 줌
     (각 구역에 --p: 화면 가운데 기준 -1 ~ 1, 히어로에 --out: 0 ~ 1)
     ========================================================= */
  var hero = $('#hero'), depthSecs = $$('[data-depth]');
  function paintDepth(y) {
    if (reduceMotion) return;
    var vh = window.innerHeight;
    hero.style.setProperty('--out', Math.min(1, Math.max(0, y / vh)).toFixed(3));
    depthSecs.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      s.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3));
    });
  }

  /* =========================================================
     부드러운 자석: 스크롤을 멈춘 곳 바로 앞(가던 방향)에 페이지
     경계가 있을 때만 살며시 맞춰 줌. 뒤로 끌어당기지 않고,
     멀면 그대로 두고, 손대는 순간 바로 멈춤.
     ========================================================= */
  var pages = $$('.hero, .sec, .epilogue'), rootEl = document.documentElement;
  var gliding = false, glideRaf = 0, settleTimer = null;
  function cancelGlide() {
    if (!gliding) return;
    cancelAnimationFrame(glideRaf); gliding = false; rootEl.style.scrollBehavior = '';
  }
  function glideTo(target) {
    var from = window.scrollY, dist = target - from, t0 = performance.now();
    var dur = Math.min(700, 360 + Math.abs(dist) * 1.4);
    gliding = true; rootEl.style.scrollBehavior = 'auto';
    glideRaf = requestAnimationFrame(function step(now) {
      if (!gliding) return;
      var t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, from + dist * e);
      if (t < 1) glideRaf = requestAnimationFrame(step); else { gliding = false; rootEl.style.scrollBehavior = ''; }
    });
  }
  function settle() {
    if (reduceMotion || gliding || document.body.classList.contains('is-intro') || document.body.classList.contains('is-dark') || $('dialog[open]')) return;
    var y = window.scrollY, vh = window.innerHeight, reach = Math.min(vh * 0.16, 150), best = null, aligned = false;
    pages.forEach(function (s) {
      var top = s.offsetTop, tall = s.offsetHeight > vh + 24;
      [top, tall ? top + s.offsetHeight - vh : null].forEach(function (c) {
        if (c === null) return;
        if (Math.abs(c - y) < 3) { aligned = true; return; }
        var d = (c - y) * scrollDir;
        if (d < 3 || d > reach) return;
        if (best === null || d < Math.abs(best - y)) best = c;
      });
    });
    /* 이미 페이지 경계에 딱 맞아 있으면 그대로 */
    if (best !== null && !aligned) glideTo(best);
  }
  if ('onscrollend' in window) window.addEventListener('scrollend', function () { clearTimeout(settleTimer); settleTimer = setTimeout(settle, 140); });
  else window.addEventListener('scroll', function () { clearTimeout(settleTimer); settleTimer = setTimeout(settle, 220); }, { passive: true });
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
    window.addEventListener(t, function () { clearTimeout(settleTimer); cancelGlide(); }, { passive: true });
  });

  /* =========================================================
     스크롤 등장: 화면에 들어오면 아래에서 살며시 떠오름
     data-stagger 묶음은 자식이 차례로 떠오름
     ========================================================= */
  $$('[data-stagger]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.classList.add('reveal'); c.style.setProperty('--i', i); });
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  function watchReveal(root) { $$('.reveal', root).forEach(function (el) { io.observe(el); }); }

  function once(el, cls, th, cb) {
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { el.classList.add(cls); if (cb) cb(); o.disconnect(); } });
    }, { threshold: th });
    o.observe(el);
  }

  /* =========================================================
     3. 물음표 월드 안내도
     ========================================================= */
  var map = $('#worldMap'), placeIdx = 0;
  D.places.forEach(function (p, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pin'; b.style.left = p.x + '%'; b.style.top = p.y + '%';
    b.setAttribute('aria-label', (i + 1) + '. ' + p.name);
    b.innerHTML = '<span>' + (i + 1) + '</span>';
    b.addEventListener('click', function () { showPlace(i); });
    map.appendChild(b);
  });
  function showPlace(i) {
    placeIdx = (i + D.places.length) % D.places.length;
    var p = D.places[placeIdx];
    $('#worldNo').textContent = (placeIdx + 1) + ' / ' + D.places.length;
    $('#worldName').textContent = p.name;
    $('#worldText').textContent = p.text;
    $$('.pin', map).forEach(function (b, j) { b.classList.toggle('is-active', j === placeIdx); });
  }
  $('#worldPrev').addEventListener('click', function () { showPlace(placeIdx - 1); });
  $('#worldNext').addEventListener('click', function () { showPlace(placeIdx + 1); });
  showPlace(0);

  /* 4. 시놉시스: 큰 천 그림자 */
  once($('#story'), 'is-shadow', 0.35);

  /* =========================================================
     5. 인물 문
     ========================================================= */
  var grid = $('#doorGrid'), opened = {};
  try { opened = JSON.parse(store.get('mm_doors') || '{}') || {}; } catch (e) { opened = {}; }
  D.cast.forEach(function (c, i) {
    var li = document.createElement('li');
    li.className = 'door-card reveal' + (opened[c.id] ? ' is-open' : '');
    li.style.setProperty('--c', c.color); li.style.setProperty('--bg', c.bg); li.style.setProperty('--i', i % 4);
    li.innerHTML =
      '<button class="door-btn" type="button" aria-expanded="' + (opened[c.id] ? 'true' : 'false') + '" aria-label="' + esc(T('door.open', { role: c.role })) + '">' +
        '<div class="door-frame">' +
          '<img src="assets/cast/' + c.id + '.webp" alt="' + esc(T('door.alt', { role: c.role, actor: c.actor })) + '" loading="lazy" />' +
          '<span class="door-leaf2" aria-hidden="true"><b>?</b><i></i></span>' +
        '</div>' +
      '</button>' +
      '<p class="door-name">' + esc(c.role) + (c.extra ? '<em>' + esc(c.extra) + '</em>' : '') + '<small>' + esc(c.actor) + '</small></p>' +
      '<div class="door-info"><p class="door-line">"' + esc(c.line) + '"</p><p class="door-desc">' + esc(c.desc) + '</p></div>';
    $('.door-btn', li).addEventListener('click', function () {
      var isOpen = li.classList.toggle('is-open');
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen && !opened[c.id]) {
        opened[c.id] = 1; store.set('mm_doors', JSON.stringify(opened));
        ding(); paintCount();
        if (Object.keys(opened).length === D.cast.length) giveCrown(true);
      }
    });
    grid.appendChild(li);
  });
  function paintCount() { $('#openCount').textContent = Object.keys(opened).length + ' / ' + D.cast.length; }
  function giveCrown(show) {
    $('#crownBadge').hidden = false; store.set('mm_crown', '1');
    if (show) setTimeout(function () { openModal($('#crownModal')); }, 900);
  }
  paintCount();
  if (store.get('mm_crown') === '1') giveCrown(false);

  /* =========================================================
     6. 넘버 플레이어 (한 번에 한 곡, 30초)
     ========================================================= */
  var audio = $('#audio'), cur = -1, list = $('#numberList');
  D.numbers.forEach(function (n, i) {
    var li = document.createElement('li');
    li.innerHTML =
      '<button class="num-btn" type="button" style="--tone:' + n.tone + '">' +
        '<span class="num-no">' + n.no + '</span>' +
        '<span class="num-title">' + esc(n.title) + '<br><span class="num-who">' + esc(n.who) + '</span></span>' +
        '<span class="num-ico"><span class="material-icons-outlined" aria-hidden="true">play_arrow</span></span>' +
      '</button>';
    $('button', li).addEventListener('click', function () {
      if (cur === i && !audio.paused) { audio.pause(); return; }
      pick(i, true);
    });
    list.appendChild(li);
  });
  function pick(i, play) {
    var n = D.numbers[i];
    if (cur !== i) {
      cur = i;
      audio.src = n.audio;
      $('#nowTitle').textContent = n.no + ' ' + n.title;
      $('#nowWho').textContent = n.who;
      $('#lyric').innerHTML = n.lyric.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('');
      $('#playBtn').disabled = false;
      $$('.num-btn', list).forEach(function (b, j) { b.classList.toggle('is-active', j === i); });
      paintTime();
    }
    if (play) { var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
  }
  function fmt(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function paintTime() {
    var d = isFinite(audio.duration) && audio.duration ? audio.duration : 30;
    $('#barFill').style.width = (audio.currentTime / d * 100) + '%';
    $('#bar').setAttribute('aria-valuenow', Math.floor(audio.currentTime));
    $('#time').textContent = fmt(audio.currentTime) + ' / ' + fmt(d);
  }
  function paintPlay() {
    var playing = !audio.paused;
    $('#playIcon').textContent = playing ? 'pause' : 'play_arrow';
    $('#playBtn').setAttribute('aria-label', T(playing ? 'pause' : 'play'));
    $$('.num-btn', list).forEach(function (b, j) {
      $('.num-ico .material-icons-outlined', b).textContent = (j === cur && playing) ? 'pause' : 'play_arrow';
    });
  }
  $('#playBtn').addEventListener('click', function () {
    if (cur < 0) return;
    if (audio.paused) { var p = audio.play(); if (p && p.catch) p.catch(function () {}); } else audio.pause();
  });
  audio.addEventListener('timeupdate', paintTime);
  audio.addEventListener('play', paintPlay);
  audio.addEventListener('pause', paintPlay);
  audio.addEventListener('ended', function () { audio.currentTime = 0; paintTime(); paintPlay(); });
  $('#bar').addEventListener('click', function (e) {
    if (cur < 0 || !audio.duration) return;
    var r = this.getBoundingClientRect(); audio.currentTime = (e.clientX - r.left) / r.width * audio.duration;
  });
  /* 넘버 구역을 벗어나면 멈춤 */
  new IntersectionObserver(function (es) {
    if (!es[0].isIntersecting && !audio.paused) audio.pause();
  }, { threshold: 0.05 }).observe($('#numbers'));

  /* =========================================================
     7. 몰라 정류장: 천 → 지붕, 잠깐 불 끄기
     ========================================================= */
  once($('#stopSvg'), 'is-roof', 0.5);
  var dark = $('#blackout'), restBtn = $('#restBtn'), darkTimer = null, darkY = 0;
  function lightsOff() {
    if (!dark.hidden) return;
    cancelGlide();
    darkY = window.scrollY;
    dark.hidden = false;
    void dark.offsetWidth; /* 바로 다음 프레임에 전환이 시작되도록 */
    document.body.classList.add('is-rest', 'is-dark');
    dark.classList.add('is-on');
    dark.focus({ preventScroll: true });
    darkTimer = setTimeout(lightsOn, 4600);
  }
  function lightsOn() {
    if (!dark.classList.contains('is-on')) return;
    clearTimeout(darkTimer);
    dark.classList.remove('is-on');
    document.body.classList.remove('is-rest');
    setTimeout(function () {
      dark.hidden = true;
      document.body.classList.remove('is-dark');
      restBtn.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 1200);
  }
  restBtn.addEventListener('click', lightsOff);
  dark.addEventListener('click', lightsOn);
  dark.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lightsOn(); }
  });
  /* 불이 꺼진 동안엔 뒤 화면이 움직이지 않게 (휠·터치를 막고, 그래도 움직이면 제자리로) */
  function isDark() { return document.body.classList.contains('is-dark'); }
  ['wheel', 'touchmove'].forEach(function (t) {
    window.addEventListener(t, function (e) { if (isDark()) e.preventDefault(); }, { passive: false });
  });
  window.addEventListener('scroll', function () {
    if (isDark() && window.scrollY !== darkY) window.scrollTo({ top: darkY, behavior: 'instant' });
  }, { passive: true });

  /* =========================================================
     8. 무대 기록 · 크레딧
     ========================================================= */
  var today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  var todayKey = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
  $('#stageList').innerHTML = D.stages.map(function (s, i) {
    var past = s.date < todayKey, isToday = s.date === todayKey;
    var mm = Number(s.date.slice(5, 7)), dd = Number(s.date.slice(8, 10));
    return '<li class="stage reveal' + (past ? ' is-past' : '') + '" style="--i:' + i + '">' +
      '<div class="stage-date"><b>' + mm + '.' + dd + '</b><span>' + s.day + ' ' + s.time + '</span></div>' +
      '<div><span class="stage-tag">' + T(isToday ? 'stage.today' : past ? 'stage.past' : 'stage.next') + '</span>' +
      '<p class="stage-title">' + esc(s.title) + '</p><p class="stage-meta">' + esc(s.place) + '</p></div></li>';
  }).join('');
  $('#creditList').innerHTML = D.credits.map(function (c) { return '<dt>' + esc(c[0]) + '</dt><dd>' + esc(c[1]) + '</dd>'; }).join('');
  $('#castLine').innerHTML = D.cast.map(function (c) { return '<span><b>' + esc(roleName(c)) + '</b> ' + esc(c.actor) + '</span>'; }).join(' ');
  $('#thanks').textContent = D.thanks;

  /* =========================================================
     9. 내 질문 띄우기
     ========================================================= */
  var BANNED = ['시발', '씨발', 'ㅅㅂ', 'ㅆㅂ', '병신', 'ㅂㅅ', '개새', '존나', 'ㅈㄴ', '좆', '닥쳐', '꺼져', '미친놈', '미친년', 'fuck', 'shit'];
  var PHONE = /01[016789][\s.\-]?\d{3,4}[\s.\-]?\d{4}/, MAIL = /\S+@\S+\.\S+/;
  var MAX = C.MAX_LEN || 60, color = D.questionColors[0];
  var askText = $('#askText'), askMsg = $('#askMsg');
  askText.setAttribute('maxlength', MAX);

  $('#colorPick').innerHTML = D.questionColors.map(function (c, i) {
    return '<button type="button" role="radio" aria-checked="' + (i === 0) + '" aria-label="' + T('ask.colorN', { n: i + 1 }) + '" style="--c:' + c + '" data-c="' + c + '"></button>';
  }).join('');
  $$('#colorPick button').forEach(function (b) {
    b.addEventListener('click', function () {
      color = b.dataset.c;
      $$('#colorPick button').forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
    });
  });
  askText.addEventListener('input', function () { $('#askCount').textContent = askText.value.length + ' / ' + MAX; });

  function checkText(t) {
    if (t.length < 2) return T('ask.tooShort');
    if (t.length > MAX) return T('ask.tooLong', { max: MAX });
    var low = t.toLowerCase().replace(/\s/g, '');
    for (var i = 0; i < BANNED.length; i++) if (low.indexOf(BANNED[i]) > -1) return T('ask.bad');
    if (PHONE.test(t) || MAIL.test(t)) return T('ask.private');
    return '';
  }
  function say(m, err) { askMsg.textContent = m; askMsg.classList.toggle('is-error', !!err); }

  /* =========================================================
     질문의 문: 공개된 질문 하나하나가 저마다의 문이 되어 벽에 걸림
     - 색 = 질문한 사람이 고른 색, 모양 = 질문마다 다름, 크기 = 질문 길이
     - 내 질문은 내 화면에 바로 걸림(확인 중) → 선생님이 공개하면 모두에게
     - 다른 사람의 확인 중인 질문은 글 없이 잠긴 문으로만 보임
     - 이 구역이 보이는 동안 POLL_SEC마다 새로 열린 문을 불러옴
     ========================================================= */
  var mine = [];
  try { mine = JSON.parse(store.get('mm_mine') || '[]') || []; } catch (e) { mine = []; }
  mine = mine.filter(function (q) { return q && typeof q.t === 'string'; });
  var approved = [], pendingOthers = 0, isLive = false;
  var wall = $('#qwall'), wallMore = $('#wallMore'), wallInfo = $('#wallInfo'), wallLive = $('#wallLive'), wallToast = $('#wallToast');
  var wallPending = $('#wallPending'), pendingDoors = $('#pendingDoors');
  var WALL_STEP = window.innerWidth >= 768 ? (C.WALL_COUNT || 40) : 18;
  var wallLimit = WALL_STEP, wallShown = false, doorEls = {};
  var SHAPES = ['arch', 'rect', 'round', 'double', 'tall'];
  var HEX = /^#[0-9a-fA-F]{6}$/;

  function hash(t) { var h = 2166136261; for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function keyOf(q) { return q.t + '|' + (q.d || ''); }
  /* 영어 화면에서는 시트가 번역해 준 영어(te)로 보여 줌 (없으면 원문) */
  var EN_UI = window.MM_LANG === 'en';
  function shown(q) { return EN_UI && q.te ? q.te : q.t; }
  /* 문 크기: 글자 수 기준 (영어는 같은 뜻도 글자가 많아 기준을 넓게) */
  function sizeOf(t) { var a = EN_UI ? 28 : 14, b = EN_UI ? 64 : 30; return t.length <= a ? 's' : t.length <= b ? 'm' : 'l'; }
  function has(list, t) { for (var i = 0; i < list.length; i++) if (list[i].t === t) return true; return false; }
  function myWaiting() { return mine.slice(0, 5).filter(function (q) { return !has(approved, q.t); }); }

  /* 똑똑: 문을 두드리는 소리 (소리를 켰을 때만) */
  function knock() {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var now = actx.currentTime;
      [0, 0.16].forEach(function (t0) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(210, now + t0); o.frequency.exponentialRampToValueAtTime(90, now + t0 + 0.09);
        g.gain.setValueAtTime(0.0001, now + t0); g.gain.exponentialRampToValueAtTime(0.35, now + t0 + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, now + t0 + 0.12);
        o.connect(g); g.connect(actx.destination); o.start(now + t0); o.stop(now + t0 + 0.14);
      });
    } catch (e) {}
  }

  /* state: '' 공개된 질문, 'mine-wait' 내 질문(확인 중), 'mine-ok' 내 질문(공개됨) */
  function makeDoor(q, state) {
    var li = document.createElement('li'), h = hash(q.t);
    var text = shown(q);
    li.className = 'qdoor qd-' + SHAPES[h % SHAPES.length] + ' qd-' + sizeOf(text) + (state ? ' is-' + state : '');
    li.style.setProperty('--c', HEX.test(q.c) ? q.c : '#9C82EA');
    li.style.setProperty('--tilt', ((h >>> 3) % 31 / 10 - 1.5).toFixed(1) + 'deg');
    li.style.setProperty('--bob', (5 + (h >>> 7) % 40 / 10).toFixed(1) + 's');
    li.style.setProperty('--bobDelay', (-((h >>> 11) % 60) / 10).toFixed(1) + 's');
    li.innerHTML =
      '<button type="button" class="qdoor-body" aria-label="' + esc(T('wall.doorAria', { t: text }) + (state ? T(state === 'mine-ok' ? 'wall.mineOkAria' : 'wall.mineWaitAria') : '')) + '">' +
        '<span class="qdoor-win" aria-hidden="true">?</span>' +
        '<span class="qdoor-plate"' + (text !== q.t ? ' lang="en" title="' + esc(q.t) + '"' : '') + '>' + esc(text) + '</span>' +
        '<span class="qdoor-knob" aria-hidden="true"></span>' +
      '</button>' +
      (state ? '<span class="qdoor-tag" aria-hidden="true">' + T(state === 'mine-ok' ? 'wall.mineOk' : 'wall.mineWait') + '</span>' : '');
    $('.qdoor-body', li).addEventListener('click', function () {
      var b = this; b.classList.remove('is-knock'); void b.offsetWidth; b.classList.add('is-knock'); knock();
    });
    return li;
  }

  /* 있는 문은 그대로 두고, 새 문만 끼워 넣음 (떠 있는 움직임이 끊기지 않게) */
  function renderWall(fresh) {
    fresh = fresh || {};
    var want = [], keep = {};
    function add(q, state, k) {
      var d = doorEls[k];
      if (!d || d.state !== state) d = doorEls[k] = { el: makeDoor(q, state), state: state };
      if (fresh[k]) { d.el.classList.remove('is-enter', 'is-born'); void d.el.offsetWidth; d.el.classList.add('is-born'); }
      keep[k] = 1; want.push(d.el);
    }
    var waiting = myWaiting();
    waiting.forEach(function (q) { add(q, 'mine-wait', 'm:' + q.t); });
    approved.slice(0, wallLimit).forEach(function (q) { add(q, has(mine, q.t) ? 'mine-ok' : '', 'a:' + keyOf(q)); });
    Object.keys(doorEls).forEach(function (k) { if (!keep[k]) delete doorEls[k]; });

    if (!want.length) {
      wall.innerHTML = '<li class="qwall-empty"><span class="qdoor-outline" aria-hidden="true">?</span>' + T('wall.empty') + '</li>';
    } else {
      var empty = $('.qwall-empty', wall); if (empty) empty.remove();
      var cur = wall.firstChild;
      want.forEach(function (el) { if (el === cur) cur = cur.nextSibling; else wall.insertBefore(el, cur); });
      while (cur) { var nx = cur.nextSibling; wall.removeChild(cur); cur = nx; }
    }

    /* 다른 사람의 확인 중 질문: 글 없이 작은 잠긴 문으로만 */
    var nGhost = Math.min(pendingOthers, 8);
    while (pendingDoors.children.length < nGhost) { var gl = document.createElement('li'); gl.innerHTML = '<span class="material-icons-outlined">lock</span>'; pendingDoors.appendChild(gl); }
    while (pendingDoors.children.length > nGhost) pendingDoors.removeChild(pendingDoors.lastChild);
    wallPending.hidden = !pendingOthers;

    var info = [T('wall.open', { n: approved.length })];
    if (waiting.length) info.push(T('wall.myWait', { n: waiting.length }));
    if (pendingOthers) info.push(T('wall.otherWait', { n: pendingOthers }));
    wallInfo.textContent = info.join(' · ');
    wallLive.hidden = !isLive;
    var more = approved.length - wallLimit;
    wallMore.hidden = more <= 0;
    if (more > 0) wallMore.textContent = T('wall.more', { n: Math.min(more, WALL_STEP) });
    $('#allCount').textContent = approved.length ? '(' + approved.length + ')' : '';
  }
  wallMore.addEventListener('click', function () { wallLimit += WALL_STEP; renderWall(); });

  var toastTimer = null;
  function toast(m) {
    wallToast.textContent = m; wallToast.classList.add('is-show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { wallToast.classList.remove('is-show'); }, 3600);
  }

  function fetchJSON(url, ms) {
    return new Promise(function (ok, no) {
      var done = false, tm = setTimeout(function () { if (!done) { done = true; no(new Error('timeout')); } }, ms || 8000);
      fetch(url, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) { if (!done) { done = true; clearTimeout(tm); ok(j); } })
        .catch(function (e) { if (!done) { done = true; clearTimeout(tm); no(e); } });
    });
  }
  function clean(items) {
    return (Array.isArray(items) ? items : []).filter(function (q) { return q && typeof q.t === 'string' && q.t; })
      .map(function (q) { return { t: q.t.slice(0, MAX), te: typeof q.te === 'string' ? q.te.slice(0, MAX * 3) : '', c: q.c, d: q.d || '' }; });
  }
  function loadQuestions() {
    var api = C.API_URL
      ? fetchJSON(C.API_URL + (C.API_URL.indexOf('?') > -1 ? '&' : '?') + 'action=list&_=' + Date.now()).then(function (r) {
          if (!r || !r.items) throw new Error('bad');
          return { items: clean(r.items), pending: Number(r.pending) || 0, live: true };
        })
      : Promise.reject();
    return api.catch(function () {
      return fetchJSON(C.FALLBACK_JSON || 'data/questions.json').then(function (j) { return { items: clean(j), pending: 0, live: false }; });
    });
  }

  var POLL_MS = Math.max(15, C.POLL_SEC || 30) * 1000, pollTimer = null, wallVisible = false, busy = false, lastLoad = 0;
  function refresh(first) {
    if (busy) return Promise.resolve(); busy = true; lastLoad = Date.now();
    return loadQuestions().then(function (res) {
      var before = {}; approved.forEach(function (q) { before[keyOf(q)] = 1; });
      var fresh = {}, arrived = 0, mineOpened = 0;
      if (!first) res.items.forEach(function (q) {
        if (before[keyOf(q)]) return;
        fresh['a:' + keyOf(q)] = 1;
        if (has(mine, q.t)) mineOpened++; else arrived++;
      });
      approved = res.items; isLive = res.live;
      pendingOthers = Math.max(0, Math.min(30, res.pending - myWaiting().length));
      renderWall(fresh);
      if (first) enterWall();
      if (mineOpened) { toast(T('wall.toastMine')); ding(); }
      else if (arrived) { toast(T('wall.toastNew', { n: arrived })); ding(); }
    }).catch(function () {}).then(function () { busy = false; });
  }
  /* 처음 보일 때: 문들이 차례로 떠오름 */
  function enterWall() {
    if (wallShown) return; wallShown = true;
    $$('.qdoor', wall).forEach(function (el, i) { el.style.setProperty('--i', Math.min(i, 24)); el.classList.add('is-enter'); });
  }
  function schedule() {
    clearTimeout(pollTimer);
    if (!wallVisible || !C.API_URL) return;
    pollTimer = setTimeout(function () { if (!document.hidden) refresh(); schedule(); }, POLL_MS + Math.random() * 5000);
  }
  new IntersectionObserver(function (es) {
    wallVisible = es[0].isIntersecting;
    if (wallVisible && Date.now() - lastLoad > 10000) refresh(!lastLoad);
    schedule();
  }, { rootMargin: '300px 0px' }).observe($('#ask'));
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && wallVisible && Date.now() - lastLoad > 10000) refresh();
  });
  renderWall();

  $('#askForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if ($('#askHp').value) return;
    var t = askText.value.replace(/\s+/g, ' ').trim();
    var bad = checkText(t); if (bad) { say(bad, true); return; }
    var last = Number(store.get('mm_last') || 0), wait = (C.COOLDOWN_SEC || 60) * 1000 - (Date.now() - last);
    if (wait > 0) { say(T('ask.wait', { s: Math.ceil(wait / 1000) }), true); return; }
    store.set('mm_last', String(Date.now()));

    var q = { t: t, c: color, d: todayKey, mine: true };
    mine = [q].concat(mine.filter(function (m) { return m.t !== t; })).slice(0, 20);
    store.set('mm_mine', JSON.stringify(mine));
    var fresh = {}; fresh['m:' + t] = 1;
    renderWall(fresh);
    var mineEl = doorEls['m:' + t];
    if (mineEl) setTimeout(function () { mineEl.el.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' }); }, 150);
    ding();
    askText.value = ''; $('#askCount').textContent = '0 / ' + MAX;
    say(T('ask.made'));

    if (C.API_URL) {
      $('#askBtn').disabled = true;
      fetch(C.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, /* 사전 확인(CORS) 없이 보내기 */
        body: JSON.stringify({ text: t, color: color, website: '' })
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res && res.ok) say(T('ask.sent'));
        /* 서버 안내는 한국어라서, 영어 화면에선 공통 안내로 */
        else say((window.MM_LANG !== 'en' && res && res.error) || T('ask.retry'), true);
      }).catch(function () {
        say(T('ask.offline'), true);
      }).then(function () { $('#askBtn').disabled = false; });
    }
  });

  $('#allBtn').addEventListener('click', function () {
    var dot = function (c) { return HEX.test(c) ? c : '#9C82EA'; };
    var rows = myWaiting().map(function (q) { return '<li style="--c:' + dot(q.c) + '"><b>?</b><div>' + esc(q.t) + '<small>' + T('wall.mineWait') + '</small></div></li>'; })
      .concat(approved.map(function (q) { return '<li style="--c:' + dot(q.c) + '"><b>?</b><div>' + esc(shown(q)) + (q.d ? '<small>' + esc(q.d) + '</small>' : '') + '</div></li>'; }));
    $('#allList').innerHTML = rows.length ? rows.join('') : '<li>' + T('list.empty') + '</li>';
    openModal($('#allModal'));
  });

  /* =========================================================
     10. 에필로그
     ========================================================= */
  once($('#sprout'), 'is-grown', 0.6);
  if (Date.now() >= Date.parse(D.babyDoorOpensAt)) {
    $('#babyDoor').classList.add('is-open');
    $('.baby-door-frame .material-icons-outlined').textContent = 'lock_open';
    $('#babyText').textContent = T('baby.opened');
  }

  /* 모달 */
  function openModal(m) { if (m.showModal) m.showModal(); else m.setAttribute('open', ''); }
  $$('dialog').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) m.close ? m.close() : m.removeAttribute('open'); });
  });

  watchReveal(document);
  onScroll();
})();
