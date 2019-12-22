import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from '../../../shared/model/page';
import {LinkBuilder} from '../../../shared/model/linkbuilder';
import {environment} from '../../../../environments/environment';
import {Amazonbook} from '../../../shared/model/amazonbook';

@Injectable({
  providedIn: 'root'
})
export class AmazonService {

  constructor(private readonly httpClient: HttpClient) {
  }

  public getAll(pageIndex: number): Observable<Page<Amazonbook>> {
    return this.httpClient.get<Page<Amazonbook>>(LinkBuilder.build(
      environment.api,
      LinkBuilder.AMAZONBOOKS,
      '?page=' + pageIndex));
  }

  public searchByTitle(pageIndex: number, title: string): Observable<Page<Amazonbook>> {
    return this.httpClient.get<Page<Amazonbook>>(LinkBuilder.build(
      environment.api,
      LinkBuilder.AMAZONBOOKS,
      LinkBuilder.SEARCH,
      LinkBuilder.TITLE,
      '?q=' + title + '&page=' + pageIndex));
  }
}
