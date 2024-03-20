import {Component, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryServices {

  constructor(private httpClient: HttpClient) {
  }

  createProductCategory(formControlValue: any) {
    console.log(formControlValue)
  }
}
