import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReleaseNotesComponent } from '../release-notes/release-notes.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() theme: string;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openReleaseNotes() {
    const dialogRef = this.dialog.open(ReleaseNotesComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
