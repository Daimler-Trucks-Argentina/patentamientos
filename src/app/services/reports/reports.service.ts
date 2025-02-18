import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from 'rxjs/operators';  
import { PbiParameters } from "src/app/models/pbi-parameters/pbi-parameters.model";
import { Observable } from "rxjs";
@Injectable({ providedIn: 'root', }) 
export class ReportService  {
    HttpClient: any; 
    private readonly controller = 'report';

    constructor(private http: HttpClient) { }

    public GetToken(parameters: PbiParameters) {
        const url = environment.api.reportUrl + 'PBI/GetToken';
        return this.http.post(url, parameters).pipe(map((response: any) => {
            return JSON.parse(response);
        }));
    }

    public getReport(
        dateFrom: string | null,
        dateTo: string,
        pageNumber: number | undefined,
        pageSize: number | undefined
      ): Observable<any> {
        const url: string = 
        `${this.controller}/general?FechaPatentamientoDesde=${dateFrom ?? ''}&FechaPatentamientoHasta=${dateTo ?? ''}&PageSize=${pageSize}&PageNumber=${pageNumber}`;
        return this.http.get(url);
      }
    
} 