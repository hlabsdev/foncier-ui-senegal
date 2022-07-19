import { Component } from '@angular/core';

@Component({
  selector: 'sog-scroll',
  template: '<div class="w-100 sog-scroll-container"><ng-content></ng-content></div>',
  styles: [`

    @import "branding_variables.scss";
    .sog-scroll-container::-webkit-scrollbar-track
    {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
      background-color: #F5F5F5;
    }

    .sog-scroll-container::-webkit-scrollbar
    {
      width: 10px;
      background-color: #F5F5F5;
    }

    .sog-scroll-container::-webkit-scrollbar-thumb
    {
      background-color: set_brand_color_hsla(eland-cold-blue, 80, 100);
    }
  `]
})
export class SogScrollComponent {}
