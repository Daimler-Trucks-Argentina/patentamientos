import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileCsvService {
  constructor(private httpClient: HttpClient) {}

  getCSV(requestURL: string) {
    return this.httpClient
      .get(requestURL, {
        responseType: 'text',
      })
      .pipe(
        map((response: string) => {
          return response;
        })
      );
  }
}
