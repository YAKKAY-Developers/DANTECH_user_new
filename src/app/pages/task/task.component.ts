import { Component,Input} from '@angular/core';
import * as jsPDF from 'jspdf';


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

  generatePDF(formData: any) {
    // Create a new instance of jsPDF
    const pdf = new jsPDF.default();
  
    // Add customer information to the PDF
    pdf.text(`Customer Name: ${formData.customerName}`, 20, 20);
  
    // Add table header
    pdf.text('Product Name', 20, 40);
    pdf.text('Cost', 80, 40);
    pdf.text('Quantity', 120, 40);
  
    // Set cell padding
    const cellPadding = 2;
  
    // Add product information to the PDF with borders
    let yOffset = 50;
    let isOddRow = false;
    const rowHeight = 12;
    const cellWidth = 50;
    const borderWidth = 0.5;
  
    this.products.forEach((product, index) => {
      // Draw borders for each cell
      pdf.rect(20, yOffset, cellWidth, rowHeight, 'S');
      pdf.rect(20 + cellWidth, yOffset, cellWidth, rowHeight, 'S');
      pdf.rect(20 + 2 * cellWidth, yOffset, cellWidth, rowHeight, 'S');
  
      // Draw the row
      pdf.text(product.name, 20 + cellPadding, yOffset + cellPadding + 8);
      pdf.text(`$${product.cost}`, 20 + cellWidth + cellPadding, yOffset + cellPadding + 8);
      pdf.text(product.quantity.toString(), 20 + 2 * cellWidth + cellPadding, yOffset + cellPadding + 8);
  
      // Toggle isOddRow for the next iteration
      isOddRow = !isOddRow;
      yOffset += rowHeight;
    });
  
    // Draw borders for the total cost
    pdf.rect(20, yOffset + 10, 3 * cellWidth, rowHeight, 'S');
  
    // Add total cost to the PDF
    pdf.text(`Total Cost: $${this.calculateTotalCost()}`, 20 + cellPadding, yOffset + 10 + cellPadding + 8);
  
    // Save or open the PDF
    pdf.save('invoice.pdf');
  }
  
  



}
