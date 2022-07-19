import { CodeList } from './codeList.model';
import { InternationalAddress } from './internationalAddress.model';
import { TypeID } from './typeID.model';
import { ResponsibleOffice } from '@app/core/models/responsibleOffice.model';

export class Applicant {
  id: string;
  firstName: string;
  responsibleOffice: ResponsibleOffice;
  lastName: string;
  gender: string;
  phoneNumber: string;
  mobileNumber: string;
  email: string;
  profession: string;
  citizenship: string;
  country: string;
  town: string;
  district: string;
  requisitionNumber: string;
  placeOfBirth: string;
  socialDenomination: string;
  identificationNumber: string;
  taxNumber: string;
  applicantType: CodeList;
  corporationName: string;
  etablishmentDate: Date;
  legalType: string;
  otherName: string;
  birthDate: Date;
  civility: string;
  label: string;
  extPID: string;
  address: InternationalAddress;
  identity: TypeID;
  type: number;
  sinCode: string;
  registeredName: string;
  enterpriseType: string;
  streetName: string;
  displayName: string;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.responsibleOffice = obj.responsibleOffice ? new ResponsibleOffice(obj.responsibleOffice) : null;
    this.firstName = obj && obj.firstName ? obj.firstName : null;
    this.lastName = obj && obj.lastName ? obj.lastName : null;
    this.otherName = obj && obj.otherName ? obj.otherName : null;
    this.phoneNumber = obj.phoneNumber;
    this.email = obj.email;
    this.profession = obj.profession;
    this.citizenship = obj.citizenship;
    this.address = obj.address;
    this.country = obj.country;
    this.town = obj.town;
    this.district = obj.district;
    this.gender = obj.gender;
    this.requisitionNumber = obj.requisitionNumber;
    this.applicantType = obj.applicantType;
    this.label = obj.label;
    this.extPID = obj.extPID;
    this.placeOfBirth = obj.placeOfBirth;
    this.identificationNumber = obj.identificationNumber;
    this.taxNumber = obj.taxNumber;
    this.corporationName = obj.corporationName;
    this.etablishmentDate = obj.etablishmentDate;
    this.legalType = obj.legalType;
    this.birthDate = obj.birthDate;
    this.identity = obj.identity;
    this.type = obj.type;
    this.sinCode = obj.sinCode;
    this.registeredName = obj.registeredName;
    this.enterpriseType = obj.enterpriseType;
    this.streetName = obj.streetName;
    this.displayName = obj.displayName;

  }
}
