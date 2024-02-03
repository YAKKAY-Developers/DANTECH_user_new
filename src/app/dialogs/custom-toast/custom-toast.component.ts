// custom-toast.component.ts

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-toast',
  templateUrl: './custom-toast.component.html',
  styleUrls: ['./custom-toast.component.scss'],

})
export class CustomToastComponent {
  @Input() title: string;
  @Input() message: string;
}
