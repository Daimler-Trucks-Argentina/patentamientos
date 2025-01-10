export interface TmmvCreateUpdateDto {
  id: string | null;
  versionPatentamiento?: string;
  versionWs?: string;
  versionInterna?: string;
  descripcionTerminal?: string;
  descripcionMarca?: string;
  descripcionModelo?: string;
  descripcionVerPat?: string;
  descripcionVerWs?: string;
  descripcionVerInt?: string;
  carModelId?: string;
  mercedesTerminalId?: string;
  mercedesMarcaId?: string;
  mercedesModeloId?: string;
}
