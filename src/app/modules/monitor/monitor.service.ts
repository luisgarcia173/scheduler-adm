import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JobStructure } from 'src/app/shared/models/job-structure';

const API: string = environment.jobsAPI;

@Injectable({
  providedIn: 'root'
})
export class MonitorService {

  constructor(
    private http: HttpClient
  ) { }

  listJobs(): Observable<JobStructure[]>  {
    return this.http.get<JobStructure[]>(API);
  }

  resume(name: string, group: string): Observable<any>  {
    return this.http.put<any>(`${API}/${name}/group/${group}/resume`, {});
  }
  pause(name: string, group: string): Observable<any>  {
    return this.http.put<any>(`${API}/${name}/group/${group}/pause`, {});
  }
  stop(name: string, group: string): Observable<any>  {
    return this.http.put<any>(`${API}/${name}/group/${group}/stop`, {});
  }
  execute(name: string, group: string): Observable<any>  {
    return this.http.put<any>(`${API}/${name}/group/${group}/execute`, {});
  }
  unschedule(name: string, group: string): Observable<any>  {
    return this.http.put<any>(`${API}/${name}/group/${group}/unschedule`, {});
  }

  remove(name: string, group: string): Observable<any>  {
    return this.http.delete<any>(`${API}/${name}/group/${group}`, {});
  }

}

