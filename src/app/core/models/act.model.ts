import * as _ from 'lodash';
export class Act {
  id: string;
  sourceId: string;
  actNumber: string;
  actDate: Date;
  actType: any;
  actObject: string;
  signingAuthorityType: any;
  documentName: string;

  constructor(obj: any = {}) {
    this.id = obj.id;
    this.sourceId = obj.sourceId;
    this.actNumber = obj.actNumber;
    this.actDate = obj.actDate;
    this.actType = obj.actType;
    this.actObject = obj.actObject;
    this.signingAuthorityType = obj.signingAuthorityType;
    this.documentName = obj.documentName;
  }

  getActForm(readOnly: Boolean = false) {
    return [
      {
        'type': 'select',
        'label': 'ACT.ACT_FILE_NAME',
        'name': 'sourceId',
        'options': [],
        'groupLabel': ['ACT'],
        'validations': [{
          'name': 'required',
          'validator': 'Validators.required'
        }]
      },
      {
        'type': 'input',
        'label': 'ACT.ACT_NUMBER',
        'readOnly': readOnly,
        'inputType': 'text',
        'name': 'actNumber',
        'groupLabel': ['ACT'],
        'validations': [{
          'name': 'required',
          'validator': 'Validators.required'
        }]
      },
      {
        'type': 'date',
        'label': 'ACT.ACT_DATE',
        'readOnly': readOnly,
        'name': 'actDate',
        'groupLabel': ['ACT'],
        'validations': [{
          'name': 'required',
          'validator': 'Validators.required'
        }]
      },
      {
        'type': 'select',
        'label': 'ACT.ACT_TYPE',
        'readOnly': readOnly,
        'name': 'actType',
        'options': [],
        'optionsSearchString': 'ACT_TYPE',
        'groupLabel': ['ACT'],
        'validations': [{
          'name': 'required',
          'validator': 'Validators.required'
        }]
      },
      {
        'type': 'select',
        'label': 'ACT.ACT_DOCUMENT_NAME',
        'readOnly': readOnly,
        'name': 'documentName',
        'options': [],
        'baseSearchStringName': 'actType',
        'optionsSearchString': 'ACT_TYPE',
        'objectMapper': {
          '*': '',
          'ADMINISTRATIVE_ACT': 'DOC_ACT_ADMINISTRATIVE',
          'JUDICIAL_ACT': 'DOC_ACT_JUDICIAL',
          'NOTARIAL_ACT': 'DOC_ACT_NOTARIAL',
          'AUTHORISATION_ACT': 'DOC_AUTHORIZATION',
          'DECREE_ACT': 'DOC_ASSIGNMENT_CONCESSION',
          'ACQUISITION_ACT': 'DOC_DECREE_DECISION_ORDENANCE'
        },
        'groupLabel': ['ACT'],
        'validations': [{
          'name': 'required',
          'validator': 'Validators.required'
        }]
      },
      {
        'type': 'input',
        'label': 'ACT.ACT_OBJECT',
        'readOnly': readOnly,
        'inputType': 'text',
        'name': 'actObject',
        'groupLabel': ['ACT'],
        'validations': [{
          'name': 'required',
          'validator': 'Validators.required'
        }]
      },
      {
        'type': 'select',
        'label': 'ACT.ACT_SIGNING_AUTHORITY_TYPE',
        'readOnly': readOnly,
        'name': 'signingAuthorityType',
        'options': [],
        'optionsSearchString': 'SIGNING_AUTHORITY_TYPE',
        'groupLabel': ['ACT'],
        'validations': [{
          'name': 'required',
          'validator': 'Validators.required'
        }]
      }
    ];
  }
}
