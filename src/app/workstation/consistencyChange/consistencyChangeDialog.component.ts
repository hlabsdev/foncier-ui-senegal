import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConsistencyChange } from '@app/core/models/consistencyChange.model';
import { BAUnit } from '../baUnit/baUnit.model';
import { Parcel } from '../spatialUnit/parcel/parcel.model';
import { Variables } from '@app/core/models/variables.model';

@Component({
  selector: 'app-consistency-change-dialog',
  templateUrl: 'consistencyChangeDialog.component.html',
  styleUrls: ['consistencyChangeDialog.component.scss']
})
export class ConsistencyChangeDialogComponent implements OnInit {
  @Input() currentCC: ConsistencyChange = new ConsistencyChange({});
  @Input() multiselect: Boolean = false;
  @Output() saved = new EventEmitter();
  pBa_Unit_ID: String;
  currentBaUnit: BAUnit;
  pParcel_ID: String;

  ngOnInit(): void {
    if (this.currentCC) {
      // make something with the currentCCG
    }
  }

  baUnitSave(e: {baUnit: BAUnit, variable: Variables}) {
    this.currentCC.baUnit = e.baUnit;
    // this.pBa_Unit_ID = e.baUnit.uid;
    // this.currentBaUnit = e.baUnit;
  }
  spatialUnitSave(pParcels: Parcel | Parcel[]) {
    if (this.multiselect) {
      const currentCCS: ConsistencyChange[] = [];
      pParcels.forEach(parcel => {
        currentCCS.push({
          ...this.currentCC,
          parcel
        });
      });
      this.saved.emit(currentCCS);
    } else {
      this.currentCC.parcel = pParcels as Parcel;
      this.saved.emit([this.currentCC]);
    }
  }
}
