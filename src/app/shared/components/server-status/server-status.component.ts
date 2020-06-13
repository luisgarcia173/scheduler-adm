import { Component, OnInit } from '@angular/core';
import { ServerStatusService } from './server-status.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-server-status',
  templateUrl: './server-status.component.html',
  styleUrls: ['./server-status.component.scss']
})
export class ServerStatusComponent implements OnInit {

  serverStatus: string;

  constructor(
    private serverStatusService: ServerStatusService
  ) { }

  ngOnInit(): void {
    this._getServerStatus();
    interval(500 * 60).subscribe(x => {
      this._getServerStatus();
    });
  }

  private _getServerStatus() {
    this.serverStatus = 'slow';
    this.serverStatusService.ping().subscribe(
      () => this.serverStatus = 'ready',
      err => this.serverStatus = 'off'
    );
  }

}
