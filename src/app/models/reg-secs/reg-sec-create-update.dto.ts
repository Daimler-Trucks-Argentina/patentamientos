export interface RegSecCreateUpdateDto {
  id: string;
  name: string;
  description?: string;
  registryNumber?: string;
  registryProvince?: string;
  registryDepartment?: string;
  registryLocation?: string;
  autoZoneDealer?: string;
  autoZoneDescription?: string;
  truckZoneDealer?: string;
  truckZoneDescription?: string;
  vanZoneDealer?: string;
  vanZoneDescription?: string;
}
