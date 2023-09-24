import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer'; 
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import Basemap from '@arcgis/core/Basemap'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  selectedBasemap!: string;

  constructor() {}

  //private latitude: number | any;
  //private longitude: number | any;

   async ngOnInit() {
    //throw new Error("Method not implemented");
    //this.longitude = 113.186651484203655;
    //this.latitude = 0.21302508722508534;
    //const position = await Geolocation.getCurrentPosition();
    //this.latitude = position.coords.latitude;
    //this. longitude = position.coords.longitude;

    const map = new Map({
      basemap: "gray-vector"
    });

    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 8
    });

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl});
    map.add(weatherServiceFL);

    this.addWeatherServiceMarker();

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this),100000);
  }

  async changeBasemap() {
    this.mapView.map.basemap = this.selectedBasemap;
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1]});
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }

  addWeatherServiceMarker() {
    const weatherServiceLocation = new Point({
      latitude: 38.912431472071475, 
      longitude: -77.08922424495874,
    });

    const weatherServiceMarker = new Graphic({
      geometry: weatherServiceLocation,
      symbol: new SimpleMarkerSymbol(),
    });

    this.mapView.graphics.add(weatherServiceMarker);
  }

}
const WeatherServiceUrl = 
  'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'
