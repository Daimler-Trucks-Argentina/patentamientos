import { v4 as uuidv4 } from 'uuid';

export class Base {
  id: string | null;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
  deletedAt?: Date | null;
  deletedBy?: string | null;

  constructor() {
    this.id = uuidv4();
    this.createdAt = null;
    this.createdBy = null;
    this.updatedAt = null;
    this.updatedBy = null;
    this.deletedAt = null;
    this.deletedBy = null;
  }
}

