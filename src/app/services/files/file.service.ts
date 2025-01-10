import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../base.service';
import { BaseResponse } from 'src/app/models/base-response.model';
import { File } from 'src/app/models/files/file.model';
import { FileCreateDto } from 'src/app/models/files/fileCreateDto.model';

@Injectable({
  providedIn: 'root',
})
export class FileService extends BaseService<File> {
  private readonly controller = 'Files';
  private entitiesBehaviorSubject: BehaviorSubject<File[]>;
  public entitiesObservable: Observable<File[]>;
  private entityBehaviorSubject: BehaviorSubject<File | null>;
  public entityObservable: Observable<File | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Files');
    this.entitiesBehaviorSubject = new BehaviorSubject<File[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<File | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): File[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: File[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): File | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: File | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<File[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<File>>(url).pipe(
      map((response) => {
        let entities: File[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(fileCreateDto: FileCreateDto): Observable<File | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<File>>(url, fileCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public createAsync(fileCreateDto: FileCreateDto): Observable<File | null> {
    const url: string = `${this.controller}/async/create`;
    return this.HttpClient.post<BaseResponse<File>>(url, fileCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public update(fileCreateDto: FileCreateDto): Observable<File | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<File>>(url, fileCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public override delete(id: string) {
    return super.delete(id, (response: number | null) => {
      const index = this.entities.findIndex((e) => e.id == id);
      if (index >= 0) {
        this.entities.splice(index, 1);
        this.setEntities(this.entities);
      }
    });
  }

  public deleteFile(fileId: string): Observable<File | null> {
    const url: string = `${this.controller}/delete-file?fileId=${fileId}`;
    return this.HttpClient.delete<BaseResponse<File>>(url).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public getByFileId(fileId: string): Observable<File | null> {
    const url: string = `${this.controller}/getByFileId?fileId=${fileId}`;
    return this.HttpClient.get<BaseResponse<File>>(url).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }


  public processByFileId(fileId: string, fileTypeId: string, wsID?: string): Observable<any | null> {
    const url: string = `Patentings/process-by-fileId?fileId=${fileId}&fileTypeId=${fileTypeId}&wsID=${wsID}`;
    return this.HttpClient.get<BaseResponse<any>>(url).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }
}
