import { RouterModule, Routes } from '@angular/router';
import { DivisionRegistriesComponent } from '@app/workstation/division-registry/division-registries.component';
import { GisOfficeComponent } from '@app/workstation/gis/gis-office.component';
import { GisComponent } from '@app/workstation/gis/gis.component';
import { ApplicantComponent } from '@app/workstation/applicant/applicant.component';
import { ApplicantsComponent } from '@app/workstation/applicant/applicants.component';
import { PublicationComponent } from '@app/workstation/publication/publication.component';
import { PublicationsComponent } from '@app/workstation/publication/publications.component';
import { RdaiComponent } from '@app/workstation/rdai/rdai.component';
import { RdaisComponent } from '@app/workstation/rdai/rdais.component';
import { AppAuthGuard } from '../core/utils/keycloak/app-auth-guard';
import { ApplicationComponent } from './application/application.component';
import { ApplicationsComponent } from './application/applications.component';
import { BAUnitComponent } from './baUnit/baUnit.component';
import { BAUnitsComponent } from './baUnit/baUnits.component';
import { GeneralFormalityRegistriesComponent } from './general-formality-registry/general-formality-registries.component';
import { OppositionsRegistryComponent } from './opposition-registry/oppositions-registry.component';
import { GroupComponent } from './party/groupparty/group.component';
import { PartiesComponent } from './party/parties.component';
import { PartyComponent } from './party/party.component';
import { PreregistrationFormalitiesComponent } from './preregistrationFormalities/preregistrationFormalities.component';
import { RegisterActComponent } from './registerAct/registerAct.component';
import { ResponsibilityTypesComponent } from './rrr/configuration/responsibilityTypes.component';
import { RestrictionTypesComponent } from './rrr/configuration/restrictionTypes.component';
import { RightTypesComponent } from './rrr/configuration/rightTypes.component';
import {
  RRRTypesConfigurationComponent
} from './rrr/configuration/rrrTypesConfiguration.component';
import { RRRComponent } from './rrr/rrr.component';
import { RRRsComponent } from './rrr/rrrs.component';
import { SourceComponent } from './source/source.component';
import { SourcesComponent } from './source/sources.component';
import { SpatialUnitComponent } from './spatialUnit/spatialUnit.component';
import { SpatialUnitsComponent } from './spatialUnit/spatialUnits.component';
import { TransactionComponent } from './transactions/transaction.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CasePresentedCcodComponent } from './case-presented-ccod/case-presented-ccod.component';
import { CaseGroupPresentedCcodComponent } from './case-group-presented-ccod/case-group-presented-ccod.component';
import { LandSituationTableComponent } from '@app/workstation/land-situation-table/land-situation-table.component';
import { AgendasComponent } from '@app/workstation/agendas/agendas.component';
import { DelegationComponent } from '@app/workstation/delegation/delegation.component';
import { EtatCessionComponent } from './etatCession/etatCession.component';
import { RightOwnerComponent } from '@app/workstation/rrr/rightOwner/rightOwner.component';
import { FusionComponent } from './fusion/fusion.component';

const WORKSTATION_ROUTES: Routes = [
  { path: 'spatial-units', component: SpatialUnitsComponent, canActivate: [AppAuthGuard] },
  { path: 'spatial-unit', component: SpatialUnitComponent, canActivate: [AppAuthGuard] },
  { path: 'spatial-unit/:spatialUnitId', component: SpatialUnitComponent, canActivate: [AppAuthGuard] },
  { path: 'ba-units', component: BAUnitsComponent, canActivate: [AppAuthGuard] },
  { path: 'ba-unit', component: BAUnitComponent, canActivate: [AppAuthGuard] },
  { path: 'ba-units/registered', component: BAUnitsComponent, canActivate: [AppAuthGuard] },
  { path: 'ba-unit/:baUnitId', component: BAUnitComponent, canActivate: [AppAuthGuard] },
  { path: 'applicants', component: ApplicantsComponent, canActivate: [AppAuthGuard] },
  { path: 'applicant', component: ApplicantComponent, canActivate: [AppAuthGuard] },
  { path: 'applicant/:applicantId', component: ApplicantComponent, canActivate: [AppAuthGuard] },
  { path: 'rrrs', component: RRRsComponent, canActivate: [AppAuthGuard] },
  { path: 'rrr', component: RRRComponent, canActivate: [AppAuthGuard] },
  { path: 'rrr/:rrrId', component: RRRComponent, canActivate: [AppAuthGuard] },
  { path: 'right-types', component: RightTypesComponent, canActivate: [AppAuthGuard] },
  { path: 'right-owners', component: RightOwnerComponent, canActivate: [AppAuthGuard] },
  { path: 'restriction-types', component: RestrictionTypesComponent, canActivate: [AppAuthGuard] },
  { path: 'responsibility-types', component: ResponsibilityTypesComponent, canActivate: [AppAuthGuard] },
  { path: 'rrrs/config', component: RRRTypesConfigurationComponent, canActivate: [AppAuthGuard] },
  { path: 'parties', component: PartiesComponent, canActivate: [AppAuthGuard] },
  { path: 'sources', component: SourcesComponent, canActivate: [AppAuthGuard] },
  { path: 'sources/:sourceId', component: SourceComponent, canActivate: [AppAuthGuard] },
  { path: 'party', component: PartyComponent, canActivate: [AppAuthGuard] },
  { path: 'party/:partyId', component: PartyComponent, canActivate: [AppAuthGuard] },
  { path: 'group', component: GroupComponent, canActivate: [AppAuthGuard] },
  { path: 'group/:groupPartyId', component: GroupComponent, canActivate: [AppAuthGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AppAuthGuard] },
  { path: 'transaction', component: TransactionComponent, canActivate: [AppAuthGuard] },
  { path: 'transaction/:transactionId', component: TransactionComponent, canActivate: [AppAuthGuard] },
  { path: 'rdais', component: RdaisComponent, canActivate: [AppAuthGuard] },
  { path: 'oppositionsregistry', component: OppositionsRegistryComponent, canActivate: [AppAuthGuard] },
  { path: 'generalFormalityRegistries', component: GeneralFormalityRegistriesComponent, canActivate: [AppAuthGuard] },
  { path: 'rdai', component: RdaiComponent, canActivate: [AppAuthGuard] },
  { path: 'rdai/:rdaiId', component: RdaiComponent, canActivate: [AppAuthGuard] },
  { path: 'preregistrationFormalities', component: PreregistrationFormalitiesComponent, canActivate: [AppAuthGuard] },
  { path: 'divisionRegistries', component: DivisionRegistriesComponent, canActivate: [AppAuthGuard] },
  { path: 'publications', component: PublicationsComponent, canActivate: [AppAuthGuard] },
  { path: 'publication', component: PublicationComponent, canActivate: [AppAuthGuard] },
  { path: 'publication/:publicationId', component: PublicationComponent, canActivate: [AppAuthGuard] },
  { path: 'rda', component: RegisterActComponent, canActivate: [AppAuthGuard] },
  { path: 'application', component: ApplicationComponent, canActivate: [AppAuthGuard] },
  { path: 'applications', component: ApplicationsComponent, canActivate: [AppAuthGuard] },
  { path: 'gis', component: GisComponent, canActivate: [AppAuthGuard] },
  { path: 'gis-office', component: GisOfficeComponent, canActivate: [AppAuthGuard] },
  { path: 'case-presented-ccod', component: CasePresentedCcodComponent, canActivate: [AppAuthGuard] },
  { path: 'case-group-presented-ccod', component: CaseGroupPresentedCcodComponent, canActivate: [AppAuthGuard] },
  { path: 'delegation', component: DelegationComponent, canActivate: [AppAuthGuard] },
  { path: 'land-situation-table', component: LandSituationTableComponent, canActivate: [AppAuthGuard] },
  { path: 'agendas', component: AgendasComponent, canActivate: [AppAuthGuard] },
 /*  { path: 'tatCession', component: EtatCessionComponent, canActivate: [AppAuthGuard] },
  { path: 'fusion', component: FusionComponent, canActivate: [AppAuthGuard] } */
];

export const RoutingModule = RouterModule.forChild(WORKSTATION_ROUTES);
