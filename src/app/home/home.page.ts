import { Component, numberAttribute, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() {}

  private latitude: number | any;
  private longitude: number | any;

  public async ngOnInit() {
    // this.longitude = 101.45211273792678;
    // this.latitude = 0.7431636232709788;
    //throw new Error("Method not implemented.");

    const position = await Geolocation.getCurrentPosition(); //untuk menampilkan peta sesuai lokasi user
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    const map = new Map({
      basemap: "topo-vector" //Reference to the base of the map
    });

    const view = new MapView({
      container: "container", 
      map: map, 
      zoom: 16,
      center: [this.longitude, this.latitude]
      
    });

    
  }

}
