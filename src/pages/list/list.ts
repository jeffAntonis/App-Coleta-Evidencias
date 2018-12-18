import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";

import { Session } from '../../providers/session/session';
import { Usuario } from '../../models/model/usuario-model';
import { Http } from '../../../node_modules/@angular/http';
import * as Constants from '../../services/constants';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  foto: any;
  usuarioLogado: Usuario;
  
  //URL CELULAR
  url = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera, public transfer: FileTransfer, 
    public file: File, public toastControl: ToastController, public session: Session, public http: Http) {

      //PEGANDO OS DADOS DO USUARIO SALVOS NA SESSÃO
      this.session.get()
        .then(res => {
            this.usuarioLogado = new Usuario(res);
        })
      ;
      this.url = Constants.URL;
  }

  tirarFoto(){
    this.foto = '';

    const opcoes: CameraOptions = {
      quality: 85,
      //DEVOLVE NA BASE 64
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      // encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
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
      quality: 85,
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
      headers: {}
    }

    fileTransfer.upload(this.foto, this.url + "upload.php", opcoes)
      .then((data) => {
        console.log(data);
        var resultado = JSON.parse(data.response);

        if(resultado[0].indexOf("Sucesso") > -1){
          resultado[1].push(this.usuarioLogado.matricula);
          
          this.salvarDadosEvidencia(resultado[1]);
        } else{
          this.showToast('Erro ao realizar operação!');
        }
      }, (erro) => {
        console.log(erro);
      });
  }

  salvarDadosEvidencia(dados) {

    var myData = JSON.stringify({acao: 'salvarDadosEvidencia', dados: dados});

    this.http.post(this.url + "index.php", myData)
      .subscribe(data => {
        var retorno = data.json();
        console.log(retorno);

        if(retorno.indexOf("Sucesso") > -1){
          this.showToast('Upload realizado com sucesso!');
        } else{
          this.showToast('Erro ao realizar operação!');
        }
      })
    ;   
  }

  showToast(mensagem){
    let toast = this.toastControl.create({
      message: mensagem,
      duration: 3000
    });

    toast.present();
  }
}
