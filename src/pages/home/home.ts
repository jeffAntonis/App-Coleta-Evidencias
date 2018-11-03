import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  id = "";
  email = "";
  nome = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.id = navParams.get('retorno')[1][0];
    this.nome = navParams.get('retorno')[1][1];
    this.email = navParams.get('retorno')[1][2];
  }

}

