import { LOCALE_ID, NgModule} from '@angular/core'; //Per assicurarti che Angular utilizzi il locale registrato per tutte le operazioni di formattazione, devi fornire il LOCALE_ID nel modulo principale della tua applicazione.
import { BrowserModule } from '@angular/platform-browser';

//Quando importi localeIt da @angular/common/locales/it, stai importando le impostazioni culturali italiane che includono formati di data, valuta, numeri e altre convenzioni regionali.

import myLocaleIt from '@angular/common/locales/it' //La registrazione dei dati locali in Angular serve per configurare le impostazioni culturali e di formattazione della tua applicazione. Ciò include formati di data, valuta, numeri e altre impostazioni specifiche per una determinata cultura o regione

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductPreviewComponent } from './components/product-preview/product-preview.component';
import { registerLocaleData } from '@angular/common';
import { BestSellerComponent } from './components/best-seller/best-seller.component';
import { NuoviArriviComponent } from './components/nuovi-arrivi/nuovi-arrivi.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductsByCategoryComponent } from './components/products-by-category/products-by-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './components/cart/cart.component';
import { NameFilteredProductsComponent } from './components/name-filtered-products/name-filtered-products.component';
import { FormComponent } from './components/form/form.component';
import { TankYouPageComponent } from './components/tank-you-page/tank-you-page.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PersonalDashboardComponent } from './components/personal-dashboard/personal-dashboard.component';

registerLocaleData(myLocaleIt) //La funzione registerLocaleData di Angular permette di registrare questi dati locali, assicurando che la tua applicazione utilizzi le convenzioni corrette per formattare e visualizzare informazioni a seconda del locale selezionato.

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ProductsListComponent,
    ProductPreviewComponent,
    BestSellerComponent,
    NuoviArriviComponent,
    ProductDetailComponent,
    ProductsByCategoryComponent,
    CartComponent,
    NameFilteredProductsComponent,
    FormComponent,
    TankYouPageComponent,
    RegisterComponent,
    LoginComponent,
    PersonalDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbCarouselModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    // {provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
   { provide: LOCALE_ID, useValue: 'it' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
