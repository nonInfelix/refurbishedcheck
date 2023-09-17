import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'refurbishedcheck';
  products!: any;
  isLoading: boolean = false;

  search!: string;
  private productSubscription!: Subscription;

  constructor(private productservice: ProductService) {}

  getData() {
    this.isLoading = true;
    this.productSubscription = this.productservice
      .getProducts(this.search)
      .subscribe((data) => {
        this.products = data;
        console.log(this.products);
        this.isLoading = false;
      });
  }
  onSearch(searchterm: string) {
    this.search = searchterm;
    console.log('app-comp: ', this.search);
    this.getData();
  }
  ngOnInit() {}

  ngOnDestroy(): void {
    this.productSubscription.unsubscribe();
  }
}
