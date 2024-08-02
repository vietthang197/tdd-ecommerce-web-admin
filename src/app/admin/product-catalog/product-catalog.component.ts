import {Component, OnInit} from '@angular/core';
import {AutoCompleteModule} from "primeng/autocomplete";
import {Button} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputGroupModule} from "primeng/inputgroup";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {Ripple} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.css',
  imports: [
    AutoCompleteModule,
    Button,
    CalendarModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    InputGroupModule,
    InputTextModule,
    PaginatorModule,
    PrimeTemplate,
    ReactiveFormsModule,
    Ripple,
    TableModule,
    ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  standalone: true
})
export class ProductCatalogComponent implements OnInit {

  cities: City[] | undefined;

  formGroup: FormGroup = new FormGroup({
    selectedCity: new FormControl(null, Validators.required)
  });

  ngOnInit() {
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
    ];

    this.formGroup = new FormGroup({
      selectedCity: new FormControl<City | null>(null)
    });
  }

}
