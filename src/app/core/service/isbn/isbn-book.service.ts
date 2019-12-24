import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LinkBuilder} from '../../../shared/model/linkbuilder';
import {environment} from '../../../../environments/environment';
import {Page} from '../../../shared/model/page';
import {Isbnbook} from '../../../shared/model/isbnbook';

@Injectable({
  providedIn: 'root'
})
export class IsbnBookService {

  private scrollId: BehaviorSubject<string>;

  constructor(private readonly httpClient: HttpClient) {
    this.scrollId = new  BehaviorSubject(null);
  }

  public getAll(pageIndex: number): Observable<Page<Isbnbook>> {
    return this.httpClient.get<Page<Isbnbook>>(LinkBuilder.build(
      environment.api,
      LinkBuilder.ISBNBOOKS,
      '?page=' + pageIndex));
  }

  public getBookById(id: string): Observable<Isbnbook> {
    return this.httpClient.get<Isbnbook>(LinkBuilder.build(
      environment.api,
      LinkBuilder.BOOK,
      id));
  }

  public searchByTitle(pageIndex: number, title: string): Observable<Page<Isbnbook>> {
    return this.httpClient.get<Page<Isbnbook>>(LinkBuilder.build(
      environment.api,
      LinkBuilder.BOOK,
      LinkBuilder.SEARCH,
      LinkBuilder.TITLE,
      '?q=' + title + '&page=' + pageIndex));
  }

  private genHeader(key: string, value: string): HttpHeaders {
    return new HttpHeaders().set(key, value);
  }
}
