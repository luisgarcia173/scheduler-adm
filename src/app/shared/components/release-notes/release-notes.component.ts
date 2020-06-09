import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-release-notes',
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss']
})
export class ReleaseNotesComponent implements OnInit {

  releaseNotes: ReleaseNotes[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getJSON('assets/release_notes.json').subscribe(data => {
      this.releaseNotes = data;
     });
  }

  public getJSON(jsonURL: string): Observable<any> {
    return this.http.get(jsonURL);
  }

}

export interface ReleaseNotes {
  version: string;
  date: string;
  developer: string;
  features: string[];
  bugs: string[];
  notes: string[];
}
