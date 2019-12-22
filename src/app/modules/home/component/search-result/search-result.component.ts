import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {Book} from '../../../../shared/model/book';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../../../core/service/auth/auth.service';
import {IsbnBookService} from '../../../../core/service/isbn/isbn-book.service';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {AmazonService} from '../../../../core/service/amazon/amazon.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements AfterViewInit {

  displayedColumns: string[] = ['title', 'authors'];
  dataSource = new MatTableDataSource<Book>();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageSize = 30;

  search: FormControl;
  filter: FormControl;

  filterProp: string[] = ['title', 'authors', 'tags'];

  isFilterEnabled = false;

  pageEvent: PageEvent;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  // @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private readonly authService: AuthService,
              private readonly amazonBookService: AmazonService) {
    this.search = new FormControl('');
    this.filter = new FormControl();
    this.applyFilter();
  }

  private applyFilter() {
    this.search.valueChanges.subscribe((newValue: string)  => {
      if (newValue) {
        this.isFilterEnabled = true;
        this.amazonBookService.searchByTitle(0, newValue.trim().toLowerCase())
          .subscribe(value => {
            this.resultsLength = value.totalSizeIndex;
            this.dataSource.data = value.dataDtos;
          });
      } else {
        this.isFilterEnabled = false;
        this.fetchData();
      }
    });
  }

  private fetchData() {
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          if (this.isFilterEnabled) {
            return this.amazonBookService.searchByTitle(this.pageEvent.pageIndex, this.search.value.trim().toLowerCase());
          } else {
            return this.amazonBookService.getAll(this.paginator.pageIndex);
          }
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalSizeIndex;
          return data.dataDtos;
        }),
        catchError((error) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          console.log('error: ' + error);
          return of([]);
        })
      ).subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.fetchData();
  }

}
