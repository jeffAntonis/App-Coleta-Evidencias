import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  foto: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera, public transfer: FileTransfer, public file: File) {
   
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

  enviar(){
    //CRIANDO OBJETO DO ARQUIVO DE TRANFERENCIA
    const fileTransfer: FileTransferObject = this.transfer.create();

    //NUMERO RANDOMICO
    var random = Math.floor(Math.random() * 100);

    //OPCOES PARA A TRANSFERENCIA
    let opcoes: FileUploadOptions = {
      fileKey: "file",
      fileName: "imagem_" + random + ".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {}
    }

    const url = 'https://jefferson-icm1.000webhostapp.com/arquivos/upload.php';

    fileTransfer.upload(this.foto, url, opcoes)
      .then((data) => {
        console.log(data);
      }, (erro) => {
        console.log(erro);
      });
  }
}
