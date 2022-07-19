import { OnInit, Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html'
})
export class FileViewerComponent implements OnInit {
  @Input() displayObj: any;
  @Input() render_text: Boolean = true;

  @Output() closeViewer = new EventEmitter<boolean>();
  zoom: Number = 1.0;
  rotateValue: Number = 0;
  page: Number;
  renderedFile: any;
  fileMenu: MenuItem[];
  popupWin: any;
  fileUrl: any;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    const url = URL.createObjectURL(this.displayObj.rawContent);
    this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    this.fileMenu = [
      {
        icon: 'fa fa-external-link', command: (event) => {
          return this.openNewWin();
        }
      },
      {
        icon: 'fa fa-times-circle', command: (event) => {
          return this.close();
        }
      }
    ];

    if (this.displayObj && this.displayObj.viewerProp.viewer === 'pdf') {
      this.fileMenu.push({
        icon: 'fa fa-search-plus', command: (event) => {
          return this.updateZoom(0.1);
        }
      },
        {
          icon: 'fa fa-search-minus', command: (event) => {
            return this.updateZoom(-0.1);
          }
        },
        {
          icon: 'fa fa-repeat', command: (event) => {
            return this.rotate();
          }
        });
    }
  }

  updateZoom(amount: Number) {

    if ((amount > 0 && this.zoom < 1) || (amount < 0 && this.zoom > 1)) {
      this.zoom = 1.0;
    }

    this.zoom = Math.round((Number(this.zoom) + Number(amount)) * 100) / 100;
  }

  renderPDF(pdf: PDFDocumentProxy) {
    this.renderedFile = pdf;
  }

  rotate() {
    this.rotateValue = Number(this.rotateValue) + 90;
  }

  openNewWin() {
    this.popupWin = window.open(this.fileUrl, 'docOpen', `directories=no,titlebar=no,toolbar=no,
    menubar=no,location=no,height=570,width=520,scrollbars=yes,status=no`);
    if (this.popupWin) {
      this.popupWin.location.href = this.displayObj.file;
    }
    this.close(false);
  }

  close(keepPopupWin = true) {
    if (keepPopupWin && this.popupWin) {
      this.popupWin.close();
    }
    this.closeViewer.emit(true);
  }
}
