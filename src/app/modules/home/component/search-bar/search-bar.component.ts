import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../../../core/service/auth/auth.service';
import {AmazonService} from '../../../../core/service/amazon/amazon.service';
import {AmazonBook} from '../../../../shared/model/amazonBook';
import {Page} from '../../../../shared/model/page';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, AfterViewInit {

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

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
      if (newValue || newValue.length > 0) {
        this.isFilterEnabled = true;
        this.amazonBookService.setSearchTitle(newValue.trim().toLowerCase());
        this.amazonBookService.resetPageIndex();
        this.amazonBookService.searchByTitle()
          .subscribe(value => {
            this.resultsLength = value.totalSizeIndex;
          });
      } else {
        this.isFilterEnabled = false;
        this.fetch();
      }
    });
  }

  private fetch() {
    this.startLoadingIcon();

    if (this.isFilterEnabled) {
      this.amazonBookService.searchByTitle()
        .subscribe(value => this.processData(value),
          error => this.onError(error),
          () => this.stopLoadingIcon());
    } else {
      this.amazonBookService.getAll()
        .subscribe(value => this.processData(value),
          error => this.onError(error),
          () => this.stopLoadingIcon());
    }
  }

  private processData(data: Page<AmazonBook>) {
    this.stopLoadingIcon();
    this.isRateLimitReached = false;
    this.resultsLength = data.totalSizeIndex;
  }

  private onError(error) {
    this.isLoadingResults = false;
    this.isRateLimitReached = true;
    console.log('error: ' + error);
  }

  private startLoadingIcon() {
    this.isLoadingResults = true;
  }

  private stopLoadingIcon() {
    this.isLoadingResults = false;
  }

  ngAfterViewInit(): void {
    // this.fetch();
  }

  ngOnInit(): void {
    this.fetch();
  }

}
