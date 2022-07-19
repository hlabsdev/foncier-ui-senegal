import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AccordionModule, BreadcrumbModule, ButtonModule, CheckboxModule, DialogModule, FileUploadModule, TabViewModule } from 'primeng';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@app/core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SectionModalComponent } from '@app/admin/parameters/translation/section/section.modal.component';
import { SectionItemModalComponent } from '@app/admin/parameters/translation/sectionItem/sectionItem.modal.component';
import { SectionComponent } from '@app/admin/parameters/translation/section/section.component';
import { SectionItemComponent } from '@app/admin/parameters/translation/sectionItem/sectionItem.component';
import { SectionElementComponent } from '@app/admin/parameters/translation/section/sectionElement/sectionElement.component';
import { SectionElementsComponent } from '@app/admin/parameters/translation/section/sectionElement/sectionElements.component';
import { SideMenuComponent } from '@app/admin/parameters/translation/sidemenu/sidemenu.component';
import { SideMenuItemComponent } from '@app/admin/parameters/translation/sidemenu/sidemenuItem.component';
import { LightComponent } from '@app/admin/parameters/translation/sidemenu/light.component';
import { SectionsComponent } from '@app/admin/parameters/translation/sections.component';
import { SectionsService } from '@app/admin/parameters/translation/sections.service';
import { SectionItemTranslationPanelComponent } from '@app/admin/parameters/translation/sectionItem/sectionItemTranslationPanel.component';

@NgModule({
  imports: [
    FormsModule, TranslateModule, NgxUiLoaderModule, AccordionModule, CommonModule, BreadcrumbModule, TabViewModule,
    ButtonModule, DialogModule, CheckboxModule, FileUploadModule, CoreModule, BrowserModule, BrowserAnimationsModule
  ], declarations: [
    SectionsComponent, SectionModalComponent,
    SectionItemModalComponent, SectionComponent, SectionItemComponent,
    SectionElementComponent, SectionElementsComponent, SideMenuComponent,
    SideMenuItemComponent, LightComponent, SectionItemTranslationPanelComponent
  ], exports: [
    SectionsComponent, SectionModalComponent,
    SectionItemModalComponent, SectionComponent, SectionItemComponent,
    SectionElementComponent, SectionElementsComponent, SideMenuComponent,
    SideMenuItemComponent, LightComponent, SectionItemTranslationPanelComponent
  ], providers: [ SectionsService ]
})
export class SectionsModule {
}
