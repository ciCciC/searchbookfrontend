import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpelRendererComponent } from './simpel-renderer.component';

describe('SimpelRendererComponent', () => {
  let component: SimpelRendererComponent;
  let fixture: ComponentFixture<SimpelRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpelRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpelRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
