import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-arq',
  templateUrl: 'arq.html',
})
export class ArqPage {
  arquivo;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  atualizaArquivo(event){
    this.arquivo = event.srcElement.files[0];
  }

}
