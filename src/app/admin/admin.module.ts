import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from "./admin-routing.module";
import { AdminComponent } from './admin.component';
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import { MatSidenavModule} from "@angular/material/sidenav";
import { SidenavComponent } from './sidenav/sidenav.component';
import {MatListModule} from "@angular/material/list";
import {MatCard, MatCardContent, MatCardModule} from "@angular/material/card";
import { ProductCategoryComponent } from './product-category/product-category.component';
import { CreateProductCategoryComponent } from './product-category/create-product-category/create-product-category.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRadioModule} from "@angular/material/radio";
import {MatSliderModule} from "@angular/material/slider";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatStepperModule} from "@angular/material/stepper";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTreeModule} from "@angular/material/tree";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatBadgeModule} from "@angular/material/badge";
import {MatChipsModule} from "@angular/material/chips";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatRippleModule} from "@angular/material/core";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {ReactiveFormsModule} from "@angular/forms";
import {} from "@angular/common/http";
import {provideNativeDateAdapter} from '@angular/material/core';
import {MomentDateModule} from "@angular/material-moment-adapter";


@NgModule({
  declarations: [
    AdminComponent,
    SidenavComponent,
    ProductCategoryComponent,
    CreateProductCategoryComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCard,
    MatCardContent,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    MomentDateModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ], providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' }, // Set locale to 'en-GB' for dd/mm/yyyy format
    provideNativeDateAdapter()]
})
export class AdminModule { }
