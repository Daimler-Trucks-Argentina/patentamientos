import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PbiParameters } from 'src/app/models/pbi-parameters/pbi-parameters.model';
import { ReportService } from 'src/app/services/reports/reports.service';
export class ReportConfig {
  Id: string = "";
  Name: string = "";
  EmbedUrl: string = "";
  Token: string = "";
}

@Component({
  selector: 'app-patentings-reporting',
  templateUrl: './patentings-reporting.component.html',
  styleUrls: ['./patentings-reporting.component.scss']
})
export class PatentingsReportingComponent implements OnInit {

  reportPBI: any;
  url: string = "https://app.powerbi.com/reportEmbed?reportId=d12c4c64-c9e5-43f7-9997-3565a32f2f28&autoAuth=true&ctid=505cca53-5750-4134-9501-8d52d5df3cd1"

  constructor(private route: ActivatedRoute, private reportService: ReportService) { }

  ngOnInit(): void {

    const reportParameter = new PbiParameters();
    reportParameter.WorkspaceId = '3b1bcd3e-86af-4d23-9ecb-e69d1f04c81b';
    reportParameter.ReportId = 'a22dc4dc-23af-40f5-89b0-5aca098ad505';
    reportParameter.UserNameAcceso = 'Federico.acevedo@daimlertruck.com';
    reportParameter.ClaveAcceso = 'Estudiantes68*';
    reportParameter.TypeReport = 'PBI.HOJA';
    reportParameter.ReportSection = '';
    this.reportService.GetToken(reportParameter).subscribe((r) => {
      r.EmbedUrl = r.EmbedUrl;
      this.reportPBI.generateReport(r, reportParameter.ReportSection);
    }); 
  }
 
}