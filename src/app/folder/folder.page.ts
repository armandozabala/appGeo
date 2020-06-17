import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../services/location.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;


   constructor(private activatedRoute: ActivatedRoute,  public location: LocationService) {

   }
   

ionViewDidLeave(){
  this.location.stopTracking();
}
  ngOnInit() {
  }


  start(){
    this.location.startTracking();
  }

  stop(){
    this.location.stopTracking();
  }

}
