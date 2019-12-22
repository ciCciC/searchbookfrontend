import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../../../core/service/auth/auth.service';
import {AmazonService} from '../../../../core/service/amazon/amazon.service';
import {Observable, of} from 'rxjs';
import {Amazonbook} from '../../../../shared/model/amazonbook';
import {Page} from '../../../../shared/model/page';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, AfterViewInit {

  @Output()
  dataSource = new EventEmitter<Observable<Amazonbook[]>>();

  resultsLength = 0;
  pageIndex = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageSize = 30;

  search: FormControl;
  filter: FormControl;

  filterProp: string[] = ['title', 'authors', 'tags'];
  isFilterEnabled = false;

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
            this.dataSource.emit(of(value.dataDtos));
          });
      } else {
        this.isFilterEnabled = false;
        this.fetch();
      }
    });
  }

  private fetch() {
    this.isLoadingResults = true;

    if (this.isFilterEnabled) {
      this.amazonBookService.searchByTitle(this.pageIndex, this.search.value.trim().toLowerCase())
        .subscribe(value => this.processData(value),
          error => this.onError(error));
    } else {
      this.amazonBookService.getAll(this.pageIndex)
        .subscribe(value => this.processData(value),
            error => this.onError(error));
    }
  }

  private processData(data: Page<Amazonbook>) {
    this.isLoadingResults = false;
    this.isRateLimitReached = false;
    this.resultsLength = data.totalSizeIndex;
    this.dataSource.emit(of(data.dataDtos));
  }

  private onError(error) {
    this.isLoadingResults = false;
    this.isRateLimitReached = true;
    console.log('error: ' + error);
  }

  nextPage() {
    this.pageIndex++;
  }

  previousPage() {
    this.pageIndex--;
  }


  ngAfterViewInit(): void {
    // this.fetch();
  }

  ngOnInit(): void {
    this.fetch();
  }

}
