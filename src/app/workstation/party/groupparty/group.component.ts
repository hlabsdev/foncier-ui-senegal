import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng';
import { PartyComponent } from '@app/workstation/party/party.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { CodeListTypes } from '@app/core/models/codeListType.model';
import { GroupParty } from '@app/core/models/groupParty.model';
import { Party } from '@app/core/models/party.model';
import { PartyMember } from '@app/core/models/partyMember.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { CodeListService } from '@app/core/services/codeList.service';
import { FormService } from '@app/core/services/form.service';
import { PartyService } from '@app/core/services/party.service';
import { SelectService } from '@app/core/layout/elements/select/select.service';
import { UtilService } from '@app/core/utils/util.service';
import { ValidationService } from '@app/core/utils/validation.service';
import { AlertService } from '@app/core/layout/alert/alert.service';
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  providers: [
    { provide: PartyComponent, useExisting: GroupComponent }
  ]
})
export class GroupComponent implements OnInit, OnDestroy {

  @Input() party: any;
  @Input() showAllLabel: boolean;
  @Input() readOnly: Boolean = false;

  groupParty: GroupParty = new GroupParty();
  groupTypeList: SelectItem[];
  rowSizes: any = RowSizes;
  partyMemberDialog: boolean;
  partyMember: PartyMember = new PartyMember();
  partyMemberBackup: PartyMember;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected partyService: PartyService,
    public codeListService: CodeListService,
    protected utilService: UtilService,
    protected formService: FormService,
    protected alertService: AlertService,
    protected selectService: SelectService,
    protected validationService: ValidationService) {
  }

  ngOnInit(): void {
    this.getGroupPartyTypes();
    this.getPartyGroup();
  }

  ngOnDestroy(): void {

  }

  getPartyGroup(): void {
    this.party.groupParty = (this.party.groupParty) ? this.party.groupParty : new GroupParty();
  }

  getGroupPartyTypes(): void {
    this.utilService
      .mapToSelectItems(this.codeListService.getCodeLists({ type: CodeListTypes.GROUP_PARTY_TYPE }),
        'CODELIST.VALUES', 'value.value', 'COMMON.ACTIONS.SELECT')
      .subscribe((groupTypeList: SelectItem[]) => {
        this.groupTypeList = groupTypeList;
      });
  }

  addPartyMember(partyMember: PartyMember = null) {
    this.partyMember = partyMember ? this.backupPartyMember(partyMember) : new PartyMember();
    if (!this.partyMember.party) {
      this.partyMember.party = new Party();
    }
    this.partyMemberDialog = true;
  }

  backupPartyMember(partyMember: PartyMember): PartyMember {
    this.partyMemberBackup = _.cloneDeep(partyMember);
    return partyMember;
  }

  removePartyMember(partyMember: PartyMember) {
    _.remove(this.party.groupParty.partyMembers, el => el === partyMember);
  }

  cancelPartyMember() {
    _.merge(this.partyMember, this.partyMemberBackup);
    this.partyMemberDialog = false;
  }

  savePartyMember(partyMember: PartyMember) {
    if (!this.party.groupParty) {
      this.party.groupParty = new GroupParty();
    }
    if (!this.party.groupParty.partyMembers) {
      this.party.groupParty.partyMembers = new Array();
    }
    this.removePartyMember(partyMember);
    this.party.groupParty.partyMembers.push(partyMember);

    this.partyMemberDialog = false;
  }

}
