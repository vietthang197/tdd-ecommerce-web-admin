import {Component, Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {CreateCategoryDto} from "../dto/create-category-dto";
import {Observable} from "rxjs";
import {ProductCategoryDto} from "../dto/product-category-dto";
import {ResponseData} from "../dto/response-data";
import {ResponseDataPagination} from "../dto/response-data-pagination";
import {DeleteEntityDto} from "../dto/delete-entity-dto";
import {UpdateCategoryDto} from "../dto/update-category-dto";

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryServices {

  constructor(private httpClient: HttpClient) {
  }

  getCategoryList(page: number, size: number): Observable<ResponseDataPagination<ProductCategoryDto>> {
    return this.httpClient.get<ResponseDataPagination<ProductCategoryDto>>('http://localhost:9000/catalog-services/category/paging', {
      params: {
        page: page,
        size: size
      }
    });
  }

  createCategory(req: CreateCategoryDto) {
    return this.httpClient.post<ResponseData<any>>('http://localhost:9000/catalog-services/category', req);
  }

  findAll(): Observable<ResponseData<ProductCategoryDto[]>> {
    return this.httpClient.get<ResponseData<ProductCategoryDto[]>>('http://localhost:9000/catalog-services/category/all');
  }

  deleteListCategory(req: DeleteEntityDto) {
    return this.httpClient.delete<ResponseData<any>>('http://localhost:9000/catalog-services/category', {
      body: req
    });
  }

  getDetailCategory(id: string | null) {
    return this.httpClient.get<ResponseData<ProductCategoryDto>>('http://localhost:9000/catalog-services/category/detail/' + id);
  }

  updateCategory(req: UpdateCategoryDto) {
    return this.httpClient.put<ResponseData<any>>('http://localhost:9000/catalog-services/category', req);
  }
}
