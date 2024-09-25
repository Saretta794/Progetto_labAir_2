import { Component, Input } from '@angular/core';
import { Prodotto } from '../../models/prodotti';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrl: './product-preview.component.css'
})
export class ProductPreviewComponent {

  @Input()
  product?:Prodotto

}
