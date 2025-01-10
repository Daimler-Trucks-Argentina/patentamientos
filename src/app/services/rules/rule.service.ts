import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/base-response.model';
import { Rule } from 'src/app/models/rules/rule.model';
import { BaseService } from '../base.service';

@Injectable()
export class RuleService extends BaseService<Rule> {
  TAG = RuleService.name;
  private readonly controller = 'Rules';
  private entitiesBehaviorSubject: BehaviorSubject<Rule[]>;
  public entitiesObservable: Observable<Rule[]>;
  private entityBehaviorSubject: BehaviorSubject<Rule | null>;
  public entityObservable: Observable<Rule | null>;

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'Rules');
    this.entitiesBehaviorSubject = new BehaviorSubject<Rule[]>([]);
    this.entitiesObservable = this.entitiesBehaviorSubject.asObservable();
    this.entityBehaviorSubject = new BehaviorSubject<Rule | null>(null);
    this.entityObservable = this.entityBehaviorSubject.asObservable();
  }

  public get entities(): Rule[] {
    return this.entitiesBehaviorSubject.value;
  }

  public setEntities(entities: Rule[]): void {
    this.entitiesBehaviorSubject.next(entities);
  }

  public get entity(): Rule | null {
    return this.entityBehaviorSubject.value;
  }

  public setEntity(entity: Rule | null): void {
    this.entityBehaviorSubject.next(entity);
  }

  public override getAll(): Observable<Rule[]> {
    const url: string = `${this.controller}/all2`;
    return this.HttpClient.get<BaseResponse<Rule>>(url).pipe(
      map((response) => {
        let entities: Rule[] = [];
        if (response.statusCode === 200) {
          entities = response.results;
        }
        this.setEntities(entities);
        return entities;
      })
    );
  }
}
