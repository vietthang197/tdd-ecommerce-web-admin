import {Component, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryServices {

  constructor(private httpClient: HttpClient) {
  }

  createProductCategory(formControlValue: any) {
    this.httpClient.get('http://localhost:9001/category?page=0&size=10').subscribe(value => {
      console.log(value)
    })
  }
}
