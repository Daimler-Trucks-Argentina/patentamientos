import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable()
export class SweetAlert2Helper {
  TAG = 'SweetAlert2Helper';
  private options: SweetAlert2Options;

  constructor() {
    this.options = new SweetAlert2Options();
  }

  public info(
    title: string,
    description: string,
    callback?: any,
    waitConfirmation?: boolean
  ) {
    if (waitConfirmation) {
      Swal.fire({
        icon: 'info',
        title,
        html: description,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#152a43',
        allowOutsideClick: false,
        heightAuto: false,
      }).then((result) => {
        if (result.value) {
          if (callback) {
            callback();
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'info',
        title,
        html: description,
        timer: this.options.timer.short,
        showConfirmButton: false,
        heightAuto: false,
      }).then(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  public success(
    title: string,
    description: string,
    callback?: any,
    waitConfirmation?: boolean
  ) {
    if (waitConfirmation) {
      Swal.fire({
        icon: 'success',
        title,
        html: description,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#152a43',
        allowOutsideClick: false,
        heightAuto: false,
      }).then((result) => {
        if (result.value) {
          if (callback) {
            callback();
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'success',
        title,
        html: description,
        timer: this.options.timer.short,
        showConfirmButton: false,
        heightAuto: false,
      }).then(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  public error(
    title: string,
    description: string,
    callback?: any,
    waitConfirmation?: boolean
  ) {
    if (waitConfirmation) {
      Swal.fire({
        icon: 'error',
        title,
        html: description,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#152a43',
        allowOutsideClick: false,
        heightAuto: false,
      }).then((result) => {
        if (result.value) {
          if (callback) {
            callback();
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title,
        html: description,
        timer: this.options.timer.short,
        showConfirmButton: false,
        heightAuto: false,
      }).then(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  public warning(
    title: string,
    description: string,
    callback?: any,
    waitConfirmation?: boolean
  ) {
    if (waitConfirmation) {
      Swal.fire({
        icon: 'warning',
        title,
        html: description,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#152a43',
        allowOutsideClick: false,
        heightAuto: false,
      }).then((result) => {
        if (result.value) {
          if (callback) {
            callback();
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title,
        html: description,
        timer: this.options.timer.short,
        showConfirmButton: false,
        heightAuto: false,
      }).then(() => {
        if (callback) {
          callback();
        }
      });
    }
  }

  public question(
    title: string,
    description: string,
    confirmButtonText: string,
    cancelButtonText: string,
    confirmCallback?: any,
    cancelCallback?: any,
    confirmButtonColor?: string,
    cancelButtonColor?: string
  ) {
    Swal.fire({
      icon: 'question',
      title,
      html: description,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor: confirmButtonColor ? confirmButtonColor : '#152a43',
      cancelButtonColor: cancelButtonColor ? cancelButtonColor : '#d40d0d',
      showCancelButton: true,
      backdrop: `rgba(0, 0, 0, 0.2)`,
      allowOutsideClick: false,
      heightAuto: false,
    }).then((result) => {
      if (result.value) {
        if (confirmCallback) {
          confirmCallback();
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (cancelCallback) {
          cancelCallback();
        }
      }
    });
  }

  public question3(
    title: string,
    description: string,
    confirmButtonText: string,
    cancelButtonText: string,
    denyButtonText: string,
    confirmCallback?: any,
    cancelCallback?: any,
    denyCallback?: any,
    confirmButtonColor?: string,
    cancelButtonColor?: string,
    denyButtonColor?: string
  ) {
    Swal.fire({
      icon: 'question',
      title,
      html: description,
      confirmButtonText,
      cancelButtonText,
      denyButtonText,
      confirmButtonColor: confirmButtonColor ? confirmButtonColor : '#152a43',
      cancelButtonColor: cancelButtonColor ? cancelButtonColor : '#d40d0d',
      denyButtonColor: denyButtonColor ? denyButtonColor : '#152a43',
      showCancelButton: true,
      showDenyButton: true,
      backdrop: `rgba(0, 0, 0, 0.2)`,
      allowOutsideClick: false,
      heightAuto: false,
    }).then((result) => {
      console.log(`${this.TAG} > question3 > result`, result);
      if (result.value && result.isConfirmed) {
        if (confirmCallback) {
          confirmCallback();
        }
      }
      if (!result.value && result.isDenied) {
        if (denyCallback) {
          denyCallback();
        }
      }
      if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
        if (cancelCallback) {
          cancelCallback();
        }
      }
    });
  }
}

class SweetAlert2Options {
  timer: Timer;
  confirmButtonColor: string;
  cancelButtonColor: string;

  constructor() {
    this.timer = {
      short: 3000,
      long: 5000,
    };
    this.confirmButtonColor = '#152a43';
    this.cancelButtonColor = '#F44336';
  }
}

class Timer {
  short: number;
  long: number;

  constructor() {
    this.short = 3000;
    this.long = 5000;
  }
}
