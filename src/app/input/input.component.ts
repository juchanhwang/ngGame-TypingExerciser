import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";

import { AppState } from "../app.reducer";
import { Observable } from "rxjs";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"]
})
export class InputComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}
}
