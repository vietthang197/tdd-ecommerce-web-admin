import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductCategoryServices} from "../../../services/product-category-services";

@Component({
  selector: 'app-create-product-category',
  templateUrl: './create-product-category.component.html',
  styleUrl: './create-product-category.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProductCategoryComponent {

  constructor() {
  }

  productCategoryFormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.max(100)]),
    activeStartDate: new FormControl(null, [Validators.required, Validators.max(100)]),
    activeEndDate: new FormControl(null, [Validators.required, Validators.max(100)])
  });

  isSubmitting = false;

  createProductCategory() {
    console.log(this.productCategoryFormGroup.getRawValue())
    this.isSubmitting = true;
    this.productCategoryFormGroup.disable();
  }
}
