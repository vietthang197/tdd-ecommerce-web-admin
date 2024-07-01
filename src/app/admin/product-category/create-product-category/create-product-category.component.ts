import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductCategoryServices} from "../../../services/product-category-services";
import {formatDate} from "@angular/common";
import {CreateCategoryDto} from "../../../dto/create-category-dto";

@Component({
  selector: 'app-create-product-category',
  templateUrl: './create-product-category.component.html',
  styleUrl: './create-product-category.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProductCategoryComponent {

  constructor(private productCategoryService: ProductCategoryServices) {
  }

  productCategoryFormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.max(100)]),
    activeStartDate: new FormControl(new Date(), [Validators.required, Validators.max(100)]),
    activeEndDate: new FormControl(null, [Validators.max(100)]),
    description: new FormControl(null)
  });

  isSubmitting = false;

  createProductCategory() {

    if (!this.productCategoryFormGroup.valid) {

    }

    this.isSubmitting = true;
    this.productCategoryFormGroup.disable();

    const jsonRequest: CreateCategoryDto = {
      name: this.productCategoryFormGroup.controls['name'].value,
      activeStartDate: '',
      activeEndDate: '',
      description: ''
    }

    if (this.productCategoryFormGroup.controls['activeStartDate'].value !== null) {
      jsonRequest.activeStartDate = formatDate(this.productCategoryFormGroup.controls['activeStartDate'].value, 'dd/MM/YYYY', 'vi-VN') + ' 00:00:00';
    }

    if (this.productCategoryFormGroup.controls['activeEndDate'].value !== null) {
      jsonRequest.activeEndDate = formatDate(this.productCategoryFormGroup.controls['activeEndDate'].value, 'dd/MM/YYYY', 'vi-VN') + ' 00:00:00';
    }

    this.productCategoryService.createCategory(jsonRequest)
  }
}
