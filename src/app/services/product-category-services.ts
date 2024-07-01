import {Component, Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {CreateCategoryDto} from "../dto/create-category-dto";

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryServices {

  constructor(private httpClient: HttpClient) {
  }

  getCategoryList() {
    this.httpClient.get('http://localhost:9000/catalog-services/category?page=0&size=10').subscribe(value => {
      console.log(value)
    })
  }

  createCategory(req: CreateCategoryDto) {
    this.httpClient.post('http://localhost:9000/catalog-services/category', req).subscribe(value => {
      console.log(value)
    })
  }
}
