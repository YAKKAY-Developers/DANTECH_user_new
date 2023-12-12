import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";


@Component({
  selector: 'app-blank',
  standalone:true,
  templateUrl: './blank.component.html',
  imports:[RouterModule,CommonModule],
  styleUrls: ['./blank.component.scss']
})
export class BlankComponent {
 

  constructor() {
    console.log("I am inside blank component - Parent");
  }

}
