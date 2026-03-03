# 2026년 3월 이후 주짓수 대회 조사 전달 포맷

아래 **JSON 배열** 그대로 채워서 주시면, 서비스 반영용 마크다운 파일(`content/events/*.md`)로 바로 변환 가능합니다.

## 1) 권장 전달 포맷 (JSON)

```json
[
  {
    "title": "대회명",
    "date": "2026-04-18",
    "city": "서울",
    "venue": "잠실학생체육관",
    "organizer": "KBJJF",
    "tags": ["gi", "nogi", "kbjjf"],
    "registrationUrl": "https://example.com/register",
    "sourceUrl": "https://example.com/notice",
    "regDeadline": "2026-04-11",
    "weighInInfo": "대회 당일 08:00~09:00",
    "notes": "키즈/성인 동시 진행"
  }
]
```

## 2) 필드 규칙

- `title` (필수): 공식 공지 기준 대회명
- `date` (필수): `YYYY-MM-DD`
- `city` (권장): 시/도 또는 시/군/구
- `venue` (권장): 경기장/체육관명
- `organizer` (권장): 주최/주관
- `tags` (권장): 검색/필터용 키워드 (예: `gi`, `nogi`, `kbjjf`, `street`, `ajp`, `kids`, `women`)
- `registrationUrl` (권장): 신청/접수 링크
- `sourceUrl` (권장): 공식 공지/근거 링크
- `regDeadline` (선택): 접수 마감일
- `weighInInfo` (선택): 계체/체중계측 정보
- `notes` (선택): 기타 메모

### 비어 있는 값 처리

- 모르면 `null` 또는 `""` 로 주세요.
- 추정값은 넣지 말고, 확인 가능한 공식 링크 기준으로만 작성해 주세요.

## 3) 현재 서비스에 이미 있는 "2026년 3월 이후" 대회 (중복 제외 목록)

아래 항목은 이미 등록되어 있으니, **신규 조사 시 제외 대상**으로 사용하세요.

1. 2026-03-07 · 제1회 COS KOREA 주짓수 대회
2. 2026-03-07 · 스트릿 주짓수 154 전주 오픈
3. 2026-03-14 · 스트릿 주짓수 155 원주 오픈
4. 2026-03-15 · 제3회 강서구체육회장배 주짓수챔피언십
5. 2026-03-21 · AJP TOUR SOUTH KOREA NATIONAL JIU-JITSU CHAMPIONSHIP 2026 - GI & NO-GI
6. 2026-03-21 · SPYDER BJJ SUPER SERIES 2026
7. 2026-03-21 · 스트릿 주짓수 156 천안 오픈
8. 2026-03-29 · 제3회 강서구체육회장배 주짓수챔피언십
9. 2026-04-11 · 2026 경남선발대회(주짓수)
10. 2026-05-10 · ADCC KOREA CHAMPIONSHIP 2026
11. 2026-06-06 · Marianas Pro Korea 2026 (Gi)
12. 2026-06-06 · Marianas Pro Korea 2026 (No-gi)
13. 2026-09-05 · AJP TOUR SEOUL INTERNATIONAL JIU-JITSU CHAMPIONSHIP 2026 (Gi & No-Gi)
14. 2026-09-13 · PBJJF Asian Jiu-Jitsu Championship 2026

---

필요하면 다음에는 제가 이 JSON을 받아서 자동으로 `content/events/*.md` 파일까지 생성 가능한 형태로 바로 변환해드릴게요.
