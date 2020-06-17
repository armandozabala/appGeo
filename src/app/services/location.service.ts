import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
  public coords = [];



  constructor(public zone: NgZone, private backgroundGeolocation: BackgroundGeolocation, private geolocation: Geolocation, public http: HttpClient, private localNotifications: LocalNotifications) {

  }

  startTracking() {

     
    // Background Tracking

    let config = {
      desiredAccuracy: 10,
      stationaryRadius: 5,
      distanceFilter: 2,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      interval: 3000,
      fastestInterval: 3000,
      activitiesInterval: 3000,
      stopOnTerminate: false,
    };



    this.backgroundGeolocation.configure(config).then((config) => {


      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
       
        console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

        // Run update inside of Angular's zone
        this.zone.run(() => {

       
          this.lat = location.latitude;
          this.lng = location.longitude;

          
          let info = {
              user_id: 2,
              lat: this.lat,
              lng: this.lng
          }

          this.coords.push(info);

          this.http.post('https://admin.diliviriapp.com/api/dboy/updateLocation', info).subscribe((res:any) => {


             this.localNotifications.schedule({
              id: 1,
              text: 'Single_ '+this.lat+ ' ' +this.lng+' ILocalNotification '+' Res ' +res.data,
              sound: 'file://beep.caf',
              data: { secret: res }
            });

          });


        });
        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        //this.backgroundGeolocation.finish(); // FOR IOS ONLY
      });

    }, (err) => {

      console.log(err);

    });


       // Turn ON the background-geolocation system.
       this.backgroundGeolocation.start();


    // Foreground Tracking

  let options = {
    frequency: 3000, 
    enableHighAccuracy: true
  };

  this.watch = this.geolocation.watchPosition();
  
  this.watch.subscribe((position) => {

    console.log(position);

    // Run update inside of Angular's zone
    this.zone.run(() => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

      let info = {
        user_id: 2,
        lat: this.lat,
        lng: this.lng
    }

    this.coords.push(info);

    this.http.post('https://admin.diliviriapp.com/api/dboy/updateLocation', info).subscribe(res => {

       // alert(JSON.stringify(res));
    });

    });

  });

  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    
    this.watch.unsubscribe();

  }
  
}
