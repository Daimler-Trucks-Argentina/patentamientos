import { MatPaginatorIntl } from '@angular/material/paginator';

const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) {
    return `0 de ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

export function getSpanishPaginatorIntl() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Líneas por página:';
  customPaginatorIntl.firstPageLabel = 'Prímera página';
  customPaginatorIntl.lastPageLabel = 'Última página';
  customPaginatorIntl.nextPageLabel = 'Página siguiente';
  customPaginatorIntl.previousPageLabel = 'Página anterior';
  customPaginatorIntl.getRangeLabel = spanishRangeLabel;

  return customPaginatorIntl;
}
