import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { EffectsModule } from "@ngrx/effects";
import { AppComponent } from "./app.component";
import { HeaderComponent } from './component/header/header.component';
import { PlayPageComponent } from './page/play-page/play-page.component';
import { InputComponent } from './component/input/input.component';
import { WordComponent } from './component/word/word.component';
import { MainPageComponent } from './page/main-page/main-page.component';
import { PlayInfoComponent } from './component/play-info/play-info.component';
import { GameOverComponent } from './component/game-over/game-over.component';
import * as AppReducer from "./ngrx/app.reducer";
import { GameEffects } from './ngrx/app.effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlayPageComponent,
    InputComponent,
    WordComponent,
    MainPageComponent,
    PlayInfoComponent,
    GameOverComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ game: AppReducer.gameReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 // Retains last 25 states
    }),
    EffectsModule.forRoot([GameEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
