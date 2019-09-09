# 타자 연습기 ⌨️

##### 사용 기술: Angular, RxJS, Redux(NgRx)

## 게임 실행 🕹

- 터미널에 `json-server --watch db.json` 입력
- 터미널에 `ng serve` 로 실행
- 게임 주소: `http://localhost:4200`



## 기능 (수정) ⚙️

### /main 주소

- 헤더의 'TYPING EXERCISER'를 클릭하면 /main으로 이동
- 카테고리 중 '게임하러 가기'를 누르면 /play 화면으로 이동



### /play 주소

- 하단에 'START' 버튼을 클릭하면 게임 시작
- 'STOP' 버튼을 클릭하면 /play 초기화면으로 이동 (state 초기화)
- 게임 화면에서 위에서 아래로 랜덤한 단어들이 떨어짐 (시작 x 좌표 위치는 매번 랜덤하게 떨어져야합니다.)
- 단어를 맞출 때마다 점수 1점씩 획득하고, 화면 밑에까지 내려갔는데 타이핑하지 못 했을 경우 점수를 1점 깎음
- 처음에 점수 시작은 5점에서 시작하고, 점수가 0점이 되면 Game Over를(3초간) 보여주고 /play 초기 화면으로 이동
- 단어를 10개씩 맞출 때마다 내려오는 속도가 1.5배 증가



### 기술 요구사항 🛠

- setTimeout, setInterval을 사용하지 않고 RxJS 라이브러리에 있는 타이머 관련 operator만 사용해주세요.

- 컴포넌트 기반 프레임워크이기 때문에 컴포넌트를 어떻게 나누는게 좋을지 잘 고려해주세요.

- Angular Router를 이용해서 주소를 나눠주세요

- JSON Server(https://github.com/typicode/json-server)를 이용해서 간단한 API를 만들 수 있습니다. JSON Server를 이용해서 후보 단어를 리턴하는 API를 만들고, Angular에서 HttpClient를 이용해 후보 단어를 서버 요청으로부터 받아오도록 구현해주세요.

- 위 사항을 모두 충족한 경우, NgRx 도입하는 부분까지 도전해주세요.

- 게임의 현재 점수, 속도값, 후보 단어 목록을 NgRx state에 저장

- 점수를 올리거나 내리는 것도 dispatch 를 통해 처리

- Rx 패턴 프로그래밍을 Angular에서 가장 잘 구현한 @ngrx/store 를 이용해서 시도해보시기 바랍니다.

- Rx 패턴의 Redux에서는 Side effects 라는 개념이 있습니다. @ngrx/effects 라이브러리가 이 개념을 잘 지원하고 있는데요. 후보 단어 목록을 가져오는 API 요청도 Redux의 Action으로 선언하여, 컴포넌트에서는 dispatch만 하고, API 호출을 직접 하지 않도록 해보세요. (레퍼런스 4번 참고)

- 게임 요소가 들어가있는 주제이기 때문에 시간이 남으시면 자유롭게 게임 요소들을 더 추가해도 좋습니다.



> 레퍼런스

- Angular 프로젝트 생성 및 라우터 설정 관련 https://angular.io/tutorial
- Angular Redux 관련 라이브러리 - https://github.com/ngrx/platform
- RxJS 타이머 관련 - https://www.learnrxjs.io/operators/creation
- Side Effects 모델에 대한 가이드 - https://ngrx.io/guide/effects





## 코드 리뷰

#### 1. 전반적으로 2차보다 3차에서 코딩 스타일이 훨씬 더 좋아진 것 같습니다. 2차 제출 과제랑 3차 제출 과제를 git diff로 비교해서 파악하고 아래 코드 리뷰 남겨드립니다.



#### 2. unsubscribe해야하는 Subscription을 저희 회사에서는 아예 이렇게 관리합니다.

```typescript
export abstract class AbstractBaseComponent implements OnInit, OnDestroy {
  _sub: Subscription[];

  constructor() {
    this._sub = [];
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this._sub) {
      this._sub.forEach(sub => sub.unsubscribe());
      this._sub = [];
    }
  }
}
```

이렇게 선언해놓고 각 컴포넌트에서 

```typescript
export class MainComponent extends AbstractBaseComponent { 

   constructor(private store$: Store<GameState>) {

      super();

   }



   ngOnInit() {

      this._sub.push(

         this.store$.select(selectScore).subscribe((score) => {

		console.log(score);

         })

      );

   }

}
```



이렇게 _sub에 넣어주기만 하면 ngOnDestroy 에서 알아서 unsubscribe 해주는 구조를 채택하고 있습니다.

코드 중간중간에 

```typescript
gameTimerSubscription: Subscription;
```

이렇게 선언해두신 부분이 있는데 사실 개발 과정에서는 각 subscription을 가지고 unsubscribe 할 일이 거의 없이 ngOnDestroy 에서 다 unsubscribe하다보니 배열에 담아버리고 forEach로 unsubscribe하는 방식을 채택한것입니다. :) 





### 3. play-page.component.ts 에서 103번째 줄에 curWordIdx >= ? .() : 

이럴 때는

```ts
 if (curWordIdx >= 0) { 

    this.addScore();

 }
```

로 작성해주시는게 좋습니다. null을 리턴해도 그 statement가 아무런 행동을 하지 않기 때문에 좋은 코딩 스타일은 아니라고 생각합니다. :) 



### 4. switchMap 사용 시 두번째 인자를 넘기는 방식은 deprecated 된 방법입니다.

```ts
this.gameWords$
  .pipe(
    switchMap(
      () => interval(INTERVAL_TIME),
      gameWords => this.getWordXVal(gameWords)
    ),
    takeUntil(this.unsubscribe$)
  )
```

```ts
interval(INTERVAL_TIME).pipe(

  takeUntil(this.unsubscribe$),

  withLatestFrom(this.gameWord), // outer observable이 돌아간 시점의 gameWord 상태값을 가져옴

  map(([ , gameWords ]) => this.getWordXVal(gameWords))

)
```

와 동일하게 작동합니다. 