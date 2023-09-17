import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-buttons',
  templateUrl: './product-buttons.component.html',
  styleUrls: ['./product-buttons.component.css'],
})
export class ProductButtonsComponent {
  isLoading: boolean = false;
  buttonSearch!: string;
  @Output() buttonSearchEvent = new EventEmitter<string>();

  clickSearch(value: string) {
    this.buttonSearch = value;
    this.buttonSearchEvent.emit(this.buttonSearch);
    this.isLoading = true;
  }
}
