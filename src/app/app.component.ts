import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { defaultLocale } from './core/utils/locale.constants';
import { CoreService } from './core/core.service';
import { DataService } from './data/data.service';
import { TranslationRepository } from '@app/translation/translation.repository';
import { FormsRepository } from '@app/forms.repository';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'app';
  logged = false;
  activeTopbarItem: Element;
  topbarMenuButtonClick: boolean;
  topbarMenuActive: boolean;
  loginPage = false;

  constructor(
    private translate: TranslateService,
    private formsRepo: FormsRepository,
    private dataService: DataService,
    translationRepo: TranslationRepository,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    // change this default locale by a defaullt comming from application config
    translate.setDefaultLang(defaultLocale);
    translate.use(defaultLocale);
    dataService.loadRepositories([translationRepo, formsRepo]);
  }

  ngOnInit() {
    this.logged = true;
  }

  ngAfterViewChecked(): void {
    if (this.router.url === '/login'
     || this.router.url.includes('/login')
     || this.router.url === '/register'
     || this.router.url === '/forgot-password') {
      this.loginPage = true;
      this.changeDetectorRef.detectChanges();
    } else {
      this.loginPage = false;
    }
  }

  onResize(event) {
    CoreService.screenSize = {
      width: event.target.innerWidth,
      height: event.target.innerHeight
    };
  }

  onTopbarItemClick(event: Event, item: Element) {
    this.topbarMenuButtonClick = true;
    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null;
    } else {
      this.activeTopbarItem = item;
    }
    event.preventDefault();
  }

  onTopbarMenuButtonClick(event: Event) {
    this.topbarMenuButtonClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;
    event.preventDefault();
  }
}
