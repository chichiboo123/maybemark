/**
 * MAYBEMARK · 모름표 탐험대 — 질문 아카이브 API
 *
 * 구글 시트에 붙어 있는 Apps Script입니다. 화면(HTML)은 만들지 않고 글자(JSON)만 주고받습니다.
 * 그래서 방문자는 "Google Apps Script 사용자가 만들었습니다" 안내 화면을 보지 않습니다.
 *
 *  - doPost : 사이트에서 보낸 질문을 '질문' 탭에 한 줄 추가 (공개 칸은 비어 있음)
 *  - doPost : 질문을 받을 때 영어로도 번역해 '영어' 칸(F)에 함께 적음 (구글 번역, 무료)
 *  - doGet  : '공개' 칸에 체크된 질문 + 확인을 기다리는 질문 '개수'만 돌려줌 (5분 캐시)
 *             공개 질문에는 영어(te)도 함께 담아, 사이트 영어 화면에서 영어로 보이게 함
 *             '영어' 칸은 손으로 고쳐도 됩니다. 비어 있으면 다음 요청 때 자동으로 채움
 *             확인 중인 질문의 글은 절대 내보내지 않습니다. 사이트에는 잠긴 문으로만 보입니다.
 *  - onEdit : '공개' 칸을 바꾸면 캐시를 지워 바로 반영
 *  - 메뉴 'MAYBEMARK' : 처음 설정 / questions.json 만들기
 */

var SHEET_NAME = '질문';
var HEADERS = ['시각', '질문', '색', '공개', '메모', '영어'];
var COL_PUBLIC = 4;                 // D열 = 공개(체크박스)
var COL_EN = 6;                     // F열 = 영어 번역 (자동, 손으로 고쳐도 됨)
var TRANSLATE_PER_LOAD = 15;        // 공개 목록을 만들 때 비어 있는 영어를 한 번에 채우는 최대 개수
var MAX_LEN = 60;
var CACHE_KEY = 'approved_v1';
var CACHE_SEC = 300;                // 공개 목록 캐시 5분
var GLOBAL_LIMIT_PER_MIN = 30;      // 사이트 전체 1분 저장 한도
var LIST_LIMIT = 300;               // 돌려주는 최대 개수
var PENDING_HOURS = 48;             // 최근 몇 시간 안에 들어온 미공개 질문을 '확인 중'으로 셀지
                                    // (공개하지 않을 질문은 '메모' 칸에 아무 글자나 적으면 세지 않음)
var COLORS = ['#FFC233', '#3D6BF0', '#3FBF6F', '#F2557F', '#9C82EA', '#3FC4D6'];
var BANNED = ['시발', '씨발', 'ㅅㅂ', 'ㅆㅂ', '병신', 'ㅂㅅ', '개새', '존나', 'ㅈㄴ', '좆', '닥쳐', '꺼져', '미친놈', '미친년', 'fuck', 'shit'];

/* ---------------- 시트 메뉴 ---------------- */
/* 시트를 열 때 자동으로 실행됩니다. 편집기에서 직접 '실행'할 필요는 없어요.
   (편집기에서 실행하면 메뉴를 붙일 시트 화면이 없어서 안내만 남기고 끝납니다.) */
function onOpen() {
  try {
    SpreadsheetApp.getUi().createMenu('MAYBEMARK')
      .addItem('처음 설정 (탭·머리글 만들기)', 'setup')
      .addItem('공개 질문 questions.json 만들기', 'exportJson')
      .addToUi();
  } catch (err) {
    Logger.log('onOpen은 직접 실행하지 않아도 됩니다. 구글 시트 탭을 새로고침하면 MAYBEMARK 메뉴가 생겨요. 처음 설정은 함수 목록에서 setup을 골라 실행하세요.');
  }
}

/* 이 코드는 구글 시트의 [확장 프로그램 → Apps Script]로 연 프로젝트에 있어야 합니다. */
function ss_() {
  var ss = SpreadsheetApp.getActive();
  if (!ss) throw new Error('연결된 구글 시트가 없어요. 시트에서 [확장 프로그램 → Apps Script]를 눌러 연 프로젝트에 이 코드를 붙여 넣어 주세요.');
  return ss;
}

/** 처음 한 번 실행: '질문' 탭과 머리글, 공개 체크박스 열을 만듭니다. */
function setup() {
  var ss = ss_();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setBackground('#FFF4D6');
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 150); sh.setColumnWidth(2, 420); sh.setColumnWidth(3, 80); sh.setColumnWidth(4, 60); sh.setColumnWidth(5, 200); sh.setColumnWidth(6, 420);
  Logger.log("설정 완료: '질문' 탭이 준비됐어요.");
  return '설정 완료';
}

/* ---------------- 저장: 사이트 → 시트 ---------------- */
function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.website) return json_({ ok: true });                 // 로봇용 미끼 칸이 채워지면 조용히 무시

    var text = String(body.text || '').replace(/\s+/g, ' ').trim();
    var bad = check_(text);
    if (bad) return json_({ ok: false, error: bad });
    var color = COLORS.indexOf(body.color) > -1 ? body.color : COLORS[0];

    var cache = CacheService.getScriptCache();
    var minuteKey = 'n_' + Math.floor(Date.now() / 60000);
    var n = Number(cache.get(minuteKey) || 0);
    if (n >= GLOBAL_LIMIT_PER_MIN) return json_({ ok: false, error: '질문이 한꺼번에 몰리고 있어요. 1분 뒤 다시 띄워 주세요.' });
    var dupKey = 'd_' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, text, Utilities.Charset.UTF_8));
    if (cache.get(dupKey)) return json_({ ok: true });              // 같은 질문 10분 안 중복은 한 번만 저장

    var en = toEn_(text);                                           // 영어 번역 (실패하면 빈칸 → 나중에 다시)
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sh = sheet_();
      sh.appendRow([new Date(), text, color, false, '', en]);
      sh.getRange(sh.getLastRow(), COL_PUBLIC).insertCheckboxes();
    } finally {
      lock.releaseLock();
    }
    cache.put(minuteKey, String(n + 1), 90);
    cache.put(dupKey, '1', 600);
    cache.remove(CACHE_KEY);                                       // '확인 중' 개수가 바로 바뀌도록
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: '잠시 뒤 다시 띄워 주세요.' });
  }
}

/* ---------------- 공개 목록: 시트 → 사이트 ---------------- */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'list';
  if (action !== 'list') return json_({ ok: false, error: 'unknown action' });
  var cache = CacheService.getScriptCache();
  var hit = cache.get(CACHE_KEY);
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);
  var snap = snapshot_();
  var out = JSON.stringify({ ok: true, items: snap.items, pending: snap.pending });
  if (out.length < 90000) cache.put(CACHE_KEY, out, CACHE_SEC);
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

/* '공개'·'메모'·'영어' 칸을 바꾸면 캐시를 지워서 다음 요청부터 바로 반영 */
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    if (e.range.getSheet().getName() !== SHEET_NAME) return;
    if (e.range.getColumn() <= COL_EN && e.range.getLastColumn() >= COL_PUBLIC) {
      CacheService.getScriptCache().remove(CACHE_KEY);
    }
  } catch (err) {}
}

/** 공연 후: 공개된 질문을 JSON으로 만들어 '내보내기' 탭 A1에 넣습니다. 복사해서 GitHub의 data/questions.json에 붙여 넣으세요. */
function exportJson() {
  var ss = ss_();
  var out = ss.getSheetByName('내보내기') || ss.insertSheet('내보내기');
  out.clear();
  out.getRange('A1').setValue(JSON.stringify(snapshot_().items, null, 2)).setWrap(true);
  out.setColumnWidth(1, 700);
  var msg = "'내보내기' 탭 A1 칸의 내용을 복사해 GitHub의 data/questions.json에 붙여 넣으세요.";
  try { SpreadsheetApp.getUi().alert(msg); } catch (err) { Logger.log(msg); }
}

/* ---------------- 내부 함수 ---------------- */
function sheet_() {
  var sh = ss_().getSheetByName(SHEET_NAME);
  if (!sh) { setup(); sh = ss_().getSheetByName(SHEET_NAME); }
  return sh;
}

/** 시트를 한 번 읽어 공개 질문(최신순)과 확인 중인 질문 개수를 함께 만듭니다. */
function snapshot_() {
  var sh = sheet_();
  var last = sh.getLastRow();
  if (last < 2) return { items: [], pending: 0 };
  var rows = sh.getRange(2, 1, last - 1, COL_EN).getValues();
  var tz = Session.getScriptTimeZone() || 'Asia/Seoul';
  var since = Date.now() - PENDING_HOURS * 3600 * 1000;
  var items = [], pending = 0, filled = 0;
  for (var i = rows.length - 1; i >= 0; i--) {
    var r = rows[i];
    if (!r[1]) continue;
    if (r[3] === true) {
      if (items.length >= LIST_LIMIT) continue;
      var t = String(r[1]).slice(0, MAX_LEN), en = String(r[COL_EN - 1] || '').trim();
      /* 예전에 들어온 질문 등 영어 칸이 비어 있으면 몇 개씩 채워 둠 */
      if (!en && filled < TRANSLATE_PER_LOAD) {
        en = toEn_(t); filled++;
        if (en) sh.getRange(i + 2, COL_EN).setValue(en);
      }
      var item = { t: t, c: String(r[2] || COLORS[0]), d: r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'yyyy-MM-dd') : '' };
      if (en && en !== t) item.te = en.slice(0, MAX_LEN * 3);
      items.push(item);
    } else if (!r[4] && r[0] instanceof Date && r[0].getTime() > since) {
      pending++;
    }
  }
  return { items: items, pending: Math.min(pending, 30) };
}

/** 질문을 영어로. 이미 영어(한글이 없음)면 그대로, 실패하면 빈칸. */
function toEn_(t) {
  if (!/[\u3131-\u318E\uAC00-\uD7A3]/.test(t)) return t;
  try { return String(LanguageApp.translate(t, 'ko', 'en') || '').trim(); } catch (err) { return ''; }
}

function check_(t) {
  if (t.length < 2) return '질문을 두 글자 이상 적어 주세요.';
  if (t.length > MAX_LEN) return MAX_LEN + '자 안으로 적어 주세요.';
  var low = t.toLowerCase().replace(/\s/g, '');
  for (var i = 0; i < BANNED.length; i++) if (low.indexOf(BANNED[i]) > -1) return '고운 말로 다시 적어 줄래요?';
  if (/01[016789][\s.\-]?\d{3,4}[\s.\-]?\d{4}/.test(t) || /\S+@\S+\.\S+/.test(t)) return '전화번호나 이메일은 적지 말아 주세요.';
  return '';
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
