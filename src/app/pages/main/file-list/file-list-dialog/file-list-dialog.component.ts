import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
import { ClosureCreateDto } from 'src/app/models/closures/closure-create.dto';
import { Closure } from 'src/app/models/closures/closure.model';
import { FileType } from 'src/app/models/fileTypes/fileType.model';
import { File } from 'src/app/models/files/file.model';
import { FileCreateDto } from 'src/app/models/files/fileCreateDto.model';
import { ClosureService } from 'src/app/services/closures/closure.service';
import { FileTypeService } from 'src/app/services/fileTypes/fileType.service';
import { FileService } from 'src/app/services/files/file.service';
import { InternalVersionService } from 'src/app/services/internal-versions/internal-version.service';
import Swal from 'sweetalert2';

export interface DialogData {
  file: File;
  files: File[];
  closure: Closure;
  closures: Closure[];
}

@Component({
  selector: 'app-file-list-dialog',
  templateUrl: './file-list-dialog.component.html',
  styleUrls: ['./file-list-dialog.component.scss'],
})
export class FileListDialogComponent implements OnInit, OnDestroy {
  TAG = 'FileListDialogComponent';
  private unsubscribeAll: Subject<any> = new Subject();
  formGroup: FormGroup;
  fileName = 'Archivo';
  file: File;
  files: File[] = [];
  closure: Closure;
  closures: Closure[];
  lastCutDate: Date;
  fechaCorte: string;
  endCutDate: Date;
  getYearArray: Date[];
  yearDate: string[] = [];
  fileSelected: any;
  fileBase64: any;
  showError = false;
  loading = false;
  accept = 'Subir';
  fileTypes: FileType[] = [];
  dailyType: string = '00000000-0000-0000-0000-000000000010';
  monthType: string = '00000000-0000-0000-0000-000000000030';
  wholesaleType: string = '00000000-0000-0000-0000-000000000020';
  specialWholesaleType: string = '00000000-0000-0000-0000-000000000040';
  historicalType: string = '00000000-0000-0000-0000-000000000050';
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  rewrite = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FileListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fileTypeService: FileTypeService,
    private fileService: FileService,
    private closureService: ClosureService,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.file = data.file;
    this.files = data.files;
    this.closure = data.closure;
    this.closures = data.closures;
    this.fechaCorte = this.closure.fechaCorte!.toString().split('T')[0];
    this.lastCutDate = new Date(this.closure.fechaCorte!);
    this.endCutDate = new Date(this.closure.fechaCorte!);
    this.endCutDate.setMonth(this.endCutDate.getMonth() + 12);
    this.getYearArray = this.getDateArray(
      new Date(
        this.lastCutDate.getFullYear(),
        this.lastCutDate.getMonth() + 1,
        1
      ),
      this.endCutDate
    );
    this.getYearArray.forEach((y) => {
      const year = y.toISOString().split('T')[0];
      this.yearDate.push(year);
    });
    console.log('this.lastCutDate', this.lastCutDate);
    console.log('this.endCutDate', this.endCutDate);
    console.log(`${this.TAG} > constructor > this.file`, this.file);
    console.log(`${this.TAG} > constructor > this.closure`, this.closure);
    if (this.file.id) {
      this.actionMode = ActionMode.update;
      this.formGroup = this.createFormGroup();
    } else {
      this.actionMode = ActionMode.create;
      this.formGroup = this.createFormGroup();
    }
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll?.next(null);
    this.unsubscribeAll?.complete();
  }

  getEndDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    console.log(event.value?.toISOString());
  }

  createFormGroup(): FormGroup {
    // Obtén la hora actual
    const currentDatetr = this.closure.fechaCorte?.toString();
    const currentDate = new Date(currentDatetr!!);
    // Suma 3 horas al objeto Date actual
    currentDate.setHours(currentDate.getHours() + 3);
    console.log(currentDate);
    const formGroup = this.formBuilder.group({
      cutDate: [
        {
          value: currentDate ?? new Date(),
          disabled: false,
        },
        [],
      ],
      fileType: [this.file.fileTypeID ?? null, Validators.required],
      day: [
        this.file.day ?? new Date().getDate(),
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ]),
      ],
      month: [
        this.file.month ?? new Date().getMonth() + 1,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ]),
      ],
      year: [
        this.file.year ?? new Date().getFullYear(),
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(4),
        ]),
      ],
      file: [this.file.name ?? null, Validators.required],
    });
    return formGroup;
  }

  getData(): void {
    const $combineLatest = combineLatest([this.fileTypeService.getAll()]);
    $combineLatest.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: ([fileTypes]) => {
        console.log(`${this.TAG} > getData > fileTypes`, fileTypes);
        this.fileTypes = fileTypes;
        console.log(this.fileTypes)
      },
      error: (err) => {
        console.error(`FileListDialog > getData > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  myFilter = (d: Date | null): boolean => {
    const allowedDates = this.closures.map(
      (c) => c.fechaCorte?.toString().split('T')[0]
    );
    const day = d?.toISOString().split('T')[0];
    return allowedDates.includes(day) || this.yearDate.includes(day!);
  };

  save() {
    this.loading = true;
    this.accept = '';
    const rawValue = this.formGroup.getRawValue();
    const formData = new FormData();
    formData.append('fileUpload', this.fileSelected, this.fileSelected.name);
    const createDto: FileCreateDto = {
      id: '',
      name: this.fileName,
      status: 'Procesando',
      recordQuantity: '0',
      url: '0',
      date: new Date(rawValue.year, rawValue.month - 1, rawValue.day).toISOString(),
      day: rawValue.day,
      month: rawValue.month,
      year: rawValue.year,
      fileTypeID: rawValue.fileType,
      fileUpload: this.fileBase64,
    };
    const nowDate = new Date();
    const closureDto: ClosureCreateDto = {
      id: '',
      fechaCorte: rawValue.cutDate,
      fechaCreacion: nowDate,
      horaCreacion: `${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`,
      esUltimo: true,
    };
    console.log('createDto', createDto);
    console.log('closureDto', closureDto);
    console.log('ORIGINAL CUTDATE', this.fechaCorte);
    if (closureDto.fechaCorte) {
      console.log('DTO CUTDATE', closureDto.fechaCorte!.toISOString().split('T')[0]);
      console.log('did cutDate change?: ', this.fechaCorte != closureDto.fechaCorte!.toISOString().split('T')[0]);
    }
    if (this.actionMode === ActionMode.create) {
      this.create(createDto, closureDto);
    }
    if (this.actionMode === ActionMode.update) {
        this.update(createDto, closureDto);
      }
  }

  create(createDto: FileCreateDto, closureDto: ClosureCreateDto): void {
    Toast.fire({
      icon: 'info',
      title: `Subiendo archivo.`,
      html: `El archivo ${createDto.name} se está procesando. Por favor, no cierre la ventana.`,
      timer: 10000,
    });
    this.fileService.createAsync(createDto).subscribe({
      next: (response) => {
        if (
          createDto.fileTypeID !== this.wholesaleType &&
          createDto.fileTypeID !== this.specialWholesaleType &&
          createDto.fileTypeID !== this.historicalType
        ) {
          const closureDate = closureDto
            .fechaCorte!.toISOString()
            .split('T')[0];
          if (this.fechaCorte != closureDate) {
            this.closureService.create(closureDto).subscribe({
              next: (response) => {
                console.log(response);
              },
              error: (err) => {
                this.loading = false;
                this.accept = 'Subir';
                console.error(`${this.TAG} > save > createAsync > err`, err);
                const error = ErrorHelper.getErrorMessage(err);
                this.sweetAlert.error(
                  'Ha ocurrido un error!',
                  error,
                  null,
                  true
                );
              },
            });
          }
        }
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Archivo guardado con éxito!',
        });
      },
      error: (err) => {
        this.loading = false;
        this.accept = 'Subir';
        console.error(`${this.TAG} > save > createAsync > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }


  update(createDto: FileCreateDto, closureDto: ClosureCreateDto): void {
    this.fileService.update(createDto).subscribe({
      next: (response) => {
        this.closureService.create(closureDto).subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (err) => {
            this.loading = false;
            this.accept = 'Subir';
            console.error(`${this.TAG} > save > createAsync > err`, err);
            const error = ErrorHelper.getErrorMessage(err);
            this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
          },
        });
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Archivo actualizado con éxito!',
        });
      },
      error: (err) => {
        this.loading = false;
        this.accept = 'Subir';
        console.error(`${this.TAG} > save > update > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  importFile(file: any) {
    console.log("Id: ", file)
    let fileUploaded = file.target.files[0];
    this.fileSelected = fileUploaded;
    const fileName: string = fileUploaded.name;

    this.formGroup.get('fileType')?.disable();
    // const currentDatetr = this.closure.fechaCorte?.toString();
    // const currentDate = new Date(currentDatetr!!);
    // currentDate.setHours(currentDate.getHours() + 3);
    switch (true) {
      case fileName.startsWith('IIM'):
        this.formGroup.get('cutDate')?.enable();
        // this.formGroup.get('cutDate')?.setValue(currentDate);
        this.formGroup.controls['fileType']?.setValue(
          '00000000-0000-0000-0000-000000000030'
        );
        break;
      case fileName.startsWith('WSAD'):
        this.formGroup.controls['fileType']?.setValue(
          '00000000-0000-0000-0000-000000000020'
        );
        this.formGroup.get('cutDate')?.disable();
        this.formGroup.get('cutDate')?.setValue(null);
        break;
      case fileName.startsWith('II'):
        this.formGroup.get('cutDate')?.enable();
        // this.formGroup.get('cutDate')?.setValue(currentDate);
        this.formGroup.controls['fileType']?.setValue(
          '00000000-0000-0000-0000-000000000010'
        );
        break;
      case fileName.startsWith('SWSAD'):
        this.formGroup.controls['fileType']?.setValue(
          '00000000-0000-0000-0000-000000000040'
        );
        this.formGroup.get('cutDate')?.disable();
        this.formGroup.get('cutDate')?.setValue(null);
        break;
      case fileName.startsWith('HIST'):
        this.formGroup.controls['fileType']?.setValue(
          '00000000-0000-0000-0000-000000000050'
        );
        this.formGroup.get('cutDate')?.disable();
        this.formGroup.get('cutDate')?.setValue(null);
        break;
      default:
        this.formGroup.get('cutDate')?.enable();
        this.formGroup.get('fileType')?.enable();
        this.sweetAlert.error(
          '¡Ha ocurrido un error!',
          `El archivo debe subirse con el siguiente nombre: <br />
          Diario: "<strong>II</strong>AAMMDD.csv" <br />
          Mensual: "<strong>IIM</strong>MAAMML.csv" - Ejemplo: IIM2309X.csv <br />
          Venta: "<strong>WSAD</strong>AAMMDD.csv" <br />
          Ventas Especiales: "<strong>SWSAD</strong>AAMMDD.csv" <br /><br />
          <h1 style="font-size: 13px;"><i>AA = últimos dos dígitos de año / MM = mes / DD = día / L = letras de A a Z.</i></h1>`,
          null,
          true
        );
        this.fileSelected = null;
        return;
    }

    const fileExists = this.files.find((f) => f.name == fileName);
    if (fileExists) {
      if (fileName.startsWith('IIM')) {
        Swal.fire({
          title: '¡Advertencia!',
          text: 'El archivo que intenta subir ya existe. ¿Desea sobrescribirlo?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sobrescribir',
          cancelButtonText: 'Cancelar',
          backdrop: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.Delete(fileExists.id!);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            console.log('El usuario decidió no sobrescribir el archivo.');
            this.fileSelected = null;
            this.dialogRef.close();
            return;
          }
        });
      }
      else {
        this.sweetAlert.error(
          '¡Ha ocurrido un error!',
          `El archivo mensual que intenta subir ya existe. Intente con otro.`,
          null,
          true
        );
        this.fileSelected = null; 
        return;
      }
    }
    const extensionName = fileUploaded.name.substr(fileUploaded.name.lastIndexOf('.')).toLowerCase();
    if (extensionName == '.xls' || extensionName == '.xlsx' || extensionName == '.csv') {
      const reader = new FileReader();
      reader.readAsDataURL(fileUploaded);
      console.log(reader);

      reader.onload = () => {
        fileUploaded.fileAsBase64 = reader.result;
        this.fileBase64 = fileUploaded.fileAsBase64;
        this.fileName = fileUploaded.name;
        this.formGroup.get('file')?.setValue(this.fileName);
      };
    } else {
      this.sweetAlert.error(
        '¡Ha ocurrido un error!',
        'Solo se permiten archivos de tipo .xls, .xlsx y .csv.',
        null,
        true
      );
    }
  }

  Delete(fileId: string): void {
    this.loading = true;
    this.accept = '';
    this.fileService.deleteFile(fileId).subscribe({
      next: () => {
        this.loading = false;
        this.accept = 'Subir';
        Swal.fire({
          title: 'Archivo borrado correctamente',
          text: 'Presione Ok para continuar',
          icon: 'success',
          confirmButtonText: 'Ok',
          backdrop: false
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('El usuario decidió sobrescribir el archivo.');
            this.rewrite = true;
            this.save();
          }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error(`${this.TAG} > delete > error`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error al borrar!', error, null, true);
      },
    });
  }

  getDateArray(start: Date, end: Date) {
    let arr = [];
    let dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }
}
