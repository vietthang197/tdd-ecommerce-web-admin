import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule, provideExperimentalZonelessChangeDetection} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminRoutingModule} from "./admin-routing.module";
import { AdminComponent } from './admin.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import {} from "@angular/common/http";
import {MenuModule} from "primeng/menu";


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SidenavComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ], providers: [
    { provide: LOCALE_ID, useValue: 'vi-VN' },
     provideExperimentalZonelessChangeDetection()]
})
export class AdminModule { }
