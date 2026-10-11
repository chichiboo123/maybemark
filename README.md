# MAYBEMARK · 모름표 탐험대

2026 동두천송내초 뮤톡 창작뮤지컬 《모름표 탐험대》 홍보 사이트
**물음표와 마침표 사이, 아무도 몰랐던 세상의 이야기**

- 주소: https://maybemark.chichiboo.link
- 화면: 이 저장소(GitHub)에서 배포하는 정적 사이트
- 질문 아카이브: 구글 시트 + Apps Script(화면 없는 JSON API)

## 폴더

```
index.html            한 페이지 사이트
css/style.css         디자인
js/data.js            ★ 글자·인물·넘버·무대 기록 (내용 수정은 여기서)
js/config.js          ★ Apps Script 주소(API_URL)
js/main.js            동작
assets/               포스터 원화, 로고, 인물 일러스트, MR 30초 클립, OG 이미지
data/questions.json   공연 후 고정 보관용 공개 질문 (처음엔 빈 배열)
apps-script/Code.gs   구글 시트에 붙여 넣을 코드
CNAME                 GitHub Pages 사용자 도메인
```

## 1. GitHub Pages로 배포

1. GitHub에 새 저장소(예: `maybemark`)를 만들고 이 폴더 전체를 올립니다.
2. 저장소 **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `/ (root)` → Save.
3. 같은 화면 **Custom domain**에 `maybemark.chichiboo.link` 입력 → Save. (`CNAME` 파일이 이미 들어 있습니다.)
4. chichiboo.link 도메인 DNS(Cloudflare 등)에 레코드 추가:
   `CNAME  maybemark  →  <깃허브아이디>.github.io` (Cloudflare라면 프록시는 '끔(DNS only)'으로)
5. 몇 분 뒤 **Enforce HTTPS**를 켭니다.

> 기존 앱처럼 Cloudflare Pages에 저장소를 연결해 배포해도 됩니다. 이때는 빌드 명령 없이 출력 폴더를 `/`로 두면 됩니다.

## 2. 질문 아카이브(구글 시트 + Apps Script)

1. 구글 시트를 새로 만듭니다 (이름 예: `MAYBEMARK 질문`).
2. **확장 프로그램 → Apps Script** → 기본 코드를 지우고 `apps-script/Code.gs` 내용을 붙여 넣고 저장.
3. 함수 목록에서 `setup` 선택 → **실행** → 권한 허용. '질문' 탭과 머리글이 생깁니다.
4. **배포 → 새 배포** → 유형 **웹 앱**
   - 실행: **나**
   - 액세스 권한: **모든 사용자**
   → 배포 후 나오는 `/exec`로 끝나는 주소를 복사.
5. `js/config.js`의 `API_URL`에 그 주소를 붙여 넣고 GitHub에 올립니다.

### 운영

- 새 질문은 '질문' 탭에 쌓이고 **공개** 칸이 비어 있습니다. 체크하면 사이트 하늘에 떠오릅니다 (바로~최대 5분).
- 체크를 풀면 다시 숨겨집니다. 휴대폰 구글 시트 앱에서도 됩니다.
- 코드를 고친 뒤에는 **배포 → 배포 관리 → 연필(수정) → 버전: 새 버전**으로 바꿔야 주소가 그대로 유지됩니다. '새 배포'를 누르면 주소가 바뀝니다.
- 사이트는 Apps Script에 글자(JSON)만 요청하므로 방문자에게 Apps Script 안내 화면이 보이지 않습니다.

### 공연이 끝난 뒤 (고정 보관)

시트 메뉴 **MAYBEMARK → 공개 질문 questions.json 만들기** → '내보내기' 탭 A1 내용을 복사해 `data/questions.json`에 붙여 넣고 올립니다.
Apps Script가 멈추거나 `API_URL`을 비워도 사이트는 이 파일을 보여 줍니다.

## 3. 내용 바꾸기

| 바꿀 것 | 위치 |
| --- | --- |
| 인물 소개·대사, 넘버 가사·색, 안내도 설명, 무대 기록, 크레딧 | `js/data.js` |
| MR 하이라이트 | `assets/audio/m1_30s.mp3` ~ `m7_30s.mp3` 파일 교체 (같은 이름) |
| 인물 일러스트 | `assets/cast/*.webp` 교체 (같은 이름) |
| 아기 질문의 문 여는 시각 | `js/data.js`의 `babyDoorOpensAt` |
| 질문 글자 수·재전송 대기·하늘에 띄우는 수 | `js/config.js` |

---
Created by. 교육뮤지컬 꿈꾸는 치수쌤 · https://litt.ly/chichiboo
