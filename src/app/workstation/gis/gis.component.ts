import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '@app/core/app-config/config.service';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { loadModules } from 'esri-loader';
import esri = __esri;

@Component({
  selector: 'app-gis',
  templateUrl: './gis.component.html',
  styleUrls: ['./gis.component.scss']
})
export class GisComponent implements OnInit, OnDestroy {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  @Input() formVariables: FormVariables = new FormVariables({});
  @Input() isSpatialUnit: Boolean;
  @Input() parcelNICAD: string;

  @Output() mapClicked = new EventEmitter<any>();

  parcels: any[];
  highlight: any;
  config: any;

  constructor(
    protected router: Router,
    private configService: ConfigService,
  ) { }

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [
        Map,
        MapView,
        Compass,
        ScaleBar,
        FeatureLayer,
        GraphicsLayer,
        Graphic,
        Legend,
        BasemapToggle,
        Search,
        SpatialReference,

      ] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/widgets/Compass',
        'esri/widgets/ScaleBar',
        'esri/layers/FeatureLayer',
        'esri/layers/GraphicsLayer',
        'esri/Graphic',
        'esri/widgets/Legend',
        'esri/widgets/BasemapToggle',
        'esri/widgets/Search',
        'esri/geometry/SpatialReference',
      ]);

      const labelClass = {
        symbol: {
          type: 'text',
          color: 'green',
          font: {
            family: 'Arial',
            size: 8,
            weight: 'bold'
          }
        },
        labelPlacement: 'above-center',
        labelExpressionInfo: {
          expression: '$feature.nicad',
        }
      };

      const context = [
        {
          type: 'fields',
          fieldInfos: [
            { fieldName: 'objectid', label: 'objectid' },
            { fieldName: 'nicad', label: 'nicad' },
            { fieldName: 'name', label: 'name' },
            { fieldName: 'createdbyrecord', label: 'createdbyrecord' },
            { fieldName: 'retiredbyrecord', label: 'retiredbyrecord' },
            { fieldName: 'statedarea', label: 'statedarea' },
            { fieldName: 'statedareaunit', label: 'statedareaunit' },
            { fieldName: 'calculatedarea', label: 'calculatedarea' },
            { fieldName: 'miscloseratio', label: 'miscloseratio' },
            { fieldName: 'misclosedistance', label: 'misclosedistance' },
            { fieldName: 'isseed', label: 'isseed' },
            { fieldName: 'created_user', label: 'created_user' },
            { fieldName: 'created_date', label: 'created_date' },
            { fieldName: 'last_edited_user', label: 'last_edited_user' },
            { fieldName: 'last_edited_date', label: 'last_edited_date' },
            { fieldName: 'globalid', label: 'globalid' },
            { fieldName: 'toponymie', label: 'toponymie' },
            { fieldName: 'commune', label: 'commune' },
            { fieldName: 'region', label: 'region' },
            { fieldName: 'departemen', label: 'departemen' },
            { fieldName: 'numéro_pa', label: 'numéro_pa' },
            { fieldName: 'numéro_se', label: 'numéro_se' },
            { fieldName: 'surface_no', label: 'surface_no' },
            { fieldName: 'surface_ba', label: 'surface_ba' },
            { fieldName: 'codesectio', label: 'codesectio' },
            { fieldName: 'lotissemen', label: 'lotissemen' },
            { fieldName: 'numlot', label: 'numlot' },
            { fieldName: 'sourcecad', label: 'sourcecad' },
            { fieldName: 'titremere', label: 'titremere' },
            { fieldName: 'titreparce', label: 'titreparce' },
            { fieldName: 'natjuri', label: 'natjuri' },
            { fieldName: 'vallocativ', label: 'vallocativ' },
            { fieldName: 'supreelle', label: 'supreelle' },
            { fieldName: 'suplegale', label: 'suplegale' },
            { fieldName: 'num_parcel', label: 'num_parcel' },
            { fieldName: 'action', label: 'action' },
            { fieldName: 'old_nicad', label: 'old_nicad' },
            { fieldName: 'id_external_task', label: 'id_external_task' },
            { fieldName: 'Shape__Area', label: 'Shape__Area' },
            { fieldName: 'Shape__Length', label: 'Shape__Length' },
          ],
        }
      ];

      const template = {
        title: 'Ngor parcel {objectid}',
        content: context,
        outFields: ['*'],
        lastEditInfoEnabled: false,
      };

      const parcelLayer = new FeatureLayer({
        url: this.config.mapUrl,
        outFields: ['*'],
        popupTemplate: template,
        labelingInfo: [labelClass],
      });

      // Configure the Map
      const mapProperties = {
        basemap: this.config.mapBaseMap,
        layers: [parcelLayer],
      };

      const map = new Map(mapProperties);

      // Initialize the MapView
      const mapViewProperties = {
        id: 'mapViewNode',
        container: this.mapViewEl.nativeElement,
        center: this.config.mapCenter.split(','),
        zoom: this.config.mapScale,
        map: map,
        highlightOptions: {
          color: 'red'
        }
      };

      const view = new MapView(mapViewProperties);

      await view.when(() => {

        view.navigation.browserTouchPanEnabled = false;

        view.popup.dockEnabled = true;

        view.on('mouse-wheel', function (event) {
          event.stopPropagation();
        });

        view.ui.padding = 5;

        view.ui.add(new Compass({ view: view }), 'top-left');

        view.ui.add(new ScaleBar({
          view: view,
          style: 'ruler',
          unit: 'metric'
        }), 'bottom-left');

        if (!this.isSpatialUnit) {
          view.ui.add(new Legend({
            view: view,
            layerInfos: [
              {
                layer: parcelLayer,
                title: 'Parcel Fabric'
              },
            ],
          }), 'bottom-right');

          view.ui.add(new BasemapToggle({
            view: view,
            nextBasemap: 'hybrid'
          }), 'bottom-right');
        }

        view.on('click', evt => {
          const screenPoint = evt.screenPoint;
          view.hitTest(screenPoint).then(response => {
            // do something with the result graphic
            const graphic = response.results[0].graphic;
            this.mapClicked.emit(graphic.attributes);
          });
        });


        const searchWidget = new Search({
          view: view,
          sources: [{
            layer: parcelLayer,
            searchFields: ['nicad', 'num_parcel'],
            exactMatch: false,
            name: 'Dakar NICAD',
            displayField: 'nicad',
            outFields: ['*'],
            placeholder: 'e.g.: 0113013200700099',
            maxResults: 6,
            maxSuggestions: 6,
            suggestionsEnabled: true,
            minSuggestCharacters: 0,
          }],
          searchAllEnabled: false,
          locationEnabled: false,
          activeSourceIndex: 1,
        });

        view.ui.add(searchWidget, {
          position: 'top-right',
          index: 1
        });

        searchWidget.on('search-complete', event => {
          // The results are stored in the event Object[]

          console.log('Results of the search: ', event);

        });

        // graphic
        let queryString = '';

        if (this.parcelNICAD !== undefined) {
          queryString = 'nicad = \'' + this.parcelNICAD + '\'';
        }

        if (!this.isSpatialUnit && this.formVariables.arcGIS.NICADs !== undefined) {
          const nicads = this.formVariables.arcGIS.NICADs;
          nicads.push(this.formVariables.arcGIS.NICAD);
          queryString = 'nicad IN (\'' + nicads.join('\',\'') + '\')';
        }

        if (this.parcelNICAD === undefined && this.formVariables.arcGIS.NICAD !== undefined) {
          queryString = 'nicad = \'' + this.formVariables.arcGIS.NICAD + '\'';
        }

        if (queryString !== '') {
          const query = {
            where: queryString,
            returnGeometry: true,
            returnCentroid: true,
            outFields: ['*'],
            outSpatialReference: new SpatialReference(4326),
          };

          parcelLayer.queryFeatures(query).then(result => {
            const rings = result.features.map(item => item.geometry).map(({ rings: rings1 }) => rings1).map(item => item[0]);
            const polygonGraphic = new Graphic({
              geometry: {
                type: 'polygon',
                rings: rings
              },
              symbol: {
                type: 'simple-fill',
                color: [0, 0, 255, 0.5],
                outline: {
                  color: [0, 0, 255],
                  width: 2
                }
              }
            });

            const graphicsLayer = new GraphicsLayer();
            graphicsLayer.add(polygonGraphic);
            view.map.add(graphicsLayer);

            // center parcel
            view.goTo({
              center: [
                polygonGraphic.geometry.centroid.longitude,
                polygonGraphic.geometry.centroid.latitude
              ],
              zoom: 18
            }, {
              duration: 2000
            })
              .catch(err => {
                console.log(err);
              });

            if (this.parcelNICAD !== undefined) {
              this.mapClick(result.features[0].attributes);
            }
          });
        }
        // graphic

      });

      return view;
    } catch (error) {
      console.error('EsriLoader: ', error);
    }
  }

  ngOnInit() {
    this.config = this.configService.getDefaultConfig('EXTERNAL_SERVICES.arcGIS');
    this.initializeMap().then(res => {

    });
  }

  ngOnDestroy() {

  }

  mapClick(val: any) {
    this.mapClicked.emit(val);
  }




}
