import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, ReplaySubject} from 'rxjs';
import {Page} from '../../../shared/model/page';
import {LinkBuilder} from '../../../shared/model/linkbuilder';
import {environment} from '../../../../environments/environment';
import {AmazonBook} from '../../../shared/model/amazonBook';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AmazonService {

  private liveData: ReplaySubject<Page<AmazonBook>>;
  private pageIndex: BehaviorSubject<number>;
  private searchTitle: BehaviorSubject<string>;

  constructor(private readonly httpClient: HttpClient) {
    this.liveData = new ReplaySubject<Page<AmazonBook>>(1);
    this.pageIndex = new BehaviorSubject<number>(0);
    this.searchTitle = new BehaviorSubject<string>('');
  }

  public getAll(): Observable<Page<AmazonBook>> {
    return this.httpClient.get<Page<AmazonBook>>(LinkBuilder.build(
      environment.api,
      LinkBuilder.AMAZONBOOKS,
      '?page=' + this.pageIndex.value))
      .pipe(map(value => {
        this.setLiveData(value);
        return value;
      }));
  }

  public setSearchTitle(q: string) {
    this.searchTitle.next(q);
  }

  public getSearchTitleValue(): string {
    return this.searchTitle.getValue();
  }

  public searchByTitle(): Observable<Page<AmazonBook>> {
    return this.httpClient.get<Page<AmazonBook>>(LinkBuilder.build(
      environment.api,
      LinkBuilder.AMAZONBOOKS,
      LinkBuilder.SEARCH,
      LinkBuilder.TITLE,
      '?q=' + this.searchTitle.value + '&page=' + this.pageIndex.value))
      .pipe(map(value => {
        this.setLiveData(value);
        return value;
      }));
  }

  public setLiveData(amazonBooks: Page<AmazonBook>) {
    this.liveData.next(amazonBooks);
  }

  public getLiveData(): Observable<Page<AmazonBook>> {
    return this.liveData.asObservable();
  }

  public getPageIndexValue(): number {
    return this.pageIndex.getValue();
  }

  public getPageIndex(): Observable<number> {
    return this.pageIndex.asObservable();
  }

  public nextPage() {
    this.pageIndex.next(this.pageIndex.value + 1);
  }

  public previousPage() {
    if (this.pageIndex.value > 0) {
      this.pageIndex.next(this.pageIndex.value - 1);
    }
  }

  public resetPageIndex() {
    this.pageIndex.next(0);
  }

  public setPageIndex(value: number) {
    this.pageIndex.next(value);
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
