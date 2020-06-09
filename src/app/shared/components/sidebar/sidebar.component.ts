import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReleaseNotesComponent } from '../release-notes/release-notes.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() theme: string;

  version: string = '';
  date: string = '';

  constructor(
    public dialog: MatDialog,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getJSON('assets/release-notes.json').subscribe(data => {
      this.version = data[0].version;
      this.date = data[0].date;
    });
  }

  public getJSON(jsonURL: string): Observable<any> {
    return this.http.get(jsonURL);
  }

  openReleaseNotes() {
    const dialogRef = this.dialog.open(ReleaseNotesComponent);

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
