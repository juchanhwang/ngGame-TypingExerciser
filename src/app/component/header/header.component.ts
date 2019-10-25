import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "../app.reducer";
import { resetState, toggleisPlay } from "../app.action";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  goToMain() {
    this.store.dispatch(resetState());
    this.store.dispatch(toggleisPlay({ isPlay: false }));
  }
}
