import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { EffectsModule } from "@ngrx/effects";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { PlayPageComponent } from "./play-page/play-page.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { InputComponent } from "./input/input.component";
import { WordComponent } from "./word/word.component";
import { ButtonComponent } from "./button/button.component";
import { PlayInfoComponent } from "./play-info/play-info.component";

import * as AppReducer from "./app.reducer";
import { GameEffects } from "./app.effects";
import { GameOverComponent } from './game-over/game-over.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlayPageComponent,
    InputComponent,
    WordComponent,
    MainPageComponent,
    ButtonComponent,
    PlayInfoComponent,
    GameOverComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ game: AppReducer.reducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
    }),
    EffectsModule.forRoot([GameEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
