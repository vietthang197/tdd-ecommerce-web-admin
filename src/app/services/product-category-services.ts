import {Component, Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {CreateCategoryDto} from "../dto/create-category-dto";
import {Observable} from "rxjs";
import {ProductCategoryDto} from "../dto/product-category-dto";
import {ResponseData} from "../dto/ResponseData";
import {ResponseDataPagination} from "../dto/ResponseDataPagination";

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryServices {

  constructor(private httpClient: HttpClient) {
  }

  getCategoryList(): Observable<ResponseDataPagination<ProductCategoryDto>> {
    return this.httpClient.get<ResponseDataPagination<ProductCategoryDto>>('http://localhost:9000/catalog-services/category?page=0&size=10');
  }

  createCategory(req: CreateCategoryDto) {
    return this.httpClient.post('http://localhost:9000/catalog-services/category', req);
  }
}
