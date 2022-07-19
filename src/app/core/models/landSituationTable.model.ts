import { TransactionInstance } from '@app/core/models/transactionInstance.model';
import { Party } from '@app/core/models/party.model';
import Utils from '@app/core/utils/utils';

export class LandSituationTable {
    id: string;
    designation: string;
    locationLand: string;
    establishedDate: Date;
    entryNumber: number;
    lotNumber: number;
    nicad: number;
    owner: Party;
    projectImpact: string;
    totalLandArea: number;
    impactLandArea: number;
    observations: string;
    baUnitId: string;
    baUnitVersion: number;
    baUnitTitleNumber: string;
    baUnitSpatialUnitRegion: string;
    transactionInstance: TransactionInstance;

    constructor(obj: any = {}) {
        this.id = obj.id;
        this.designation = obj.designation;
        this.locationLand = obj.locationLand;
        this.establishedDate = Utils.setDate(obj.establishedDate);
        this.entryNumber = obj.entryNumber;
        this.owner = obj.owner ? new Party(obj.owner) : null;
        this.lotNumber = obj.lotNumber;
        this.nicad = obj.nicad;
        this.projectImpact = obj.projectImpact;
        this.totalLandArea = obj.totalLandArea;
        this.impactLandArea = obj.impactLandArea;
        this.observations = obj.observations;
        this.baUnitId = obj.baUnitId;
        this.baUnitVersion = obj.baUnitVersion;
        this.baUnitTitleNumber = obj.baUnitTitleNumber;
        this.baUnitSpatialUnitRegion = obj.baUnitSpatialUnitRegion;
        this.transactionInstance = obj.transactionInstance ?
            new TransactionInstance(obj.transactionInstance) : null;
    }
}
