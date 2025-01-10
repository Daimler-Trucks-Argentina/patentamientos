export interface SetPwdDto {
  id: string | null;
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}
