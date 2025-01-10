import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from 'rxjs/operators';  
import { PbiParameters } from "src/app/models/pbi-parameters/pbi-parameters.model";
@Injectable({ providedIn: 'root', }) 
export class ReportService { 

    constructor(private http: HttpClient) { }

    public GetToken(parameters: PbiParameters) {
        const url = environment.api.reportUrl + 'PBI/GetToken';
        return this.http.post(url, parameters).pipe(map((response: any) => {
            return JSON.parse(response);
        }));
    }
} 