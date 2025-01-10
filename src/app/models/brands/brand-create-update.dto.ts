export interface BrandCreateUpdateDto {
  id: string;
  name: string;
  description: string;
  mercedesTerminalId?: string;
  mercedesMarcaId?: string;
  terminalId: string;
}
