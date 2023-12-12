
import { Component,OnInit } from '@angular/core';
import { Order } from '../top-orders/order-data';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent  {
  selectedService: string = '';
  orderDate: Date | null = null;
  orders: Array<{ service: string, orderDate: Date, task: string, taskDueDate: Date }> = [];
  
  
  showSubtasks: boolean = false;
  newSubtask: string = '';
  subtasks: { [task: string]: string[] } = {};
  selectedTask: string | null = null;


  addSubtask(task: string) {
    // Set the selected task
    this.selectedTask = task;
    // Create an array of subtasks for the given task if it doesn't exist
    if (!this.subtasks[task]) {
      this.subtasks[task] = [];
    }
  }

  

  submitSubtask(task: string) {
    if (this.newSubtask.trim() !== '') {
      // Push the subtask to the array associated with the given task
      this.subtasks[task].push(this.newSubtask);
      this.newSubtask = ''; // Clear the input field
    }
  }


data:Order[] =[
  {
workOrder:'D00989',
status: 'danger',
woStatus: 'Yet to start',
doctor:'Rajan',
doctorId:'D0189',
date:'2023-12-12',
image: 'assets/images/users/user.svg',
product: 'Teeth Mold',
files: 'assets/images/files/1.jpg',
}]

  // Define a map of tasks and their corresponding due date offsets for each service.
  taskMap:
  
  { [service: string]: { [task: string]: number } } = {
    Crown: {
      'Mold': 2,
      'Pre-production': 4,
      'Production': 6,
      'Doctor Approval': 8,
      'Final Mold': 10,
      'Delivery':12
    },
    Denture: {
      'Mold': 2,
      'Production': 6,
      'Final Mold': 12,
      'Delivery':14
    },

    Partials:{
      'Mold': 2,
      'Production': 6,
      'Final Mold': 12,
      'Delivery':14
    },
    Implants:{
      'Mold': 2,
      'Production': 6,
      'Final Mold': 12,
      'Delivery':14
    },
    Removable:{
      'Mold': 2,
      'Production': 6,
      'Final Mold': 12,
      'Delivery':14
    }
    // Add more services and tasks as needed.
  };

  

  filteredData: Order | null = null; // Initialize with an empty array

 
  ngOnInit(): void {
    if (this.data.length > 0) {
      this.filteredData = this.data[0]; // Initialize filteredData with the first item from data
    } // Initialize filteredData with the full data
  }


  switchToAssignmentTab() {
    const assignmentTab = document.getElementById('assignment-tab');
    if (assignmentTab) {
      assignmentTab.click(); // Programmatically trigger a click on the "Task" tab
    }
  }

  switchToTaskTab(){
    const taskTab = document.getElementById('task-tab');
    if (taskTab) {
      taskTab.click(); // Programmatically trigger a click on the "Task" tab
    }

  }

 
  addOrder(): void {
    this.orders = [];  // Clear the orders array before adding new orders

    if (this.selectedService && this.orderDate) {
      const tasksForService = this.taskMap[this.selectedService];
      if (tasksForService) {

        // Iterate through tasks for the selected service and calculate due dates.
        
        for (const task in tasksForService) {
          if (tasksForService.hasOwnProperty(task)) {
            const taskDueDate = new Date(this.orderDate);
            const dueDateOffset = tasksForService[task];
            taskDueDate.setDate(taskDueDate.getDate() + dueDateOffset);
            this.orders.push({
              service: this.selectedService,
              orderDate: this.orderDate,
              task: task,
              taskDueDate: taskDueDate
            });
          }
        }
      }

      // Reset form fields
      this.selectedService = '';
      this.orderDate = null;
    }
  }

  startTask(){
    window.alert("Task Started")
  }

  closeTask(){
    window.alert("Task Closed")
  }
 

}
