import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { TerminalCreateUpdateDto } from 'src/app/models/terminals/terminal-create-update.dto';
import { Terminal } from 'src/app/models/terminals/terminal.model';
import { BaseService } from '../base.service';

@Injectable()
export class TerminalService extends BaseService<Terminal> {
  TAG = TerminalService.name;
  private readonly controller = 'Terminals';
  private entitiesBehaviorSubject: BehaviorSubject<Terminal[]>;
  public entitiesObservable: Observable<Terminal[]>;
  private entityBehaviorSubject: BehaviorSubject<Terminal | null>;
  public entityObservable: Observable<Terminal | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Terminals');
    this.entitiesBehaviorSubject = new BehaviorSubject<Terminal[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Terminal | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Terminal[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Terminal[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Terminal | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Terminal | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Terminal[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Terminal>>(url).pipe(
      map((response) => {
        let entities: Terminal[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }

  public create(
    terminalCreateDto: TerminalCreateUpdateDto
  ): Observable<Terminal | null> {
    const url: string = `${this.controller}/create`;
    return this.HttpClient.post<BaseResponse<Terminal>>(url, terminalCreateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public update(
    terminalUpdateDto: TerminalCreateUpdateDto
  ): Observable<Terminal | null> {
    const url: string = `${this.controller}/update`;
    return this.HttpClient.put<BaseResponse<Terminal>>(url, terminalUpdateDto).pipe(
      map((response) => {
        if (response.statusCode !== 200) {
          return null;
        }
        return response.result;
      })
    );
  }

  public deleteCache(id: string, callback?: any) {
    const url: string = `${this.controller}/delete-cache/${id}`;
    return this.HttpClient.delete(url).pipe(
      map((response) => {
        if (callback) {
          callback(response);
        }
      })
    );
  }
}
