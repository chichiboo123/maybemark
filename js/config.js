/* =========================================================
   MAYBEMARK 설정
   Apps Script 웹 앱을 배포한 뒤 '/exec'로 끝나는 주소를 아래에 붙여 넣으세요.
   비워 두면 질문은 방문자 화면에만 뜨고 저장되지 않습니다.
   ========================================================= */
window.MM_CONFIG = {
  API_URL: '',              // 예: 'https://script.google.com/macros/s/XXXXXXXX/exec'
  FALLBACK_JSON: 'data/questions.json', // 공연 후 고정 보관용(Apps Script가 멈춰도 이 파일을 보여줌)
  MAX_LEN: 60,              // 질문 최대 글자 수
  COOLDOWN_SEC: 60,         // 같은 기기에서 다시 보내기까지 기다리는 시간
  SKY_COUNT: 30             // 하늘에 한 번에 띄우는 질문 수
};
