import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminComponent} from "./admin.component";
import {ProductCategoryComponent} from "./product-category/product-category.component";

const routes: Routes = [
  { path: '', component: AdminComponent, children: [
      {path: '', redirectTo: 'product-category', pathMatch: 'full'},
      {path: 'product-category', component: ProductCategoryComponent},
      {path: 'product-fuck', component: ProductCategoryComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
