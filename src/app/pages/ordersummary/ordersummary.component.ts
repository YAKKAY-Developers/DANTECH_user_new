import { Component } from '@angular/core';

@Component({
  selector: 'app-ordersummary',
  templateUrl: './ordersummary.component.html',
  styleUrls: ['./ordersummary.component.scss'],
})
export class OrdersummaryComponent {
  invoice_number: string = '21001';
  date_issue: string = '03-Feb-2021';
  date_expire: string = '03-Mar-2021';
  desc: string =
    'This invoice covers services provided by Niall Ainsworth for the design, development and deployment of the website site@site.com';
  company: any = {
    name: 'Niall Ainsworth',
    address: '126 Address\nCo. Meath',
    phone: '087 3297222',
    mail: 'niallainsworth@gmail.com',
    tax_number: '83007342',
  };
  client: any = {
    name: 'Kevin Smith',
    company: 'Clever Company',
  };
  rate: string = '12.50';
  currency: string = '€';

  work: any[] = [
    { desc: 'Static site design and dev', time: 44 },
    { desc: 'Keyboard applet design and dev', time: 32 },
    { desc: 'e-commerce shop', time: 20 },
    { desc: 'Mobile compatibility', time: 16 },
    { desc: 'Site hosting, domain, SEO', time: 12 },
  ];
  bank: any = {
    IBAN: 'IE41AIBK9234234',
    BIC: 'AIBKI324',
  };
  total_time: number = 0;
  total_cost: number = 0;

  constructor() {
    this.calculateTotals();
  }

  calculateTotals() {
    this.total_time = this.work.reduce((total, item) => total + item.time, 0);
    this.total_cost = this.total_time * parseFloat(this.rate);
  }

  printPDF() {
    // Get the invoice container by its id
    const invoiceToPrint = document.getElementById('invoiceToPrint');

    if (invoiceToPrint) {
      // Create a new window to print the content
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        // Write the invoice content to the new window
        printWindow.document.open();
        printWindow.document.write(`
          <html>
          <head>
            <title>Print Invoice</title>
            <style>
              .media-object.logo {
                float: right; /* Align the logo to the right */
              }
            </style>
          </head>
          <body>
            ${invoiceToPrint.innerHTML}
          </body>
          </html>
        `);
        printWindow.document.close();

        // Call the print method
        printWindow.print();

        // Close the new window after printing
        printWindow.close();
      } else {
        alert(
          'Unable to open a new window for printing. Please check your browser settings.'
        );
      }
    } else {
      alert('Unable to find the invoice content to print.');
    }
  }
}
