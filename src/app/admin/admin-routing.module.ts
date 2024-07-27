import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminComponent} from "./admin.component";
import {ProductCategoryComponent} from "./product-category/product-category.component";
import {EditCategoryComponent} from "./product-category/edit-category/edit-category.component";
import {ProductCatalogComponent} from "./product-catalog/product-catalog.component";

const routes: Routes = [
  { path: '', component: AdminComponent, children: [
      {path: '', redirectTo: 'product-category', pathMatch: 'full'},
      {path: 'product-category', component: ProductCategoryComponent},
      {path: 'product-catalog', component: ProductCatalogComponent},
      {path: 'product-category/:categoryId', component: EditCategoryComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
