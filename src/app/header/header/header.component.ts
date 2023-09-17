import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  searchValue: string = '';
  @Output() formEvent = new EventEmitter<string>();

  onSearch(form: NgForm) {
    this.formEvent.emit(form.value.searchfield);
    this.searchValue = '';
  }
}
