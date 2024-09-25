import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { BestSellerComponent } from './components/best-seller/best-seller.component';
import { NuoviArriviComponent } from './components/nuovi-arrivi/nuovi-arrivi.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductsByCategoryComponent } from './components/products-by-category/products-by-category.component';
import { CartComponent } from './components/cart/cart.component';
import { NameFilteredProductsComponent } from './components/name-filtered-products/name-filtered-products.component';
import { FormComponent } from './components/form/form.component';
import { TankYouPageComponent } from './components/tank-you-page/tank-you-page.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PersonalDashboardComponent } from './components/personal-dashboard/personal-dashboard.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"products", component:ProductsListComponent},
  {path:"product/:id", component:ProductDetailComponent},
  {path:"best-seller", component:BestSellerComponent},
  {path:"new-arrivals", component:NuoviArriviComponent},
  {path:"category/:cat", component:ProductsByCategoryComponent},
  {path:"cart", component:CartComponent},
  {path:"name-filtered-products", component:NameFilteredProductsComponent},
  {path:"form-checkout", component:FormComponent},
  {path:"tank-you-page", component: TankYouPageComponent},
  {path:"register", component:RegisterComponent},
  {path:"login", component:LoginComponent},
  {path:"personal-dashboard/:userID", component:PersonalDashboardComponent, canActivate: [AuthGuard]}
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
