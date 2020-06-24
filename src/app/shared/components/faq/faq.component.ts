import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  activePanel: number;
  faq: FAQ[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getJSON('assets/faq.json').subscribe(data => {
      this.faq = data;
    });
  }

  public getJSON(jsonURL: string): Observable<any> {
    return this.http.get(jsonURL);
  }

}

export interface FAQ {
  id: number;
  question: string;
  response: string;
  gif: string;
}
