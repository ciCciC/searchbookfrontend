import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, ReplaySubject} from 'rxjs';
import {Page} from '../../../shared/model/page';
import {LinkBuilder} from '../../../shared/model/linkbuilder';
import {environment} from '../../../../environments/environment';
import {AmazonBook} from '../../../shared/model/amazonBook';

@Injectable({
  providedIn: 'root'
})
export class AmazonService {

  private liveData: ReplaySubject<AmazonBook[]>;

  constructor(private readonly httpClient: HttpClient) {
    this.liveData = new ReplaySubject<AmazonBook[]>(1);
  }

  public getAll(pageIndex: number): Observable<Page<AmazonBook>> {
    return this.httpClient.get<Page<AmazonBook>>(LinkBuilder.build(
      environment.api,
      LinkBuilder.AMAZONBOOKS,
      '?page=' + pageIndex));
  }

  public searchByTitle(pageIndex: number, title: string): Observable<Page<AmazonBook>> {
    return this.httpClient.get<Page<AmazonBook>>(LinkBuilder.build(
      environment.api,
      LinkBuilder.AMAZONBOOKS,
      LinkBuilder.SEARCH,
      LinkBuilder.TITLE,
      '?q=' + title + '&page=' + pageIndex));
  }

  public setLiveData(amazonBooks: AmazonBook[]) {
    this.liveData.next(amazonBooks);
  }

  public getLiveData(): Observable<AmazonBook[]> {
    return this.liveData.asObservable();
  }

  public getAllMock(): Observable<Page<AmazonBook>> {
    const page: Page<AmazonBook> = {
      totalSizeIndex: 30,
      dataDtos: []
    };

    for (let i = 0; i < 30; i++) {
      const amazonbook: AmazonBook = {
        title: 'Life Lessons of The Bear - ' + i,
        authors: [ {name: 'Gus Lee'}],
        isbn: '1588345297',
        imgUrl: 'http://ecx.images-amazon.com/images/I/51l6XIoa3rL.jpg',
        tags: ['Biographies', 'Memoirs']
      };
      page.dataDtos.push(amazonbook);
    }

    return of(page);
  }
}
