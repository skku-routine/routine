# SKKU-ROUTINE
#### 하루의 습관을 계획하는 루틴 기록 어플리케이션 :
잊어버리기 쉽지만 캘린더에 기록하기엔 거창한 반복 일정을 계획하고, 실천 현황을 기록합니다.

## Install
git clone 후, electron을 설치하고(“npm install electron”) 터미널 창에 “npm start”를 입력하면 실행됩니다.
```
git clone https://github.com/skku-routine/routine.git
npm install electron
npm start
```

## Usage

#### 앱 실행 및 종료
* 앱 실행
    - 환영 메시지와 함께 코로나19 관련 시설 이용 방침 안내창이
뜹니다. 각 시설(식당 및 카페, 헬스장, 독서실 및 스터디카페) 버튼 위에 마우스를 올리면 간단한 정보를 안내받을 수 있습니다.
        - 코로나19 방역 수칙은 2021.11.1 수도권 기준입니다.(https://news.seoul.go.kr/welfare/archives/537018)
    - "SKIP" 버튼을 클릭하면 루틴 앱으로 넘어갑니다.
* 종료
    - 종료 시 루틴 종류 및 상태가 저장됩니다.

#### 루틴 관리
* 루틴 추가하기
    - 루틴의 이름과 반복 주기(요일), 카테고리 이름 및 색깔을 설정합니다.
    - 금일만 루틴 추가가 가능합니다.
* 루틴 삭제하기
    - 삭제일을 기점으로 해당 루틴을 삭제합니다.
    - 금일만 루틴 삭제가 가능합니다. 
* 루틴 실행 여부 기록
    - 해당 날짜 박스를 클릭해 그날 루틴의 실행 여부를 기록합니다.
        - 1번 클릭 시 : ✔️(실행 완료)
        - 2번 클릭 시 : ❌(실행 실패)
        - 3번 클릭 시 : 실행 여부 초기화

#### Weekly & Monthly View
* Weekly View
    - 그날의 루틴 목록과 그 주의 실행 현황을 함께 확인할
수 있습니다.
    - 루틴 앱의 첫 페이지로, "Monthly" 버튼을 클릭하면 Monthly View로 교체할 수
있습니다.
* Monthly View
있습니다.
    - 그 달의 실행 현황을 색깔로 확인할 수 있습니다.
        - 달성률 33% ↓ : 빨강
        - 달성률 66% ↓ : 주황
        - 딜성률 99% ↓ : 노랑
        - 딜상룰 100% : 초록
    - 루틴을 연속으로 실행한 일수를 확인할 수 있습니다.  
    - 날짜를 클릭하면 Weekly View로 전환되며, 그 날 실행한 루틴 목록을 확인할 수 있습니다.


## Example
* 앱 실행 초기 화면 
![](https://user-images.githubusercontent.com/65144472/143606721-a18c0149-8aa7-4fdd-8445-317c2560fb24.png)

* Weekly View
![](https://user-images.githubusercontent.com/65144472/143606773-ee97f2fb-2a24-49cc-9c6d-cdc812585fb8.png)

* Monthly View
![](https://user-images.githubusercontent.com/65144472/143606855-2bbd24b6-9d80-41d7-a48d-c24be5262b57.png)
