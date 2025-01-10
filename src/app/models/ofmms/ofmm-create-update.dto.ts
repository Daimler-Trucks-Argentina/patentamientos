export interface OfmmCreateUpdateDto {
  id: string | null;
  zofmm?: string;
  validoHasta?: Date;
  validoDesde?: Date;
  fabricaPat?: string;
  marcaPat?: string;
  modelopat?: string;
  descripcion1?: string;
  descripcion2?: string;
  tipoDeTexto?: string;
  terminal?: string;
  marca?: string;
  modelo?: string;
  versionPatentamiento?: string;
  origen?: string;
  carModelId?: string;
  factoryId?: string;
}
