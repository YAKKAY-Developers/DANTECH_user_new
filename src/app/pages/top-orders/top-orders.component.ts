import { Component } from '@angular/core';
import { Order, TopSelling } from './order-data';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-top-orders',
  templateUrl: './top-orders.component.html',
  styleUrls: ['./top-orders.component.scss']
})
export class TopOrdersComponent {
  OrderDetails: Order[];
  searchText: string = '';
  filteredData: any[] = [];
  public WOId: any;
  sortcolumn: string = '';
  sortDirection: string = 'asc';

  constructor(public router: Router, private activatedRoute: ActivatedRoute) {
    this.OrderDetails = TopSelling;
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
    const headers = ['Work Order', 'Status', 'Patient', 'Required', 'Product'];
    const csvData = this.filteredData.map((item) => {
      return [item.workOrder, item.woStatus, item.doctor, item.date, item.product];
    });
  
    // Add the headers to the CSV string
    const csv = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');
  
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
  
  ngOnInit(): void 
  {
    this.filteredData = this.OrderDetails;


  }

  start(event: Event) {
    const workOrderNumber = (event.target as HTMLButtonElement).value; // Typecast event.target to HTMLButtonElement
    console.log(workOrderNumber);
    // sessionStorage.setItem('workOrderNumber', JSON.stringify(workOrderNumber));
  this.router.navigate(["/pages/orderdetail/",workOrderNumber]);

}






  


  filterData() {
    if (this.searchText) {
      console.log("Hi")
      this.filteredData = this.OrderDetails.filter((item) => {
        console.log("My data",this.filteredData)
        // Customize the filtering logic as needed
        return (
          item.doctor.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.workOrder.includes(this.searchText) ||
          item.date.includes(this.searchText) ||
          item.product.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.status.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.woStatus.toLowerCase().includes(this.searchText.toLowerCase())

        );
      });
    } else {
      this.filteredData = this.OrderDetails; // If searchText is empty, show all data
    }
   
  }

}
