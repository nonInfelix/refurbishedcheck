import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductButtonsComponent } from './product-buttons.component';

describe('ProductButtonsComponent', () => {
  let component: ProductButtonsComponent;
  let fixture: ComponentFixture<ProductButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductButtonsComponent]
    });
    fixture = TestBed.createComponent(ProductButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
