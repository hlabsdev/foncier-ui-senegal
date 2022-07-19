import { NgModule } from '@angular/core';
import { RegisterActService } from '@app/core/services/register-act.service';
import { DragPanelModule } from '@app/core/layout/elements/drag-panels/drag-panel-module';
import { BAUnitViewComponent } from '@app/workstation/baUnit/baUnitView.component';
import { DivisionRegistriesComponent } from '@app/workstation/division-registry/division-registries.component';
import { DivisionRegistryComponent } from '@app/workstation/division-registry/division-registry.component';
import { DivisionRegistryFormComponent } from '@app/workstation/division-registry/division-registry.form.component';
import { DocumentGenerationComponent } from '@app/workstation/documentGeneration/document.generation.component';
import { GisOfficeComponent } from '@app/workstation/gis/gis-office.component';
import { GisComponent } from '@app/workstation/gis/gis.component';
import { OppositionRegistryComponent } from '@app/workstation/opposition-registry/opposition-registry.component';
import { OppositionRegistryFormComponent } from '@app/workstation/opposition-registry/opposition-registry.form.component';
import { SpatialUnitDragPanelComponent } from '@app/workstation/spatialUnit/spatialUnit-drag-panel.component';
import { SpatialUnitDragPanelFormComponent } from '@app/workstation/spatialUnit/spatialUnit-drag-panel.form.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AdminModule } from '@app/admin/admin.module';
import { ApplicantService } from '@app/core/services/applicant.service';
import { FormService } from '@app/core/services/form.service';
import { PartyService } from '@app/core/services/party.service';
import { PublicationService } from '@app/core/services/publication.service';
import { RdaiService } from '@app/core/services/rdai.service';
import { RegistryService } from '@app/core/services/registry.service';
import { SourceService } from '@app/core/services/source.service';
import { CoreModule } from '@app/core/core.module';
import { ApplicantComponent } from '@app/workstation/applicant/applicant.component';
import { ApplicantFormComponent } from '@app/workstation/applicant/applicant.form.component';
import { ApplicantsComponent } from '@app/workstation/applicant/applicants.component';
import { PublicationComponent } from '@app/workstation/publication/publication.component';
import { PublicationsComponent } from '@app/workstation/publication/publications.component';
import { RdaiComponent } from '@app/workstation/rdai/rdai.component';
import { RdaiFormComponent } from '@app/workstation/rdai/rdai.form.component';
import { RdaisComponent } from '@app/workstation/rdai/rdais.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { OppositionRegistryService } from '@app/core/services/oppositionRegistry.service';
import { InputTextModule, TabViewModule } from 'primeng';
import { ApplicationComponent } from './application/application.component';
import { ApplicationsComponent } from './application/applications.component';
import { FormTemplateBaseComponent } from './baseForm/form-template-base.component';
import { FormComponent } from './baseForm/form.component';
import { BAUnitComponent } from './baUnit/baUnit.component';
import { BAUnitFormComponent } from './baUnit/baUnit.form.component';
import { BAUnitPickerComponent } from './baUnit/baUnitPicker.component';
import { BAUnitSetBatchTransactionsComponent } from './baUnit/baUnitSetBatchTransactions.component';
import { BAUnitService } from './baUnit/baUnit.service';
import { BAUnitsComponent } from './baUnit/baUnits.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { BulletinFormComponent } from './bulletin/bulletin.form.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ComplementaryInfoComponent } from './complementaryInfo/complementaryInfo.component';
import { ComplementaryInfoFormComponent } from './complementaryInfo/complementaryInfo.form.component';
import { ConsistencyChangeComponent } from './consistencyChange/consistencyChange.component';
import { ConsistencyChangeService } from './consistencyChange/consistencyChange.service';
import { ConsistencyChangeDialogComponent } from './consistencyChange/consistencyChangeDialog.component';
import { BaunitChooseCreatePickerComponent } from './consistencyChange/subforms/baunitChooseCreatePicker.component';
import { ConsistencyChangeItemComponent } from './consistencyChange/subforms/consistencyChangeItem.component';
import { CreateBaunitComponent } from './consistencyChange/subforms/createBaunit.component';
import { GeneralFormalityRegistriesComponent } from './general-formality-registry/general-formality-registries.component';
import { GeneralFormalityRegistryComponent } from './general-formality-registry/general-formality-registry.component';
import { GeneralFormalityRegistryFormComponent } from './general-formality-registry/general-formality-registry.form.component';
import { LinksComponent } from './links/links.component';
import { ListFormComponent } from './list-form/list-form.component';
import { NoticeComponent } from './notice/notice.component';
import { NoticeFormComponent } from './notice/notice.form.component';
import { OppositionsRegistryComponent } from './opposition-registry/oppositions-registry.component';
import { GroupComponent } from './party/groupparty/group.component';
import { PartyComponent } from './party/party.component';
import { PartyMemberComponent } from './party/party.member.component';
import { PartyMemberFormComponent } from './party/party.member.form.component';
import { PartyPickerComponent } from './party/partyPicker.component';
import { PartiesComponent } from './party/parties.component';
import { PreregistrationFormalitiesComponent } from './preregistrationFormalities/preregistrationFormalities.component';
import { PreregistrationFormalityComponent } from './preregistrationFormalities/preregistrationFormality.component';
import { PreregistrationFormalityService } from './preregistrationFormalities/preregistrationFormality.service';
import { RegisterActComponent } from './registerAct/registerAct.component';
import { RegisterActFormComponent } from './registerAct/registerAct.form.component';
import { ResponsiblePartiesComponent } from './responsibleParty/responsibleParties.component';
import { ResponsiblePartyComponent } from './responsibleParty/responsibleParty.component';
import { ResponsiblePartyFormComponent } from './responsibleParty/responsibleParty.form.component';
import { RRRService } from './rrr/rrr.service';
import { ResponsibilityTypesComponent } from './rrr/configuration/responsibilityTypes.component';
import { RestrictionTypesComponent } from './rrr/configuration/restrictionTypes.component';
import { RightTypesComponent } from './rrr/configuration/rightTypes.component';
import { RRRTypesConfigurationComponent } from './rrr/configuration/rrrTypesConfiguration.component';
import { RRRComponent } from './rrr/rrr.component';
import { RRRFormComponent } from './rrr/rrr.form.component';
import { RRRsComponent } from './rrr/rrrs.component';
import { RrrsFormComponent } from './rrr/rrrs.form.component';
import { RRRsPickerComponent } from './rrr/rrrsPicker.component';
import { AdministrativeSourceComponent } from './source/administrative/administrativeSource.component';
import { SourceComponent } from './source/source.component';
import { SourcesComponent } from './source/sources.component';
import { SubTypeComponent } from './source/subtype/subType.component';
import { SupportSourceComponent } from './source/supportSource/supportSource.component';
import { ChequeComponent } from './source/cheque/cheque.component';
import { SpatialUnitComponent } from './spatialUnit/spatialUnit.component';
import { SpatialUnitFormComponent } from './spatialUnit/spatialUnit.form.component';
import { SpatialUnitsComponent } from './spatialUnit/spatialUnits.component';
import { SpatialUnitService } from './spatialUnit/spatialUnit.service';
import { SpatialUnitPickerComponent } from './spatialUnit/spatialUnitPicker.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransactionComponent } from './transactions/transaction.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RoutingModule } from './workStation.routes';
import { CasePresentedCcodComponent } from './case-presented-ccod/case-presented-ccod.component';
import { CaseGroupPresentedCcodComponent } from './case-group-presented-ccod/case-group-presented-ccod.component';
import { LandSituationTableComponent } from './land-situation-table/land-situation-table.component';
import { LandSituationTableService } from '@app/core/services/land-situation-table.service';
import { CaseGroupPresentedViewCcodComponent } from '@app/workstation/case-group-presented-ccod/case-group-presented-view-ccod.component';
import { DelegationComponent } from './delegation/delegation.component';
import { AgendasComponent } from './agendas/agendas.component';
import { AgendasService } from './agendas/agendas.service';
import { EtatCessionComponent } from './etatCession/etatCession.component';
import { EtatCessionService } from '@app/core/services/etatCession.service';
import { EtatCessionFormComponent } from './etatCession/etatCession.form.component';
import { DocumentComplementaryInfoComponent } from './documentComplementaryInfo/documentComplementary.component';
import { DocumentComplementaryInfoFormComponent } from './documentComplementaryInfo/documentComplementary.form.component';
import { RightOwnerComponent } from './rrr/rightOwner/rightOwner.component';
import { FusionComponent } from './fusion/fusion.component';
import { FusionService } from '@app/core/services/fusion.service';

const EntryComponents = [
  PartyComponent, SpatialUnitFormComponent, SpatialUnitComponent, ChecklistComponent, AdministrativeSourceComponent,
  SourcesComponent, SpatialUnitsComponent, BAUnitPickerComponent, BAUnitSetBatchTransactionsComponent, ResponsiblePartyComponent,
  DocumentGenerationComponent, ApplicationComponent, ComplementaryInfoComponent, ComplementaryInfoFormComponent,
  PreregistrationFormalityComponent, BulletinComponent, BulletinFormComponent, SpatialUnitDragPanelComponent,
  NoticeComponent, NoticeFormComponent, LinksComponent, ConsistencyChangeComponent, BaunitChooseCreatePickerComponent,
  SpatialUnitPickerComponent, CreateBaunitComponent, RrrsFormComponent, RRRsPickerComponent, DocumentComplementaryInfoComponent,
  DocumentComplementaryInfoFormComponent
];

const Components = [
  ApplicationsComponent, BAUnitFormComponent, BAUnitViewComponent, RRRsComponent, RRRComponent, BAUnitsComponent, ApplicantsComponent,
  ApplicantComponent, BAUnitComponent, RightTypesComponent, RRRTypesConfigurationComponent, ResponsibilityTypesComponent,
  ApplicantFormComponent, RestrictionTypesComponent, PartiesComponent, PartyMemberFormComponent,
  GroupComponent, TransactionsComponent, TransactionComponent, PartyMemberComponent,
  FormTemplateBaseComponent, FormComponent, SourceComponent,
  SupportSourceComponent, ChequeComponent, RRRFormComponent, ResponsiblePartyFormComponent,
  ResponsiblePartiesComponent, SubTypeComponent, TransactionHistoryComponent,
  PartyPickerComponent, GisComponent, GisOfficeComponent,
  RdaisComponent, RdaiComponent, RdaiFormComponent, RegisterActFormComponent, RegisterActComponent, OppositionRegistryComponent,
  GeneralFormalityRegistriesComponent, PublicationsComponent, PublicationComponent, PreregistrationFormalitiesComponent,
  ListFormComponent, ConsistencyChangeDialogComponent, ConsistencyChangeItemComponent, SpatialUnitDragPanelFormComponent,
  DivisionRegistriesComponent, DivisionRegistryFormComponent, DivisionRegistryComponent,
  GeneralFormalityRegistryComponent, GeneralFormalityRegistryFormComponent,
  PublicationsComponent, PublicationComponent, PreregistrationFormalitiesComponent, ListFormComponent, ConsistencyChangeDialogComponent,
  ConsistencyChangeItemComponent, SpatialUnitDragPanelFormComponent,
  DivisionRegistriesComponent, OppositionsRegistryComponent, DivisionRegistryFormComponent, OppositionRegistryFormComponent,
  DivisionRegistryComponent, CasePresentedCcodComponent, CaseGroupPresentedCcodComponent, DelegationComponent,
  CaseGroupPresentedViewCcodComponent, LandSituationTableComponent, AgendasComponent, EtatCessionComponent,
  EtatCessionFormComponent, FusionComponent, RightOwnerComponent, ...EntryComponents
];

@NgModule({
  imports: [
    CoreModule,
    RoutingModule,
    AdminModule,
    AngularEditorModule,
    NgxUiLoaderModule,
    TabViewModule,
    DragPanelModule,
    InputTextModule,
  ],
  declarations: [...Components],
  exports: [...Components],
  entryComponents: [...EntryComponents],
  providers: [
    SpatialUnitService, RRRService, BAUnitService, PartyService, ApplicantService, SourceService, FormService, RegistryService, RdaiService,
    PublicationService, RegisterActService, PublicationService, RegisterActService, PreregistrationFormalityService, ListFormComponent,
    ConsistencyChangeService, OppositionRegistryService, LandSituationTableService, AgendasService, EtatCessionService, FusionService
  ]
})
export class WorkstationModule {
}

