import { Base } from '../base.model';
import { File } from '../files/file.model';

export class FileType extends Base {
  autoId: number | null;
  name: string;
  description: string;
  files?: File[];

  constructor() {
    super();
    this.autoId = 0;
    this.name = '';
    this.description = '';
  }
}
