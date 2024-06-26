import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDataListComponent } from './category-data-list.component';

describe('CategoryDataListComponent', () => {
  let component: CategoryDataListComponent;
  let fixture: ComponentFixture<CategoryDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryDataListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
