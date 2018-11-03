import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  foto: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera) {
   
  }

  tirarFoto(){
    this.foto = '';

    const opcoes: CameraOptions = {
      quality: 100,
      //DEVOLVE NA BASE 64
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true
    }

    //PEGANDO A IMAGEM
    this.camera.getPicture(opcoes)
      //VALIDANDO AS PROMESSAS
      .then((imagemData) => {
        let base64Image = 'data:image/jpeg;base64,' + imagemData;
        this.foto = base64Image;

      }, (erro) => {
        console.log(erro);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  pegarFoto(){
    this.foto = '';

    const opcoes: CameraOptions = {
      quality: 100,
      //DEVOLVE NA BASE 64
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true
    }

    //PEGANDO A IMAGEM
    this.camera.getPicture(opcoes)
      //VALIDANDO AS PROMESSAS
      .then((imagemData) => {
        let base64Image = 'data:image/jpeg;base64,' + imagemData;
        this.foto = base64Image;

      }, (erro) => {
        console.log(erro);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }
}
