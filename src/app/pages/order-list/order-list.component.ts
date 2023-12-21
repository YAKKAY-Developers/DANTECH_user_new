import { Component } from '@angular/core';
import { Orders, orderlist } from './order-list.data';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  OrderDetails: orderlist[];
  searchText: string = '';
  filteredData: any[] = [];
  public WOId: any;
  sortcolumn: string = '';
  sortDirection: string = 'asc';

  openModal() {
    console.log('Im here');
    // Open the modal using Bootstrap modal functions
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    // Close the modal
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  deleteItem() {
    // Handle item deletion here
    // This function is just a placeholder, and you should implement your own logic.
    // After deleting the item, you can call closeModal() to close the modal.
  }

  constructor(public router: Router, private activatedRoute: ActivatedRoute) {
    this.OrderDetails = Orders;
  }

  sortColumn(column: string) {
    // Check if the column is already sorted
    if (this.sortcolumn === column) {
      // If the same column is clicked again, toggle the sorting order
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // If a different column is clicked, set the sorting column and direction
      this.sortcolumn = column;
      this.sortDirection = 'asc'; // Default to ascending order
    }

    // Sort the filtered data based on the chosen column and direction
    this.filteredData.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (this.sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }

  exportToCSV() {
    // Create a CSV string
    const headers = [
      'Work Order id',
      'Status',
      'Patient',
      'Required',
      'Product',
    ];
    const csvData = this.filteredData.map((item) => {
      return [
        item.workOrder,
        item.woStatus,
        item.doctor,
        item.date,
        item.product,
      ];
    });

    // Add the headers to the CSV string
    const csv = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n');

    // Create a Blob object and create a download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'top_orders.csv';
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
  }

  ngOnInit(): void {
    this.filteredData = this.OrderDetails;

    console.log(this.filteredData);
  }

  start(event: Event) {
    const workOrderNumber = (event.target as HTMLButtonElement).value; // Typecast event.target to HTMLButtonElement
    console.log(workOrderNumber);
    // sessionStorage.setItem('workOrderNumber', JSON.stringify(workOrderNumber));
    this.router.navigate(['/pages/orderdetail/', workOrderNumber]);
  }

  filterData() {
    if (this.searchText) {
      console.log('Hi');
      this.filteredData = this.OrderDetails.filter((item) => {
        console.log('My data', this.filteredData);
        // Customize the filtering logic as needed
        return (
          item.reference
            .toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          item.status.includes(this.searchText) ||
          item.patient.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.required.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.product.toLowerCase().includes(this.searchText.toLowerCase())
        );
      });
    } else {
      this.filteredData = this.OrderDetails; // If searchText is empty, show all data
    }
  }
}
