export interface CarModelCreateUpdateDto {
  id: string;
  name: string;
  description?: string;
  brandId: string;
  mercedesTerminalId?: string;
  mercedesMarcaId?: string;
  mercedesModeloId?: string;
}
