import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { FileType } from 'src/app/models/fileTypes/fileType.model';
import { BaseService } from '../base.service';
import { BaseResponse } from 'src/app/models/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class FileTypeService extends BaseService<FileType> {
  private readonly controller = 'FileTypes';
  private entitiesBehaviorSubject: BehaviorSubject<FileType[]>;
  public entitiesObservable: Observable<FileType[]>;
  private entityBehaviorSubject: BehaviorSubject<FileType | null>;
  public entityObservable: Observable<FileType | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Companies');
    this.entitiesBehaviorSubject = new BehaviorSubject<FileType[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<FileType | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): FileType[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: FileType[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): FileType | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: FileType | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<FileType[]> {
    const url: string = `${this.controller}/all`;
    return this.HttpClient.get<BaseResponse<FileType>>(url).pipe(
      map((response) => {
        let entities: FileType[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
