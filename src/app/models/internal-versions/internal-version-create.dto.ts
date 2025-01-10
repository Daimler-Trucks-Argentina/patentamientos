export interface InternalVersionCreateDto {
  id: string;
  mercedesMarcaId?: string;
  carModelId: string;
  mercedesModeloId?: string;
  mercedesTerminalId?: string;
  versionPatentamiento?: string;
  versionWs?: string;
  versionInterna?: string;
  descripcionVerInt?: string;
  uploadDate?: Date;
  dateTo?: Date;
  dateFrom?: Date;
}
