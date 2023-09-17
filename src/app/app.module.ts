import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header/header.component';
import { ProductCardComponent } from './product-card/product-card/product-card.component';
import { ProductButtonsComponent } from './product-buttons/product-buttons/product-buttons.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, ProductCardComponent, ProductButtonsComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
