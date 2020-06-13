import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API: string = environment.pingAPI;

@Injectable({
  providedIn: 'root'
})
export class ServerStatusService {

  constructor(
    private http: HttpClient
  ) { }

  ping(): Observable<any> {
    return this.http.get(API);
  }

}
