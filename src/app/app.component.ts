import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from './ngrx/app.reducer';
import { getWordData } from './ngrx/app.action';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(private store: Store<AppState>) { }
  ngOnInit() {
    this.store.dispatch(getWordData());
  }
}
