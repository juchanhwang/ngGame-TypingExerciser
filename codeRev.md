

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

로 작성해주시는게 좋습니다. **null을 리턴해도 그 statement가 아무런 행동을 하지 않기 때문에 좋은 코딩 스타일은 아니**라고 생각합니다. :) 



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