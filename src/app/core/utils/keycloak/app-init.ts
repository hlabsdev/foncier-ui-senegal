import { KeycloakService } from 'keycloak-angular';
import { ConfigService } from '../../app-config/config.service';
import { Config } from '../../app-config/config';
import { Injectable } from '@angular/core';

@Injectable()
export class KeyCloakInitService {
  config: Config;
  constructor(
    private keycloak: KeycloakService,
    private configService: ConfigService
  ) { }

  initialize(): Promise<any> {

    const config: any = this.configService.getDefaultConfig('EXTERNAL_SERVICES.keycloak');
    return new Promise(async (resolve, reject) => {

      try {
        const options: any = {
          config: {
            url: config.keyCloakUrl,
            realm: config.keyCloakRealm,
            clientId: config.keyCloakClientId
          },
          initOptions: {
            checkLoginIframe: false,
          },
        };

        const data = JSON.parse(localStorage.getItem('token'));
        if (data) {
          const accessToken = JSON.parse(atob(data.access_token.split('.')[1]));
          if (accessToken && new Date().getTime() < accessToken.exp * 1000) {
            options.initOptions.token = data.access_token;
            options.initOptions.idToken = data.id_token;
            options.initOptions.refreshToken = data.refresh_token;
          }
        }

        await this.keycloak.init(options);
        resolve();
      } catch (error) {
        reject(error);
        resolve();
      }

    });
  }

  isAuthenticated(): boolean {
    return this.keycloak.getKeycloakInstance().authenticated;
  }


}

