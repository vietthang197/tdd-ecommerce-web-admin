import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule, provideExperimentalZonelessChangeDetection} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from "./admin-routing.module";
import { AdminComponent } from './admin.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { CreateProductCategoryComponent } from './product-category/create-product-category/create-product-category.component';

import {ReactiveFormsModule} from "@angular/forms";
import {} from "@angular/common/http";
import { CategoryDataListComponent } from './product-category/category-data-list/category-data-list.component';
import {BadgeModule} from "primeng/badge";
import {MenubarModule} from "primeng/menubar";
import {AvatarModule} from "primeng/avatar";
import {Ripple} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";
import {SidebarModule} from "primeng/sidebar";
import {StyleClassModule} from "primeng/styleclass";
import {MenuModule} from "primeng/menu";


@NgModule({
  declarations: [
    AdminComponent,
    SidenavComponent,
    CreateProductCategoryComponent,
    CategoryDataListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    ReactiveFormsModule,
    BadgeModule,
    MenubarModule,
    AvatarModule,
    Ripple,
    InputTextModule,
    Button,
    SidebarModule,
    StyleClassModule,
    MenuModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ], providers: [
    { provide: LOCALE_ID, useValue: 'vi-VN' },
     provideExperimentalZonelessChangeDetection()]
})
export class AdminModule { }
