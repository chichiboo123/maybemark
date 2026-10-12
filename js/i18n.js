/* =========================================================
   MAYBEMARK · 한국어 / English
   - 한국어 원문: index.html과 js/data.js (지금처럼 거기서 고치면 됩니다)
   - 영어: 이 파일의 EN(화면 글자)과 DATA_EN(인물·넘버·안내도·무대 기록)
   - 화면에 data-i18n="키"가 붙은 곳을 영어로 바꿔 끼웁니다.
   - 언어는 ?lang=en / ?lang=ko → 저장한 선택 → 브라우저 언어 순서로 정합니다(index.html 맨 위).
   ========================================================= */
(function () {
  'use strict';

  var LANG = window.MM_LANG === 'en' ? 'en' : 'ko';

  /* 스크립트(main.js)가 만드는 글자 — 한국어 */
  var KO = {
    'sound.on': '소리 켜기',
    'sound.off': '소리 끄기',
    'ding': '(딩동) 새로운 질문이 탄생했습니다.',
    'door.open': '{role}의 문 열기',
    'door.alt': '{role} 역 {actor} 일러스트',
    'play': '재생',
    'pause': '일시정지',
    'stage.today': '오늘의 무대',
    'stage.past': '지나온 무대',
    'stage.next': '다가올 무대',
    'ask.colorN': '{n}번 색',
    'ask.tooShort': '질문을 두 글자 이상 적어 주세요.',
    'ask.tooLong': '{max}자 안으로 적어 주세요.',
    'ask.bad': '고운 말로 다시 적어 줄래요?',
    'ask.private': '전화번호나 이메일은 적지 말아 주세요.',
    'ask.wait': '{s}초 뒤에 다시 띄울 수 있어요.',
    'ask.made': '딩동! 내 질문의 문이 생겼어요.',
    'ask.sent': '딩동! 질문이 도착했어요. 선생님이 확인하면 모두에게 문이 열려요.',
    'ask.retry': '잠시 뒤 다시 띄워 주세요.',
    'ask.offline': '지금은 질문이 저장되지 않았어요. 내 화면에만 문이 있어요.',
    'wall.doorAria': '질문의 문: {t}',
    'wall.mineWaitAria': ' (내 질문, 확인 중)',
    'wall.mineOkAria': ' (내 질문, 공개됨)',
    'wall.mineWait': '내 질문 · 확인 중',
    'wall.mineOk': '내 질문 · 공개됨',
    'wall.empty': '아직 열린 문이 없어요.<br>첫 번째 질문의 문을 만들어 주세요!',
    'wall.open': '열린 문 {n}개',
    'wall.myWait': '내 질문 {n}개 확인 중',
    'wall.otherWait': '다른 질문 {n}개 확인 중',
    'wall.more': '문 더 보기 (+{n})',
    'wall.toastMine': '딩동! 내 질문의 문이 모두에게 열렸어요.',
    'wall.toastNew': '딩동! 새로운 질문의 문 {n}개가 열렸어요.',
    'list.empty': '아직 공개된 질문이 없어요. 첫 질문을 띄워 주세요!',
    'baby.opened': '작품발표회가 끝나고 문이 열렸어요. 커튼콜 기록이 곧 이 문 너머에 올라와요.',
    'lang.label': 'EN',
    'lang.aria': 'Switch to English'
  };

  /* 영어 — 화면 글자(data-i18n 키) + 스크립트 글자 */
  var EN = {
    'meta.title': 'MAYBEMARK · The Maybemark Explorers',
    'meta.desc': 'An original musical by Mutalk&Mutok, Dongducheon Songnae Elementary School — between the question mark and the period, a story of a world no one knew.',

    'intro.aria': 'Enter Question Mark World',
    'intro.kicker': 'An original musical by Mutalk&Mutok, Dongducheon Songnae Elementary',
    'intro.doorAria': 'Open the door and enter Question Mark World',
    'intro.quote': '"I have so many questions, but there never seem to be any answers."',
    'intro.open': 'Shall we open the door?',
    'intro.skip': 'Skip',
    'sound.on': 'Sound on',
    'sound.off': 'Sound off',
    'ding': '(Ding-dong) A new question has been born.',

    'brand.aria': 'MAYBEMARK, back to top',
    'nav.aria': 'Jump to a section',
    'nav.world': 'World',
    'nav.cast': 'Characters',
    'nav.numbers': 'Songs',
    'nav.stages': 'Performances',
    'nav.ask': 'My Question',
    'crown.badge': 'You earned the Period Crown',
    'menu.aria': 'Open menu',

    'hero.sub': '2026 Mutalk&Mutok Original Musical<br />Dongducheon Songnae Elementary School',
    'hero.logoAlt': 'The Maybemark Explorers — between the question mark and the period, a story of a world no one knew',
    'hero.tagline': '<b>The Maybemark Explorers</b><span>Between the question mark and the period, a story of a world no one knew</span>',
    'hero.enter': 'Open the door',
    'hero.listen': 'Hear the songs',
    'hero.down': 'Scroll down',

    'pro.title': 'The Day the Door to Question Mark World Opened',
    'pro.quote': '"I have so many questions,<br />but there never seem to be any answers."',
    'pro.p1': 'One day, a student in Mutalk&Mutok tossed out that one remark. It left a small question mark behind in our club room.',
    'pro.p2': 'What if questions were alive? What if each of them had a name, a personality and a dream of its own?',
    'pro.p3': 'Together, we opened the door of imagination: a world where \'Why\' and \'Really\', \'How\' and \'What If\' live — and the story of a mysterious being called \'Dunno\'.',
    'pro.p4': 'The stories of eight children became songs, and the songs met movement to become a musical.',
    'pro.end': 'Now, between the question mark and the period,<br />the story of a world no one knew begins.',

    'world.title': 'Map of Question Mark World',
    'world.desc': 'Tap the glowing numbers<br />to explore the world where questions live.',
    'world.mapAlt': 'Question Mark World: doors opening among the clouds, questions walking a path shaped like a question mark, the sea and outer space, and a sprout',
    'world.prev': 'Previous place',
    'world.next': 'Next place',

    'story.title': 'The Day the Answers Vanished',
    'story.p1': 'In \'Question Mark World\', questions live by traveling in search of their own answers. Here, every question opens its own door and sets out to find one. A question that finds its answer receives the glorious Period Crown, and the door to \'Period World\', the place of its dreams, swings open.',
    'story.p2': 'Then one day, every answer in the world vanishes without a trace! No question ever comes back, new questions just keep being born, and Question Mark World falls into chaos.',
    'story.p3': '\'Why\', \'Really\', \'How\' and \'What If\' set out to find the missing answers. The four questions form an expedition and hit the road, only to come face to face with a giant, mysterious shadow. And there, they meet a puzzling being called \'Dunno\'……',
    'story.p4': 'Questions that must find their answers, and \'Dunno\', who knows nothing at all. What will their meeting bring to Question Mark World?',
    'story.end': 'Between the question mark and the period, the door to a world no one knew swings open!',
    'story.sfx': 'Swooooosh…',

    'cast.title': 'Meet the Questions Behind the Doors',
    'cast.desc': 'From the Question Mark Explorers \'Curiosities\' to the Maybemark Explorers \'Dunnos\'<br />Tap a door to open it.',
    'door.open': 'Open the door of {role}',
    'door.alt': 'Illustration of {actor} as {role}',

    'num.title': 'Songs of the Questions',
    'num.desc': 'Tap a song to hear a 30-second instrumental highlight.',
    'now.label': 'Now playing',
    'now.pick': 'Pick a song',
    'lyric.empty': 'Tap a song and a few lines of its lyrics will appear here.',
    'play': 'Play',
    'pause': 'Pause',

    'stop.kicker': 'A place to rest for a while',
    'stop.sign': 'Dunno Stop',
    'stop.l1': 'This is Dunno Stop',
    'stop.l2': 'Where different roads meet',
    'stop.l3': 'Rest here a while and tell me your story',
    'stop.l4': 'Before we set off again',
    'stop.btn': 'Take a short break',
    'stop.note': 'The lights go out for a moment. Tap the screen to turn them back on.',
    'dark.aria': 'Taking a short break. Tap to turn the lights back on.',
    'dark.text': 'Shh, I\'m turning off the lights for a moment.',
    'dark.sub': 'Let\'s rest a while at Dunno Stop',
    'dark.hint': 'Tap the screen to set off again',

    'stages.title': 'Performances',
    'stage.today': 'Today',
    'stage.past': 'Past',
    'stage.next': 'Upcoming',
    'credits.title': 'Credits',

    'ask.kicker': 'Ding-dong!',
    'ask.title': 'Turn your question<br />into a door',
    'ask.desc': 'Write down what you wonder about, and a door of your own appears in Question Mark World. Please don\'t include your name or contact details.',
    'ask.label': 'Your question',
    'ask.ph': 'e.g. What if our school floated in outer space?',
    'ask.colors': 'Choose a door color',
    'ask.colorN': 'Color {n}',
    'ask.btn': 'Make my question door',
    'ask.note': 'Your door appears on your screen right away and opens for everyone once a teacher has checked it.',
    'ask.tooShort': 'Please write at least two characters.',
    'ask.tooLong': 'Please keep it within {max} characters.',
    'ask.bad': 'Could you write it again with kind words?',
    'ask.private': 'Please don\'t include phone numbers or email addresses.',
    'ask.wait': 'You can send another question in {s} seconds.',
    'ask.made': 'Ding-dong! Your question door is here.',
    'ask.sent': 'Ding-dong! Your question has arrived. Once a teacher checks it, the door opens for everyone.',
    'ask.retry': 'Please try again in a moment.',
    'ask.offline': 'Your question couldn\'t be saved right now. The door is only on your screen.',

    'wall.title': 'Doors of Questions',
    'wall.live': 'Live',
    'wall.pending': 'Questions a teacher is checking',
    'wall.aria': 'Doors made from visitors\' questions',
    'wall.list': 'View as a list',
    'wall.doorAria': 'Question door: {t}',
    'wall.mineWaitAria': ' (my question, being checked)',
    'wall.mineOkAria': ' (my question, now open)',
    'wall.mineWait': 'My question · checking',
    'wall.mineOk': 'My question · open',
    'wall.empty': 'No doors are open yet.<br>Make the very first question door!',
    'wall.open': '{n} doors open',
    'wall.open.one': '1 door open',
    'wall.myWait': '{n} of mine being checked',
    'wall.otherWait': '{n} others being checked',
    'wall.otherWait.one': '1 other being checked',
    'wall.more': 'See more doors (+{n})',
    'wall.moreBase': 'See more doors',
    'wall.toastMine': 'Ding-dong! Your question door is now open to everyone.',
    'wall.toastNew': 'Ding-dong! {n} new question doors just opened.',
    'wall.toastNew.one': 'Ding-dong! A new question door just opened.',
    'list.title': 'Questions born in Question Mark World',
    'list.empty': 'No questions are open yet. Be the first to ask!',
    'close': 'Close',

    'baby.title': 'The Baby Question\'s Door',
    'baby.text': 'It hasn\'t opened yet. Maybe it\'ll open tomorrow… Dunno.',
    'baby.opened': 'The door opened after the showcase. Curtain-call memories will appear behind this door soon.',
    'epi.end': 'The game of tag between questions and answers isn\'t over yet.<br />There\'s still so much to wonder about!',

    'crown.title': 'The Period Crown is yours!',
    'crown.text': 'You opened all eight doors.<br />Congratulations on finishing your long, long game of tag between questions and answers!',
    'crown.btn': 'Thank you',

    'lang.label': '한국어',
    'lang.aria': '한국어로 보기'
  };

  /* 인물·넘버·안내도·무대 기록 영어판 (js/data.js와 같은 순서). 사람 이름은 영어 표기로 */
  var DATA_EN = {
    cast: [
      { role: 'Why', actor: 'Park Cho-eun', line: 'Because I\'m \'Why\'!',
        desc: 'A chatty, curious question who can\'t hold back when something puzzles them and has to chase the answer to the very end.' },
      { role: 'Really', actor: 'Shin Hae-won', line: 'Really? Are you sure? Did you check it yourself?',
        desc: 'A careful, anxious question who never believes anything easily and only feels safe after double-checking the facts.' },
      { role: 'How', actor: 'Lee Seung-hye', line: 'How? Maybe if we try it like this?',
        desc: 'A can-do question who finds the way by doing rather than worrying.' },
      { role: 'What If', actor: 'Ju Eun-bin', line: 'What if? Then would we all be floating around?',
        desc: 'A free, floaty question who dreams up wild ideas and brand-new possibilities.' },
      { role: 'Dunno', actor: 'Yoon Ji-yeon', line: 'Yeah. Maybe it\'ll open tomorrow… Dunno.',
        desc: 'A slow, unhurried being who shows that it\'s okay to stay with not knowing and rest for a while.' },
      { role: 'Baby Question', actor: 'Lee Ha-eun', extra: '& others', line: 'Can I join the expedition too?',
        desc: 'The youngest, newly born question — pure, brave and determined to open a door all by themselves.' },
      { role: 'Question 1', actor: 'Bok Ji-gyeom', extra: '& others', line: 'Found it!',
        desc: 'The countless questions all over Question Mark World, each opening its own door and traveling in search of its own answer.' },
      { role: 'Question 2', actor: 'Kang Da-hee', extra: '& others', line: 'Want to come with us?',
        desc: 'The countless questions all over Question Mark World, each opening its own door and traveling in search of its own answer.' }
    ],
    numbers: [
      { title: 'When You Open a Question', who: 'Everyone',
        lyric: ['When you open a question', 'A new world comes into view', 'We head out toward it', 'To find the answer'] },
      { title: 'Why, Really, How, What If', who: 'Everyone',
        lyric: ['Ding-dong, ding-dong, a new question is born', 'Zero Period Crowns again today', 'Twisted and tangled, Question Mark World', 'So stuck, stuck, stuck — no-answer world'] },
      { title: 'The Question Mark Explorers', who: 'Why · Really · How · What If',
        lyric: ['Somewhere far away', 'An answer is waiting for me', 'A world we\'ve never been to', 'Together, we can go there'] },
      { title: 'It\'s Okay Not to Know', who: 'Everyone',
        lyric: ['It\'s okay not to know (okay not to know)', 'For a while, it\'s okay not to know (okay not to know)', 'On the day you wonder again', 'That\'s when you open the door'] },
      { title: 'Why', who: 'Why',
        lyric: ['Did I only see what I wanted to see?', 'Did I only hear what I wanted to hear?', 'I kept asking the world why, why, why', 'So why did I never ask about my own thoughts?'] },
      { title: 'Dunno Stop', who: 'Everyone',
        lyric: ['This is Dunno Stop', 'Where different roads meet', 'Rest here a while and tell me your story', 'Before we set off again'] },
      { title: 'The Question Mark Explorers (Reprise)', who: 'Everyone',
        lyric: ['A curiosity seed someone planted', 'A sprout grown on top of a period', 'Embracing the sea, holding the universe', 'That\'s how we explore the world'] }
    ],
    places: [
      { name: 'The Door of Questions',
        text: 'When someone in the real world says out loud what they\'re curious about, a new question is born in Question Mark World. Every question is born with a door of its own, and when it opens, a new path appears.' },
      { name: 'Tag Between Questions and Answers',
        text: 'No one knows where the answers are. Some questions race down the path, some stop to think at a fork in the road, and some come back the way they came. That\'s why this journey is called the game of tag between questions and answers.' },
      { name: 'The Period Crown and Period World',
        text: 'A question that comes back with its own answer receives a sparkling Period Crown. Wearing the crown, it passes through the great door to Period World, the place every question dreams of.' },
      { name: 'The Sea and Outer Space',
        text: 'Is it the sea beyond the door, or a universe full of stars? Each question explores a world it has never seen beyond its own door.' },
      { name: 'Dunno and the Great Cloth',
        text: 'Dressed in gray and slowly dragging a huge cloth — that\'s Dunno. What could the giant shadow over Question Mark World have to do with Dunno\'s cloth? And how will that cloth be used?' },
      { name: 'The Curiosity Seed',
        text: 'A curiosity seed someone planted, a sprout grown on top of a period. Where an answer is found, a new question grows again.' }
    ],
    stages: [
      { day: 'Sat', place: 'Pureunsaem Elementary School Gym',
        title: 'Gala Performance at the Dongducheon–Yangju 「RAS Art & Digital Festa」' },
      { day: 'Tue', place: 'Woori Financial Art Hall',
        title: 'Gala Performance, Finals of the 2026 National School Arts Education Festival' },
      { day: 'Wed', place: 'Multipurpose Room, Dongducheon Songnae Elementary School',
        title: '2026 Mutalk&Mutok Showcase' }
    ],
    credits: [
      ['Supervision', 'Won Chi-su · Kim Chan-ho'],
      ['Book & Lyrics', 'Won Chi-su'],
      ['Direction', 'Kim Chan-ho'],
      ['Music', 'Kim A-young'],
      ['Production', 'Dongducheon Songnae Elementary School']
    ],
    thanks: 'Our heartfelt thanks to Principal Kim Yu-jin and Vice Principal Park Seong-won for warmly encouraging and supporting \'Mutalk&Mutok\', the musical club of Dongducheon Songnae Elementary School.'
  };

  function fill(s, v) {
    return v ? String(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }) : s;
  }
  /* main.js에서 쓰는 번역 함수 */
  window.MM_T = function (key, vars) {
    /* 영어 단수형: 키.one 이 있으면 n이 1일 때 그것을 씀 */
    if (LANG === 'en' && vars && vars.n === 1 && EN[key + '.one'] != null) key += '.one';
    var s = LANG === 'en' && EN[key] != null ? EN[key] : KO[key] != null ? KO[key] : EN[key] != null ? EN[key] : key;
    return fill(s, vars);
  };
  window.MM_LANG = LANG;

  /* ---------- 영어일 때: 화면 글자와 콘텐츠 바꿔 끼우기 ---------- */
  if (LANG === 'en') {
    var D = window.MM_DATA || {};
    ['cast', 'numbers', 'places', 'stages'].forEach(function (k) {
      (DATA_EN[k] || []).forEach(function (o, i) { if (D[k] && D[k][i]) for (var f in o) D[k][i][f] = o[f]; });
    });
    D.credits = DATA_EN.credits;
    D.thanks = DATA_EN.thanks;

    document.title = EN['meta.title'];
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', EN['meta.desc']);
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var v = EN[el.getAttribute('data-i18n')];
      if (v == null) return;
      if (el instanceof SVGElement) el.textContent = v; else el.innerHTML = v;
      /* 영어에서만 보이는 줄(data-i18n-show)은 숨김을 풂. 다른 숨김(예: 문 더 보기)은 그대로 */
      if (el.hasAttribute('data-i18n-show') && v) el.hidden = false;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-attr]'), function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'), v = EN[(p[1] || '').trim()];
        if (v != null) el.setAttribute(p[0].trim(), v);
      });
    });
  }

  /* ---------- 언어 전환 버튼 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-lang-toggle]'), function (b) {
    var lab = b.querySelector('.lang-label'); if (lab) lab.textContent = window.MM_T('lang.label');
    b.setAttribute('aria-label', window.MM_T('lang.aria'));
    b.setAttribute('lang', LANG === 'en' ? 'ko' : 'en');
    b.addEventListener('click', function () {
      var next = LANG === 'en' ? 'ko' : 'en';
      /* 언어마다 글 길이가 달라 높이가 바뀌므로, '어느 구역의 몇 px 지점'으로 기억 */
      var here = null;
      Array.prototype.forEach.call(document.querySelectorAll('.hero, .sec, .epilogue'), function (s) { if (s.offsetTop <= window.scrollY + 2) here = s; });
      var spot = here ? { id: here.id, d: Math.round(window.scrollY - here.offsetTop) } : { id: '', d: Math.round(window.scrollY) };
      try { localStorage.setItem('mm_lang', next); sessionStorage.setItem('mm_scroll', JSON.stringify(spot)); } catch (e) {}
      var u = new URL(location.href); u.searchParams.set('lang', next);
      location.replace(u.toString());
    });
  });
  /* 주소에 ?lang=이 있으면 그 선택을 기억 */
  try { var q = new URLSearchParams(location.search).get('lang'); if (q === 'ko' || q === 'en') localStorage.setItem('mm_lang', q); } catch (e) {}

  /* 언어를 바꾼 직후: 보던 자리로 돌아가기 */
  var backTo = null;
  try { backTo = sessionStorage.getItem('mm_scroll'); sessionStorage.removeItem('mm_scroll'); } catch (e) {}
  if (backTo !== null) {
    var go = function () {
      var spot = {}; try { spot = JSON.parse(backTo) || {}; } catch (e) {}
      var el = spot.id && document.getElementById(spot.id);
      var r = document.documentElement, old = r.style.scrollBehavior;
      r.style.scrollBehavior = 'auto'; window.scrollTo(0, (el ? el.offsetTop : 0) + (Number(spot.d) || 0)); r.style.scrollBehavior = old;
    };
    go(); window.addEventListener('load', go);
  }

  document.documentElement.classList.remove('i18n-wait');
})();
