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



@Component({
  selector: 'app-ordersummary',
  templateUrl: './ordersummary.component.html',
  styleUrls: ['./ordersummary.component.scss'],
})
export class OrdersummaryComponent {
  accessToken: any;
  userToken: any;
  orderToken:any;

  userOrderDetailsSubscription: Subscription;
  result: any
  orderDate = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private userservice: UserService,
    private orderservice: OrderService,

  ) { }


  ngOnInit() {

 // user
 const { userToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
 const { fullName } = JSON.parse(localStorage.getItem('user') ?? '{}');
 const { accessToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
 this.accessToken = accessToken;
 this.userToken = userToken;
    // Retrieve token from route parameters
    this.route.params.subscribe((params) => {
      this.orderToken = params['id'];
      console.log("OrderToken", this.orderToken);
    });

 //Get user details:
 this.userOrderDetailsSubscription = this.userservice.getOneUserOrderDetails(this.userToken, this.accessToken, this.orderToken)
 .pipe(first())
 .subscribe({
   next: (res) => {
     this.result = res.userOrders;
     console.log("Result:", this.result)
  
   },
   error: (error) => {
     console.log(error.error)
   }
 })


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
