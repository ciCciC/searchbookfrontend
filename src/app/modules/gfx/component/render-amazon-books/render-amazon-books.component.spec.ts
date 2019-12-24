import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderAmazonBooksComponent } from './render-amazon-books.component';

describe('RenderAmazonBooksComponent', () => {
  let component: RenderAmazonBooksComponent;
  let fixture: ComponentFixture<RenderAmazonBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderAmazonBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderAmazonBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
