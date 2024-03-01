import { Component } from '@angular/core';
import { DisableRightClickService } from './services/disable-right-click.service';
import { ToasterService } from './services/toaster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private toasterService: ToasterService) { }

  ngOnInit() {
    // this.rightClickDisable.disableRightClick();
  }
  title = 'app';

  // showToaster(messageType: 'success' | 'error' | 'warning' | 'info' = 'success') {
  //   const message = 'This is a message!';
  //   const title = 'Title';

  //   this.toasterService.showToast(message, title, messageType);
  // }
}
