export interface GradoCreateDto {
  id: string;
  marcaWs: string;
  modeloWs: string;
  grade: string;
  dateTo: Date;
  dateFrom: Date;
  mercedesTerminalId: string;
  mercedesMarcaId: string;
  mercedesModeloId: string;
  carModelId: string;
  versionWs: string;
  dischargeDate: Date;
}
