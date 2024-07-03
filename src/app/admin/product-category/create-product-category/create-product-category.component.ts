import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductCategoryServices} from "../../../services/product-category-services";
import {formatDate} from "@angular/common";
import {CreateCategoryDto} from "../../../dto/create-category-dto";
import {Utilities} from "../../../utilities/utilities";


@Component({
  selector: 'app-create-product-category',
  templateUrl: './create-product-category.component.html',
  styleUrl: './create-product-category.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProductCategoryComponent implements OnInit {

  constructor(private productCategoryService: ProductCategoryServices) {
  }

  productCategoryFormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.max(100)]),
    url: new FormControl(null, [Validators.required]),
    activeStartDate: new FormControl(new Date(), [Validators.required, Validators.max(100)]),
    activeEndDate: new FormControl(this.getCategoryExpiredDate(), [Validators.max(100)]),
    description: new FormControl(null)
  });

  isSubmitting = false;

  getCategoryExpiredDate() {
    const now = new Date();
    now.setDate(now.getDate() + 10);
    return now;
  }

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

  ngOnInit(): void {
    this.productCategoryFormGroup.get('name')?.valueChanges.subscribe(valueChange => {
      console.log(valueChange)
      // @ts-ignore
      this.productCategoryFormGroup.get('url')?.setValue(Utilities.toSlug(valueChange));
    })
  }


}
