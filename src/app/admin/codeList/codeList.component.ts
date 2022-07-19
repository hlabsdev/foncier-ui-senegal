import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SelectItem } from 'primeng';
import { NgForm } from '@angular/forms';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CodeList } from '@app/core/models/codeList.model';
import { CodeListService } from '@app/core/services/codeList.service';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { UtilService } from '@app/core/utils/util.service';
import { ValidationService } from '@app/core/utils/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { SectionsService } from '@app/admin/parameters/translation/sections.service';
import { TranslationRepository } from '@app/translation/translation.repository';

@Component({
  selector: 'app-codelist',
  templateUrl: 'codeList.component.html',
})

export class CodeListComponent implements OnInit {

  @Input() codeList: CodeList = new CodeList();
  @Input() sourceRRRconfig: boolean;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClose = new EventEmitter();
  @Output() refresh = new EventEmitter();
  codeListTypes: SelectItem[];
  codeListType: string;
  titleCodeList: string;
  errorMessage: string;
  readOnlyType: boolean;


  constructor(
    private codeListService: CodeListService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private utilService: UtilService,
    private router: Router,
    protected translateService: TranslateService,
    public validationService: ValidationService,
    private sectionsService: SectionsService,
    private translationRepo: TranslationRepository) {
  }

  ngOnInit() {
    this.codeListService.getCodeListTypes().subscribe((codeListTypes) => {
      this.codeListTypes = codeListTypes.map(o => o.toSelectItem());
      this.codeListTypes.forEach(cl => {
        this.translateService.get(`CODELIST.TYPES.${cl.value}`).subscribe(label => cl.label = label);
      });
      return this.codeListTypes.unshift(this.utilService.getSelectPlaceholder());
    });

    const routeObs = this.route.params.subscribe((params: Params) => {
      this.titleCodeList = '';
      const id = this.codeList && this.codeList.codeListID ? this.codeList.codeListID : params['codeListId'];
      const codeListObs = (id && id !== ' ') ? this.codeListService.getCodeList(id) : of(new CodeList());
      codeListObs.subscribe(codeList => {
        const type = this.codeList.type;
        this.readOnlyType = this.codeList && this.codeList.type && this.codeList.type.length > 0;
        this.codeList = codeList;
        // this.sectionsService.selectCurrentSectionItemByTranslationKey(this.codeList.value, 'CODELIST.VALUES', !!this.codeList.id);
        this.codeList.type = this.codeList && this.codeList.codeListID ? this.codeList.type : type;
        if (this.codeList.type) {
          this.titleCodeList = `CODELIST.TYPES.${this.codeList.type}`;
        }
      });
      return codeListObs;
    });
  }

  save(codeList: CodeList, form: NgForm) {
    if (form.invalid) {
      const errorResult = this.validationService.validateForm(form);
      this.errorMessage = errorResult.toMessage();
      return this.alertService.error(errorResult.message);
    }

    /* const currentSectionItem = this.sectionsService.getCurrentSectionItem();
    currentSectionItem.key = this.codeList.value;
    this.translationRepo.sectionItem.setOne(currentSectionItem.simplify()).pipe(mergeMap(() => {
      return codeList.codeListID ? this.codeListService.updateCodeList(codeList)
        : this.codeListService.createCodeList(codeList);
    })).subscribe(() => {
        this.alertService.success('API_MESSAGES.SAVE_SUCCESSFUL');
        this.refresh.emit(true);
        this.close();
      }, err => this.alertService.apiError(err)); */
      const saveObs =  codeList.codeListID ? this.codeListService.updateCodeList(codeList)
      : this.codeListService.createCodeList(codeList);
      saveObs.subscribe(() => {
        this.alertService.success('API_MESSAGES.SAVE_SUCCESSFUL');
        this.refresh.emit(true);
        this.close();
      }, err => this.alertService.apiError(err));
  }

  goToList(): void {
    this.close();
  }

  deleteCodeList(codeList: CodeList) {
    const onAccept = of(this.codeListService.deleteCodeList(codeList.codeListID))
      .pipe(
        mergeMap(
          () => of(this.refresh.emit())
            .pipe(
              map(() => this.close(),
              ),
            ),
        ),
      );

    return this.utilService.displayConfirmationDialogWithMessageParameters('MESSAGES.CONFIRM_DELETE_DATA', {parameter: codeList.value},
      () => {
        return onAccept.subscribe(success => this.alertService.success('API_MESSAGES.SAVE_SUCCESSFUL'));
      });
  }

  close() {
    if (this.sourceRRRconfig) {
      this.router.navigate(['rrrs']);
    } else {
      this.router.navigate(['code-lists']);
    }
    this.onClose.emit(true);
  }
}


