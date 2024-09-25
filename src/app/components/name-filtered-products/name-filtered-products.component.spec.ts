import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameFilteredProductsComponent } from './name-filtered-products.component';

describe('NameFilteredProductsComponent', () => {
  let component: NameFilteredProductsComponent;
  let fixture: ComponentFixture<NameFilteredProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NameFilteredProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NameFilteredProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
