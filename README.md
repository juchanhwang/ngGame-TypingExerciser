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



## 해당 문제점에 대한 코드상의 원인 지점과 수정 방법 🐛

##### 1.  문제점: score가 0점이 되어도 구독상태가 유지되어있어, 게임이 멈추지 않는다.

> 해결방안

- ##### word component의 template파일에 

```html
<ng-container *ngIf="score$ | async">
  <div
    *ngFor="let word of gameWords$ | async"
    [style.left.px]="word.X"
    [style.top.px]="word.Y"
  >
  {{ word.text }}
  </div>
</ng-container>
```

`<ng-container *ngIf="score$ | async">` 를 추가했다. 즉, score가 존재할 때까지만 구독을 하는 것이다. 하지만 또 다른 문제가 발생했다. score가 '0'점이 되는 순간 구독이 취소 되었다가 다시 구독이 되는 문제가 발생했다.



##### 1-1. 문제점: score가 0보다 작아질 때, 즉 false가 아닐 때 다시 구독이 된다.

> 해결방안

- `<ng-container *ngIf="isPlay$ | async">` 로 수정했다. `score === 0` 이면, `isPlay = false`의 값을 할당 받는다. isPlay의 값이 'true' 일 때에만 구독한다.

```html
<ng-container *ngIf="isPlay$ | async">
    <div
      *ngFor="let word of gameWords$ | async"
      [style.left.px]="word.X"
      [style.top.px]="word.Y"
    >
    {{ word.text }}
  </div>
</ng-container>
```

  ```js
gameWords$: Observable<any[]> = this.store.select(
    selectGameWords,
    takeUntil(this.unsubscribe$)
);
  
/*...*/
    if (score === ZERO_SCORE) {
      this.isGameOver = true;
      this.toggleIsPlay({ isTrue: false });
      this.resetGameTime();
    } else {
      this.toggleIsPlay({ isTrue: true });
    }
/*...*/
  
ngOnDestroy(): void {
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
}
  ```



2. ##### PLAY/STOP 버튼을 눌러서 한번 /play 주소로 이동했다가 한번 더 버튼을 눌러서 게임 취소한다음 다시 플레이를 누르면 새로 시작되지 않고, 첫번째 플레이 시도에서 발생한 Subscription들이 여전히 남아있음

> 해결방안

- action에 resetState를 추가,

```js
//action.ts

export const resetState = createAction("[meta] resetState");
```

- reducer함수에 state 값을 초기값으로 바꿔주는 메소드 추가,

```js
//reducer.ts

  on(resetState, ({ words }) => {
    return { ...initialState, words };
  })
```

- 그리고, play-page-component에, 게임이 시작될 때마다 state를 reset해주는 메소드를 추가했다.

```js
this.store.dispatch(resetState());
```



3. ##### subscribe 안에서 subscribe를 하고있음

```js
this.gameWords$.pipe(takeUntil(this.unsubscribe$)).subscribe(words => {
  interval(this.intervalTime)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(() => {
      words.forEach(word => {
        if (word.Y < MAX_WORD_Y && !this.isGameOver) {
          word.Y += FALLING_SPEED;
        } else if (word.Y === MAX_WORD_Y) {
	      	word.Y = INITIAL_Y_VALUE;
      		this.loseScore();
		      this.removeWord(wordIdx);
        }
      });
    });
});
```

> 해결방안

-  switchMap 함수 활용

```javascript
  showFallingWords() {
    this.gameWords$
      .pipe(
        switchMap(
          () => interval(INTERVAL_TIME),
          gameWords => this.getWordXVal(gameWords)
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  getWordXVal(gameWords) {
    gameWords.forEach((word, wordIdx) => {
      if (word.Y < MAX_WORD_Y && !this.isGameOver) {
        word.Y += FALLING_SPEED;
      } else if (word.Y >= MAX_WORD_Y) {
        word.Y = INITIAL_Y_VALUE;
        this.loseScore();
        this.removeWord(wordIdx);
      }
    });
  }
```

#### 추가적인 수정 사항들

-  gameWord를 설정하는 함수를 app component에서 play component로 이동 (play 컴포넌트에서 설정하는 것이 적절하다고 판단)
- 컴포넌트가 삭제되었을 때 구독을 취소하는 기능 추가 (takeUntil(unsubScribe$), ngOnDestroy)
- 타입 설정 해주는 type.ts 파일 추가

```typescript
export interface GameWord {
  text: string;
  Y: number;
  X: number;
}

export interface Word {
  text: string;
}
```

- 함수 분리. 함수가 하나의 역할만 할 수 있게
- 상수값 분리



## 이번 코딩 테스트 개발 과정에서 겪었던 시행착오 💪

1. Angular,RXJS,TS,NGRX를 처음 접해보았다.
   - 1주일이라는 시간은 ANGULAR,RXJS,TS,NGRX를 통해 기능을 구현하기에 부족한 시간이었다. 나의 나름의 전략은 이러했다.
   - **ANGULAR**: 공식문서가 한글로 되어있기 때문에 구현하면서 익히기로 했다.
     - 아주 기본적인 개발 환경 설정, 컴포넌트의 기본 구조 , 라우터의 기본 구조 등은 미리 학습했다.
     - 과제를 하면서 공식문서의 내용을 토대로 코드를 적용시키면서 이해를 했다.
     - angular.io, poiemaweb.com, stackoverflow위주로 검색하며 공부했다.
   - **NGRX**: 처음 접해보는 내용이었다. 2차 과제를 받기 전까지는 ngrx를 공부하는데 거의 모든 시간을 썼다.
     - 공식문서에 나와있는 예제를 계속 반복해서 학습했다. 그리고, 과제 코드에 적용시켰다. (할 수 있는 말이 이것 밖에 없다. 예제를 토대로 코드에 적용하였음. 해외에서 몇 년 살다 온 것이 문서를 읽는데 도움이 조금은 되었던 것 같다...😂)
     - ngrx 공식 문서/[ngrx architecture를 이용하여 angular 앱을 더 기분 좋게 만들기](https://medium.com/pplink/ngrx-architecture를-이용하여-angular-앱을-더-기분-좋게-만들기-9182c582a113)/stackoverflow 등..
   - **RXJS**: 피드백 내용을 토대로 구글링했다. 공식 문서보다는 '**Tomas Trajan**'라는 구글 개발자의 블로그 글이 정말 많은 도움이 되었다.
     - [angularindepth.com](https://blog.angularindepth.com/@tomastrajan)
   - **TypeScript**: 앞으로 열심히 익혀볼 예정...^__^(하하)

> 결론: 
>
> 시행착오라고하면 **계속 코딩**한 것밖에 없는 것 같다. 모르는 것 계속 검색해보고, 계속 삽질해보고, 구현 될 때까지 붙잡고 있는 것밖에 한게 없다. 어떻게 보면 무식한 방법이지만 내가 알고 있고 할 수 있는 방법이 이 것밖에 없었다. 시간이 많지 않았기 때문에 이해보다는 코드를 직접 적용하는 방법으로 코딩을 했고, 반복하면서 이해를 했던 것 같다.
>
> 개념을 이해하고 적용하는 편을 좋아하기 때문에 모르는 것을 모르는 채로 두는 것은 괴로운 과정이었다. 하지만 이 과정에서 알게 된 사실이 있다. 이해 후에 적용하는 것보다 적용 후에 이해하는 것이 내가 습득하고 성장하는 속도가 빨랐다는 것이다. 그리고, 스스로 성장하는 과정이 눈에 보이기 때문에 더 재미있게 코딩 할 수 있는 시간이었다. 한 달 동안 리액트를 공부한 시간보다 2주 동안 앵귤러를 공부한 시간이 나에게는 더 큰 성장을 가져다 주었고, 앞으로 어떻게 공부해야하는지 알게 된 과정이었다. 이 번 코딩 테스트 개발 과정에서 '자신감'이라는 것을 얻게 된 것 같다.