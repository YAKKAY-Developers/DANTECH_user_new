import { Component,OnInit } from '@angular/core';
import { Order } from '../top-orders/order-data';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  selectedService: string = '';
  orderDate: Date | null = null;
  orders: Array<{ service: string, orderDate: Date, task: string, taskDueDate: Date }> = [];
  
  currentRowId: number = 0; // Initialize the row ID counter
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


  switchToTaskTab() {
    const taskTab = document.getElementById('task-tab');
    if (taskTab) {
      taskTab.click(); // Programmatically trigger a click on the "Task" tab
    }
  }

 
  addOrder(): void {
    this.orders = [];  

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

  deleteTask(){
    window.alert("Task Closed")
  }
 
  addTask(selectedService: string) {
  this.currentRowId++; // Increment the row ID counter

  const newOrder = {
    service: selectedService, // Use the selectedService parameter
    task: '',
    orderDate: new Date(),
    taskDueDate: new Date(),
  };
  this.orders.push(newOrder); // Add the new task to the orders array
}

 

}
