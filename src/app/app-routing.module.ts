import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { PlayPageComponent } from "./play-page/play-page.component";

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full'},
  { path: "main", component: MainPageComponent },
  { path: "play", component: PlayPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
