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
  selector: 'app-add-doctors',
  templateUrl: './add-doctors.component.html',
  styleUrls: ['./add-doctors.component.scss'],
})
export class AddDoctorsComponent {
  user_data: any;
  viewdatalist: any[] = [];
  // doctor list
  docdetails: any;
  doc_count = false;
  doc_data: any;
  docDetailsSubscription: Subscription;
  //search table
  searchText: string = '';
  filteredData: any[] = [];
  sortcolumn: string = '';
  sortDirection: string = 'asc';
  // adddoctors form
  form: FormGroup;
  loading = false;
  submitted = false;
  resut: any;
  // authenticate user
  stat_user: string;
  userId: string;
  userType: string;
  accessToken: string;
  userToken: any;
  userdata: any;
  UserDetails: any;
  userDetailsSubscription: Subscription;
  userObject: void;
  // check prescence
  gst_no = false;
  img_uploaded = false;

  isModalVisible = false;
  result: any;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authservice: AuthService,
    private userservice: UserService,
    private orderservice: OrderService,
    private toasterService :ToasterService
  ) {}

  ngOnInit(): void {
    // user
    const { userToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { fullName } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { accessToken } = JSON.parse(localStorage.getItem('user') ?? '{}');
    const { status } = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.accessToken = accessToken;
    this.userId = userToken;
    this.userType = fullName;
    

  //user details
    this.userDetailsSubscription = this.userservice
      .getOneUserDetails(this.userId, this.accessToken)
      .subscribe(
        (res: any) => {
          this.UserDetails = res;
          const userObject = this.UserDetails['profile'];
          this.user_data = [this.userdata];
        },
        (error: any) => {
          console.log('Error fetching user details:', error);
        }
      );

 


      //Get all consultant details
      this.docDetailsSubscription = this.userservice.getallConsultants(this.userId, this.accessToken)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.doc_data = res.consultantDetails;
          console.log( this.doc_data)
          if (this.doc_data.length > 0) {
                    this.doc_count = true;
                  }
                  this.filteredData = this.doc_data;
          console.log("DOctor count",this.doc_count );
          
        },
        error: (error) => {
          console.log('Error fetching doc details:',error.error)
        }
      })



    //form
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      specialisation: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  get f() {
    return this.form.controls;
  }

  onEdit(consultant: any) {
    // Set editing state to true for the selected consultant
    consultant.isEdit = true;
  }

  onDelete(consultant: any) {
    // Set editing state to true for the selected consultant
  window.alert("Are you sure you want to delete this Consultant?")
  const messageType = 'warning';
        const message = "Delete request has been sent to Admin for Approval";
        const title = 'Consultant delete';
        this.toasterService.showToast(message, title, messageType);
  }


  onSave(consultant: any) {
    // Make PUT request to update the consultant's details
    
    let regId = consultant.regId;
    let firstName = consultant.firstName;
    let lastName = consultant.lastName;
    let specialisation = consultant.specialisation;
    console.log(regId);
    this.userservice.updateConsultant(this.userId, this.accessToken, regId, firstName, lastName, specialisation).subscribe(
      (res: any) => {
       
        const messageType = 'success';
        const message = res.message;
        const title = 'Consultant update';
        this.toasterService.showToast(message, title, messageType);

        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3000 milliseconds = 3 seconds
        // Update the local data after successful update
        // const index = this.doc_data.findIndex((c :any) => c.regId === consultant.regId);
        // if (index !== -1) {
        //   this.doc_data[index] = res.updatedConsultant;
        //   this.filteredData = [...this.doc_data];
        //   consultant.isEdit = false; // Exit editing mode
         
        
         
        // }
      },
      (error: any) => {
        console.error('Error updating consultant details:', error);
        this.toasterService.showToast('Error updating consultant details', 'Error', 'error');
      }
    );
  }

  onCancel(consultant: any) {
    // Find the index of the consultant in the original data array
    const index = this.doc_data.findIndex((c :any) => c.regId === consultant.regId);
    if (index !== -1) {
      // Restore original data from the filtered data array
      this.filteredData[index] = { ...this.doc_data[index] };
      // Exit editing mode for the consultant
      this.filteredData[index].isEdit = false;
    }
  }
  

  //form submit
  onSubmit() {

    this.submitted = true;
    console.log(this.submitted)


    if (this.form.invalid) {
      const messageType = 'warning' ;
      const message = "Form is Invalid, fill all mandatory fields";
      const title = 'Invalid Form';
      this.toasterService.showToast(message, title, messageType);
      
      return;
    }
    this.loading = true;
    this.userservice
      .addConsultant(this.userId, this.accessToken, this.form.value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.result = res;
          const messageType = 'success';
          const message = this.result.message;
          const title = 'Consultant Information added';
          this.toasterService.showToast(message, title, messageType);
          window.location.reload();
        },
        error: (error) => {
          this.loading = false;
          const messageType = 'warning' ;
          const message = error;
          const title = 'Login';
    
        this.toasterService.showToast(message, title, messageType);
         
        },
      });
  }



  sortColumn(column: string) {

    
    console.log('Sorting column:', column);


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

      console.log('value A:', valueA);
      console.log('value B:', valueA);

      if (this.sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }

  filterData() {
    if (this.searchText) {
   
      this.filteredData = this.doc_data.filter((item: any) => {

        return (
          item.regId.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.firstName.toLowerCase().includes(
            this.searchText.toLowerCase()
          ) ||
          item.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.specialisation.toLowerCase().includes(
            this.searchText.toLowerCase()
          )

        );
      });
    } 
    
    else {
      this.filteredData = this.doc_data; // If searchText is empty, show all data
    }
  }
}
