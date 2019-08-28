테스트 주제: “타자 연습기 제작”

사용 기술: Angular, RxJS, Redux(NgRx)

/main 주소 화면

네모난 div 박스 하나를 그립니다. (게임 화면)
박스 바로 밑에 단어를 입력할 수 있는 input[type=text] 태그를 배치하고, Start 버튼을 input 태그 오른쪽에 보여줍니다.
Start 버튼을 누르면 /play 주소로 이동합니다.
/play 주소로 들어갔을 때 화면

/main 화면과 똑같은 UI로 보여주되 Start 버튼 자리에 Stop 버튼이 보입니다. (Stop 버튼은 말그대로 게임 중단하는 것입니다)
Stop 버튼을 눌렀을 때는 /main으로 이동시키면 됩니다.
게임 화면에서 위에서 아래로 랜덤한 단어들이 떨어집니다. (시작 x 좌표 위치는 매번 랜덤하게 떨어져야합니다.)
단어를 맞출 때마다 점수 1점씩 획득하고, 화면 밑에까지 내려갔는데 타이핑하지 못 했을 경우 점수를 1점 깎습니다.
처음에 점수 시작은 5점에서 시작하고, 점수가 0점이 되면 Game Over 를 보여줍니다.
기술 요구사항:

setTimeout, setInterval을 사용하지 않고 RxJS 라이브러리에 있는 타이머 관련 operator만 사용해주세요.
컴포넌트 기반 프레임워크이기 때문에 컴포넌트를 어떻게 나누는게 좋을지 잘 고려해주세요.
Angular Router를 이용해서 주소를 나눠주세요
JSON Server(https://github.com/typicode/json-server)를 이용해서 간단한 API를 만들 수 있습니다. JSON Server를 이용해서 후보 단어를 리턴하는 API를 만들고, Angular에서 HttpClient를 이용해 후보 단어를 서버 요청으로부터 받아오도록 구현해주세요.
위 사항을 모두 충족한 경우, NgRx 도입하는 부분까지 도전해주세요.

게임의 현재 점수, 속도값, 후보 단어 목록을 NgRx state에 저장
점수를 올리거나 내리는 것도 dispatch 를 통해 처리
Rx 패턴 프로그래밍을 Angular에서 가장 잘 구현한 @ngrx/store 를 이용해서 시도해보시기 바랍니다.
Rx 패턴의 Redux에서는 Side effects 라는 개념이 있습니다. @ngrx/effects 라이브러리가 이 개념을 잘 지원하고 있는데요. 후보 단어 목록을 가져오는 API 요청도 Redux의 Action으로 선언하여, 컴포넌트에서는 dispatch만 하고, API 호출을 직접 하지 않도록 해보세요. (레퍼런스 4번 참고)
게임 요소가 들어가있는 주제이기 때문에 시간이 남으시면 자유롭게 게임 요소들을 더 추가해도 좋습니다.

Ex) 점수가 10점 높아질 때마다 내려오는 속도가 1.2배

후보 단어는 임의로 넣어주시면 됩니다.

레퍼런스

Angular 프로젝트 생성 및 라우터 설정 관련 https://angular.io/tutorial
Angular Redux 관련 라이브러리 - https://github.com/ngrx/platform
RxJS 타이머 관련 - https://www.learnrxjs.io/operators/creation
Side Effects 모델에 대한 가이드 - https://ngrx.io/guide/effects