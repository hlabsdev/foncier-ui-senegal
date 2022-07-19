import { Component, OnInit } from '@angular/core';
import { Agendas, Business } from '@app/workstation/agendas/agendas.model';
import { AgendasService } from '@app/workstation/agendas/agendas.service';

@Component({
  selector: 'app-agendas',
  templateUrl: 'agendas.component.html',
  styleUrls: ['agendas.scss']
})
export class AgendasComponent implements OnInit {

  agendasDialog: boolean;
  addAgendasDialog: boolean;
  agendas: Agendas[];
  businesses: Business[];
  selectedAgendas: Agendas[];
  selectedBusinesses: Business[];
  rowGroupMetadata: any;

  constructor(private agendasService: AgendasService) { }

  ngOnInit() {
    this.agendasService.getAgendas().then(data => this.agendas = data);
    this.agendasService.getBusiness().then(data => this.businesses = data);
  }

  addAgendas() {
    this.addAgendasDialog = true;
  }
  viewAgendas() {
    this.agendasDialog = true;
  }

  cancel() {
    this.addAgendasDialog = false;
  }

  saveAgendas() {
    this.addAgendasDialog = false;
  }
}
