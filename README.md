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

