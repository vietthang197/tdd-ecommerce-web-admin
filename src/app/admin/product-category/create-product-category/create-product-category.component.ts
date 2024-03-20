import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductCategoryServices} from "../../../services/product-category-services";

@Component({
  selector: 'app-create-product-category',
  templateUrl: './create-product-category.component.html',
  styleUrl: './create-product-category.component.css'
})
export class CreateProductCategoryComponent {

  constructor(private productCategoryServices: ProductCategoryServices) {
  }

  productCategoryFormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.max(100)])
  });

  isSubmitting = false;

  createProductCategory() {
    this.isSubmitting = true;
    this.productCategoryFormGroup.disable();
    this.productCategoryServices.createProductCategory(this.productCategoryFormGroup.getRawValue());
  }
}
