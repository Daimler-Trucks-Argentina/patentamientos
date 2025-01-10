import { Component, Inject } from '@angular/core';
import { TerminalCreateUpdateDto } from 'src/app/models/terminals/terminal-create-update.dto';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { v4 as uuidv4 } from 'uuid';
import { TerminalService } from 'src/app/services/terminals/terminal.service';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { SweetAlert2Helper } from 'src/app/core/helpers/sweet-alert-2.helper';
import { Toast } from 'src/app/core/helpers/sweetAlert.helper';
import { ActionMode } from 'src/app/models/action-mode.enum';
export interface DialogData {
  terminal: Terminal;
  terminalId: string;
  terminals: Terminal[];
}
@Component({
  selector: 'app-terminal-dialog',
  templateUrl: './terminal-dialog.component.html',
  styleUrls: ['./terminal-dialog.component.scss'],
})
export class TerminalDialogComponent {
  TAG = 'TerminalDialogComponent';
  isXsOrSm = false;
  formGroup: FormGroup;
  ActionMode = ActionMode;
  actionMode = ActionMode.create;
  loading = false;
  accept = 'Guardar';
  private unsubscribeAll: Subject<any> = new Subject();
  terminal: Terminal = new Terminal();
  terminals: Terminal[] = [];

  constructor(
    private dialogRef: MatDialogRef<TerminalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public terminalService: TerminalService,
    public breakpointObserver: BreakpointObserver,
    private sweetAlert: SweetAlert2Helper
  ) {
    this.terminal = data.terminal;
    this.terminals = data.terminals;
    console.log(`${this.TAG} > constructor > this.terminal`, this.terminal);
    if (this.terminal.id) {
      this.actionMode = ActionMode.update;
      this.formGroup = this.createFormGroup();
    } else {
      this.actionMode = ActionMode.create;
      this.formGroup = this.createFormGroup();
    }
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((state: BreakpointState) => {
        console.log(
          `${this.TAG} > ngOnInit > breakpointObserver > state`,
          state
        );
        if (state.matches) {
          this.isXsOrSm = true;
        } else {
          this.isXsOrSm = false;
        }
      });
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      mercedesTerminalId: [
        {
          value: this.terminal.mercedesTerminalId ?? null,
          disabled: this.actionMode === ActionMode.update ? true : false,
        },
        [Validators.required, Validators.maxLength(3)],
      ],
      name: [
        {
          value: this.terminal.name ?? null,
          disabled: false,
        },
        [],
      ],
      description: [
        {
          value: this.terminal.description ?? null,
          disabled: false,
        },
        [Validators.required],
      ],
    });
    return formGroup;
  }

  compareFn(v1: any, v2: any): boolean {
    return v1 && v2 ? v1.id === v2.id : v1 === v2;
  }

  searchComparisonFn = (searchTerm: string, option: { codName: string }): boolean => { 
    return option.codName.toLowerCase().includes(searchTerm.toLowerCase());
  };

  save() {
    this.loading = true;
    this.accept = '';
    const rawValue = this.formGroup.getRawValue();
    console.log(`${this.TAG} > save > rawValue`, rawValue);
    const createDto: TerminalCreateUpdateDto = {
      id: this.terminal.id ?? uuidv4(),
      mercedesTerminalId: rawValue.mercedesTerminalId,
      name: rawValue.description,
      description: rawValue.description,
    };
    if (this.actionMode === ActionMode.create) {
      this.create(createDto);
    }
    if (this.actionMode === ActionMode.update) {
      this.update(createDto);
    }
  }

  create(createDto: TerminalCreateUpdateDto): void {
    this.terminalService.create(createDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Terminal guardado con éxito!',
        });
      },
      error: (err) => {
        this.loading = false;
        this.accept = 'Guardar';
        console.error(`${this.TAG} > save > create > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }

  update(updateDto: TerminalCreateUpdateDto): void {
    this.terminalService.update(updateDto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
        Toast.fire({
          icon: 'success',
          title: '¡Terminal actualizado con éxito!',
        });
      },
      error: (err) => {
        this.loading = false;
        this.accept = 'Guardar';
        console.error(`${this.TAG} > save > update > err`, err);
        const error = ErrorHelper.getErrorMessage(err);
        this.sweetAlert.error('Ha ocurrido un error!', error, null, true);
      },
    });
  }
}
