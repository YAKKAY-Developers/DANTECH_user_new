import { Component,Input} from '@angular/core';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {

  customerName: string = '';
  products: any[] = [{ name: '', cost: 0, quantity: 0 }];

  addProduct() {
    this.products.push({ name: '', cost: 0, quantity: 0 });
  }

  calculateTotalCost(): number {
    return this.products.reduce((total, product) => total + (product.cost * product.quantity), 0);
  }


  
  



}
