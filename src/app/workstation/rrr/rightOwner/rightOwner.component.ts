import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CodeList } from '@app/core/models/codeList.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { SelectItem } from 'primeng';
import { CodeListTypes } from '@app/core/models/codeListType.model';
import { CodeListService } from '@app/core/services/codeList.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '@app/core/utils/util.service';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { Party } from '@app/core/models/party.model';
import { RRR } from '@app/workstation/rrr/rrr.model';
import { BAUnit } from '@app/workstation/baUnit/baUnit.model';
import { BAUnitService } from '@app/workstation/baUnit/baUnit.service';
import { LazyLoadEvent } from 'primeng/api';
import { forEach, isNull } from 'lodash';
import * as _ from 'lodash';
import { LocaleDatePipe } from '@app/core/utils/localeDate.pipe';
import { SpecificTimezone } from '@app/core/utils/specificTimezone.pipe';

@Component({
  selector: 'app-right-owner',
  templateUrl: './rightOwner.component.html',
  styleUrls: ['./rightOwner.component.css'],
  providers: [LocaleDatePipe, SpecificTimezone]
})
export class RightOwnerComponent implements OnInit {

  @Output() added = new EventEmitter(true);
  baUnits: BAUnit[] = [];
  parties: Party[] = [];
  selectedParty: Party;
  allRights: RRR[] = [];
  partyRights: RRR[] = [];
  selectedRrr: RRR;
  search: string;
  rowSizes: any = RowSizes;
  cols: any[];
  // preloader message
  preloaderMessage = '...';
  totalRecords: number;
  noPartyFound = false;
  displayPartyDetail = false;
  displayRrrDetail = false;

  constructor(
    private baunitService: BAUnitService,
    private router: Router,
    public utilService: UtilService,
    private alertService: AlertService,
    protected translateService: TranslateService,
    private route: ActivatedRoute,
    private datePipe: LocaleDatePipe,
    private specificTimezone: SpecificTimezone,
    public ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.getBaUnitLists();
  }

  getBaUnitLists(event: LazyLoadEvent = {}) {

    const args = {
      page: event.first / event.rows,
      perPage: this.rowSizes.SMALL,
      // perPage: this.rowSizes.X_LARGE,
      orderBy: event.sortField,
      direction: event.sortOrder,
      search: this.search
    };

    // preloading init
    this.ngxLoader.start();

    this.baunitService.getRegisteredBAUnits(args).subscribe(result => {
      this.baUnits = result.content;
      this.getAllParties();

      /*Assingn cols names start*/
      this.cols = [
        { field: 'rightTypeDescription', header: this.translateService.instant('RRR.RRR_TYPE'), width: '8%' },
        { field: 'spatialUnitNumber', header: this.translateService.instant('RRR.SPATIAL_UNITS'), width: '8%' },
        { field: 'idParties', header: this.translateService.instant('RRR.PARTY_ID'), width: '9%' },
        { field: 'nameParties', header: this.translateService.instant('RRR.PARTY_NAME'), width: '10%' },
        { field: 'rolParties', header: this.translateService.instant('RRR.PARTY_ROLE'), width: '10%' },
        { field: 'radiationDate', header: this.translateService.instant('RRR.RADIATION_DATE'), width: '10%' },
        { field: 'radiationSlip', header: this.translateService.instant('RRR.RADIATION_NUMBER'), width: '8%' },
        { field: 'inscriptionDate', header: this.translateService.instant('RRR.INSCRIPTION_DATE'), width: '10%' },
        { field: 'inscriptionSlip', header: this.translateService.instant('RRR.INSCRIPTION_NUMBER'), width: '8%' },
        { field: 'modDate', header: this.translateService.instant('RRR.MODIFICATION_DATE'), width: '10%' }
      ];
      /*Assingn cols names end*/

      this.totalRecords = this.partyRights.length;

      // setting the preloader message
      this.preloaderMessage = this.getPreloaderMessage();
      // stopping the preloading
      this.ngxLoader.stop();
    }, err => {
      // stopping the preloading
      this.ngxLoader.stop();
      this.alertService.apiError(err);
    });
  }

  getAllParties() {
    if (this.baUnits.length > 0) {
      this.baUnits.forEach((baUnit) => {
        if (baUnit.parties.length > 0) {
          baUnit.parties.forEach((party) => {
            if (!(this.parties.find((part) => part.extPID === party.extPID))) {
              this.parties.push(party);
            }
          });
        }
        if (baUnit.rrrs.length > 0) {
          this.getBaUnitRights(baUnit);
        }
      });
      if (this.parties.length > 0) {
        this.parties.forEach(party => {
          party['role'] = this.translateService.instant('CODELIST.VALUES.' + party.partyRoleType.value);
          party['name'] = party.getName();
          party['extPID'] = party.extPID;
          party['nina'] = party.extPID;
        });

        this.parties = _.sortBy(this.parties, ['role', 'name'], ['asc', 'asc']);
      }
    }
  }

  getRole (party: Party) {
    party['role'] = this.translateService.instant('CODELIST.VALUES.' + party.partyRoleType.value);
    return party['role'];
  }

  getBaUnitRights(baUnit: BAUnit) {
    if (baUnit.rrrs.length > 0) {
      baUnit.rrrs.forEach((rrr) => {
        if (!(this.allRights.find((rr) => rr.rid === rrr.rid))) {
          this.allRights.push(rrr);
        }
      });
    }
  }

  searchParty() {
    console.log('SEARCHING');
    this.ngxLoader.start();
    if (this.parties.map((party) => party.extPID).includes(this.search)) {
      this.selectedParty = this.parties.find((party) => party.extPID === this.search);
      this.findPartyRights();
      this.noPartyFound = false;
    } else {
      this.noPartyFound = true;
    }
    this.ngxLoader.stop();
  }

  findPartyRights() {
    // tslint:disable-next-line:prefer-const
    let rrrs: RRR[] = [];
    if (this.selectedParty !== null) {
      this.ngxLoader.start();
      this.partyRights = [];
      if (this.allRights.length > 0) {
        this.allRights.forEach((right) => {
          if (right.parties.length > 0) {
            if (right.parties.find((part) => part.extPID === this.selectedParty.extPID)) {
              if (!(this.partyRights.find((rr) => rr.rid === right.rid))) {
                rrrs.push(right);
              }
            }
          }
        });

        console.log('ACTUAL PARTY RIGHTS ONE', rrrs);

      }

      /*reorganiser les droits deb*/
      for (const rrr of rrrs) {
        rrr['rightTypeDescription'] = this.translateService.instant('CODELIST.VALUES.' + rrr['type']['value']);
        rrr['spatialUnitNumber'] = (rrr.getSpatialUnitType() !== 'undefined') ? rrr.spatialUnit.spatialUnitNumber : '';
        rrr['idParties'] = [];
        rrr['nameParties'] = [];
        rrr['rolParties'] = [];
        const parties = isNull(rrr.radiationDate) && (rrr.type.value === 'RIGHT_TYPE_OWNERSHIP' || rrr.type.value === 'RIGHT_TYPE_LEASE_CONCESSION')
          ? rrr.parties.filter(p => isNull(p.radiationDate)) : rrr.parties;

        for (const party of parties) {
          const partyName = party.getName();
          if (partyName) {
            rrr['nameParties'].push(party.getName());
            rrr['idParties'].push(party.extPID);
            rrr['rolParties'].push(this.translateService.instant('CODELIST.VALUES.' + party.partyRoleType.value));
          }
        }

        rrr['inscriptionSlip'] = rrr['inscriptionTransactionId'];
        // rrr['inscriptionDate'] = this.datePipe.transform(this.specificTimezone.transform(rrr.inscriptionDate), 'shortDate');
        rrr['radiationSlip'] = rrr['radiationTransactionId'];
        // rrr['radiationDate'] = this.datePipe.transform(this.specificTimezone.transform(rrr.radiationDate), 'shortDate');
        // rrr['modDate'] = this.datePipe.transform(this.specificTimezone.transform(rrr.modDate), 'shortDate');

        this.partyRights.push(rrr);
      }

      this.partyRights = _.orderBy(this.partyRights, ['rightTypeDescription', 'inscriptionSlip'], ['asc', 'asc']);
      /*reorganiser les droits end*/

      this.ngxLoader.stop();
      console.log('ACTUAL PARTY RIGHTS', this.partyRights);
    } else {
      this.partyRights = [];
      this.noPartyFound = false;
      this.displayPartyDetail = false;
      this.displayRrrDetail = false;
      this.preloaderMessage = this.translateService.instant('PRELOADER.ONE_MOMENT');
    }
  }

  refresh() {
    this.selectedParty = null;
    this.partyRights = [];
    this.noPartyFound = false;
    this.displayPartyDetail = false;
    this.displayRrrDetail = false;
    this.preloaderMessage = this.translateService.instant('PRELOADER.ONE_MOMENT');
    this.getBaUnitLists();
  }

  getPreloaderMessage() {
    if (this.totalRecords === 0) {
      return this.translateService.instant('PRELOADER.ONE_MOMENT');
    } else if (this.totalRecords === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.totalRecords + ' ' + this.translateService.instant('PRELOADER.CODE')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.totalRecords + ' ' + this.translateService.instant('PRELOADER.CODES')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }

  showPartyDetail() {
    this.displayPartyDetail = true;
  }

  showRightDetail(rowData: null) {
    this.ngxLoader.start();
    this.selectedRrr = rowData ?? new RRR();
    this.displayRrrDetail = true;
  }
}
