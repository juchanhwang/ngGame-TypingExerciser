import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  wordListUrl = 'http://localhost:3000/wordlist';
  constructor(private http: HttpClient) { }

  getWordList() {
    debugger;
    return this.http.get(this.wordListUrl)
  }
}