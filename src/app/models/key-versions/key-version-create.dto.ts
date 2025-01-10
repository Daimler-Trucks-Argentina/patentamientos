export interface KeyVersionCreateDto {
  id: string;
  mercedesTerminalId?: string;
  mercedesMarcaId?: string;
  mercedesModeloId?: string;
  internalVersionSegmentationId: string;
  mercedesVersionInternaSegmentacionId?: string;
  mercedesVersionClaveId?: string;
  dateTo?: Date;
  dateFrom?: Date;
  descriptionShort?: string;
  descriptionLong?: string;
  segCategory?: string;
  segName?: string;
}
