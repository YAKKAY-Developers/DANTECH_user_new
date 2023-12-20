import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationBarService, NotificationType } from 'ngx-notification-bar';
import { environment } from '../../environments/environment';


@Injectable()
export class AlertService {

  private useToastr: boolean = environment.useToastr;

  constructor(private toastr: ToastrService,
    private notificationBarService: NotificationBarService) {
    this.toastr.toastrConfig.enableHtml = true;
  }

  success(message: string, keepAfterNavigationChange = false) {
    if (this.useToastr)
      this.toastr.success(message);
    else
      this.notificationBarService.create({
        message: message,
        type: NotificationType.Success,
        isHtml: true,
        hideOnHover: false,
        hideDelay: 5000,
        allowClose: true,
      });
  }

  error(message: string, keepAfterNavigationChange = false) {
    if (this.useToastr)
      this.toastr.error(message);
    else
      this.notificationBarService.create({
        message: message,
        type: NotificationType.Error,
        isHtml: true,
        hideOnHover: false,
        hideDelay: 5000,
        allowClose: true,
      });
  }

  warning(message: string, keepAfterNavigationChange = false) {
    if (this.useToastr)
      this.toastr.warning(message);
    else
      this.notificationBarService.create({
        message: message,
        type: NotificationType.Warning,
        isHtml: true,
        hideOnHover: false,
        hideDelay: 5000,
        allowClose: true,
      });
  }

  info(message: string, keepAfterNavigationChange = false) {
    if (this.useToastr)
      this.toastr.info(message);
    else
      this.notificationBarService.create({
        message: message,
        type: NotificationType.Info,
        isHtml: true,
        hideOnHover: false,
        hideDelay: 5000,
        allowClose: true,
      });
  }
}
