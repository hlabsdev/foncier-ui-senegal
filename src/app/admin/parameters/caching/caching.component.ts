import { Component, OnInit } from '@angular/core';
import { KeycloakAdminService } from '@app/core/services/KeycloakAdminService.component';

@Component({
  selector: 'app-params-caching',
  templateUrl: './caching.component.html'
})
export class CachingComponent {

  constructor(private kadminservice: KeycloakAdminService) {}

  invalidateUsers = () => this.kadminservice.getUsersInvalidate().subscribe();
  updateUsers = () => this.kadminservice.getUsersUpdate().subscribe();
}
