import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';


@Component({
  selector: 'app-completed-order',
  templateUrl: './completed-order.component.html',
  styleUrls: ['./completed-order.component.scss']
})
export class CompletedOrderComponent {
  //search table
searchText: string = '';
filteredData: any[] = [];
sortcolumn: string = '';
sortDirection: string = 'asc';
//User
userId: string;
  userType: string;
  accessToken: string;
  userToken: any;

  //Order
  orderDetailSubscription: Subscription;
  orderData:any;
  orderStatusData:any;


  isModalVisible = false;


  
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authservice: AuthService,
    private userservice: UserService,
    private orderservice: OrderService,
    private toasterService: ToasterService,
   
  ) {}

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
        item.userOrder.workOrderNumber,
        item.userOrder.orderStatusId,
        item.userOrder.patientName,
        item.userOrder.requiredDate ,
        item.userOrder.service,
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
    // user
    const { userToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { fullName } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { accessToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { status } = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accessToken = accessToken;
    this.userId = userToken;
    this.userType = fullName;


//Order details
this.orderDetailSubscription = this.userservice
.getOrderDetails(this.userId, this.accessToken)
.subscribe(
  (res: any) => {
    this.orderData = res.orderDetails;
        // Sort the orderData array based on orderDate with March first, then February
        this.orderData.sort((a :any, b :any) => {
          const dateA = new Date(a.userOrder.orderDate);
          const dateB = new Date(b.userOrder.orderDate);

          // Check if the months are different
          if (dateA.getMonth() !== dateB.getMonth()) {
            return dateB.getMonth() - dateA.getMonth(); // Sort by month in descending order
          } else {
            // If the months are the same, sort by year in descending order
            return dateB.getFullYear() - dateA.getFullYear();
          }
        });
    this.filteredData = this.orderData;
    console.log("Response from API ",res)
    console.log(this.filteredData)
  },
  (error: any) => {
    console.log('Error fetching user details:', error);
  }
);



  }



sortColumn(column: string) {
  console.log('Sorting column:', column);

  // Check if the column is valid
  if (!column) {
    console.error('Invalid column:', column);
    return;
  }

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
    let valueA = a['userOrder']['orderDate'];
    let valueB = b['userOrder']['orderDate'];

    // Provide default values for undefined or null values
    if (valueA === undefined || valueA === null) {
      valueA = '';
    }
    if (valueB === undefined || valueB === null) {
      valueB = '';
    }

    // Case-insensitive string comparison
    return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });
}




  filterData() {
    if (this.searchText) {
   
      this.filteredData = this.orderData.filter((item: any) => {

        console.log(  "Checking", item.userOrder.workOrderNumber)

        return (
          item.userOrder.workOrderNumber.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.userOrder.patientName.toLowerCase().includes(
            this.searchText.toLowerCase()
          ) ||
          item.userOrder.requiredDate.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.userOrder.service.toLowerCase().includes(
            this.searchText.toLowerCase()
          )

        );
      });
    } 
    
    else {
      this.filteredData = this.orderData; // If searchText is empty, show all data
    }
  }

  deleteWarning(){
window.alert("Your delete order request has been Send to Admin")

  }

  showToaster(messageType: 'success' | 'error' | 'warning' | 'info' = 'success') {
    const message = 'Your delete request has been sent to admin for approval!';
    const title = 'Title';

    this.toasterService.showToast(message, title, messageType);
  }




}
