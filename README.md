# BJJ 대회 캘린더

전국 주짓수 대회 일정을 한눈에 모아보는 비공식 캘린더입니다.
KBJJF, 스트릿 주짓수, 예거스 등 주요 주최 기관의 대회를 쉽게 찾아보세요.

👉 [바로가기](https://teamhyeokjiujitsu.github.io/?tag=kbjjf)

## 주요 기능
- 주최 기관별 탭 필터: KBJJF, 스트릿 주짓수, 예거스
- 대회별 날짜·장소·신청 링크 제공
- 커뮤니티가 함께 업데이트하는 오픈소스 프로젝트
- 네비게이션의 "커서 끄기" 버튼으로 커서를 비활성화할 수 있음

## 기여하기
오류 제보나 일정 추가는 언제든지 Pull Request로 환영합니다.

### GPT에게 최신 대회 정보 요청하기
주짓수 최신 대회 일정을 GPT에게 바로 물어보고 싶다면 아래 프롬프트를 복사해 사용하세요. 원하는 응답 구조와 불확실한 정보 처리 방식까지 포함했습니다.

```
전국 주짓수 대회(예: KBJJF, 스트릿 주짓수, 예거스, ROX, KJSA, NAGA 등)의 최신 일정을 정리해 줘.
결과를 마크다운 표와 JSON 두 가지로 제공해 줘.

필수 필드: eventName, date(YYYY-MM-DD), venue(city/gym), hostOrg, infoUrl, regDeadline(가능하면), weighInInfo(가능하면), source(기사/공식 공지 링크)
출력 예시(JSON):
[
  {
    "eventName": "KBJJF 서울오픈",
    "date": "2024-08-17",
    "venue": "서울 OO체육관",
    "hostOrg": "KBJJF",
    "infoUrl": "https://kbjjf.com/events/seoul-open-2024",
    "regDeadline": "2024-08-10",
    "weighInInfo": "대회 당일 08:00-09:00",
    "source": "https://kbjjf.com/events/seoul-open-2024"
  }
]

정보가 불분명하거나 링크를 찾지 못한 항목은 필드 값을 `null`로 두고, 표에는 “(정보 없음)”이라고 명시해 줘. 근거 출처 링크가 없으면 source를 `null`로 남겨 줘.
```

### 환경 변수
Google AdSense 광고를 사용하려면 `.env.local` 파일에 다음 값을 채워주세요.

```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_ID=xxxxxxxxxx
```

실제 승인된 광고 단위(`data-ad-slot`)를 입력하지 않으면 광고가 노출되지 않습니다.
로컬 개발 환경에서는 자동으로 테스트 광고(`data-adtest="on"`)가 요청되므로,
실제 광고 동작은 프로덕션 도메인에서 확인해주세요.

`app/layout.tsx`에서 AdSense 스크립트가 `NEXT_PUBLIC_ADSENSE_CLIENT_ID`를 읽어
`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=...` 쿼리로 전달합니다.
값을 변경하려면 `.env.local`에 위 변수를 채운 뒤 서버를 다시 실행하세요.
