import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
// import { FilePath } from '@ionic-native/file-path';


@IonicPage()
@Component({
  selector: 'page-arq',
  templateUrl: 'arq.html',
})
export class ArqPage {
  arquivo:any;
  nameArquivo: string = '';
  tipoArquivo: string = '';
  urlArquivo: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public transfer: FileTransfer, public file: File, private loadingCtrl: LoadingController) {
 
  }

  atualizaArquivo(event){
    console.log(event);
    this.arquivo = event.srcElement.files[0];
    this.nameArquivo = this.arquivo.name;

    console.log(this.arquivo);

    this.urlArquivo = event.srcElement.value;

    this.enviarArquivo();
  }

  enviarArquivo(){

    let loader = this.loadingCtrl.create({
      content: 'Enviando...'
    });

    loader.present();

    //CRIANDO OBJETO DO ARQUIVO DE TRANFERENCIA
    const fileTransfer: FileTransferObject = this.transfer.create();

    //NUMERO RANDOMICO
    // var random = Math.floor(Math.random() * 100);

    //OPCOES PARA A TRANSFERENCIA
    let opcoes: FileUploadOptions = {
      fileKey: "file",
      fileName: this.nameArquivo,
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: this.arquivo.type,
      headers: {}
    }

    //TESTANDO = https://ionicframework.com/docs/native/file/

    const url = 'https://jefferson-icm1.000webhostapp.com/arquivos/upload.php';

    console.log(this.file.applicationStorageDirectory);

    this.file.checkFile(this.file.applicationStorageDirectory, this.nameArquivo)
      .then((result) => { 
        console.log('file exists :' + result); 
    },(error) => { 
      console.log('error : ' + JSON.stringify(error));
    });

    fileTransfer.upload(this.file.applicationStorageDirectory  + "" + this.nameArquivo, url, opcoes)
      .then((data) => {
        console.log(data);
        loader.dismiss();
      }, (erro) => {
        console.log(erro);
        loader.dismiss();
      });
  }

}
