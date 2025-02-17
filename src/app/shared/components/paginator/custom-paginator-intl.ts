import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `Página 1 de 1`;
    }
    const totalPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${totalPages}`;
  };
}
