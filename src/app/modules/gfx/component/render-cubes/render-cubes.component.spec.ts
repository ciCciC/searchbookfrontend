import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderCubesComponent } from './render-cubes.component';

describe('RenderCubesComponent', () => {
  let component: RenderCubesComponent;
  let fixture: ComponentFixture<RenderCubesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderCubesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderCubesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
