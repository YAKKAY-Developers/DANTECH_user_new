import { Component } from '@angular/core';
import { DisableRightClickService } from './services/disable-right-click.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // constructor(private rightClickDisable: DisableRightClickService) {}
  // ngOnInit() {
  //   this.rightClickDisable.disableRightClick();
  // }
  title = 'app';
}
