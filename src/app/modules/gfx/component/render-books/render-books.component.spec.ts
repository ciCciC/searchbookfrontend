import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderBooksComponent } from './render-books.component';

describe('RenderBooksComponent', () => {
  let component: RenderBooksComponent;
  let fixture: ComponentFixture<RenderBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
