import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(search: string) {
    return this.http.get(`http://localhost:3000/api/data?search=${search}`);
  }
}
