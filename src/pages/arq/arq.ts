import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { Session } from '../../providers/session/session';
import { Usuario } from '../../models/model/usuario-model';
import { Http } from '../../../node_modules/@angular/http';
import * as Constants from '../../services/constants';

@IonicPage()
@Component({
  selector: 'page-arq',
  templateUrl: 'arq.html',
})

//CLASSE
export class ArqPage {
  arquivo: any;
  nomeArquivo: string = '';
  usuarioLogado: Usuario;
  
  //URL CELULAR
  url = "";

  //CONSTRUTOR
  constructor(public navCtrl: NavController, public navParams: NavParams, public transfer: FileTransfer, public file: File, private loadingCtrl: LoadingController, public filePath: FilePath, public fileChooser: FileChooser, public session: Session, public http: Http, public toastControl: ToastController) {
    
    //PEGANDO OS DADOS DO USUARIO SALVOS NA SESSÃO
    this.session.get()
      .then(res => {
          this.usuarioLogado = new Usuario(res);
      })
    ;
    this.url = Constants.URL;
  }

  //SELECIONA O ARQUIVO QUE SERÁ SALVO
  atualizaArquivo(){
    this.fileChooser.open()
      .then(
        uri => {
          this.filePath.resolveNativePath(uri)
            .then(file => {
              this.arquivo = file;
              this.nomeArquivo = file.substring(file.lastIndexOf('/')+1, file.length);
              this.enviarArquivo();

            }
          )
          .catch(erro => console.log(erro));
        }
      )
      .catch(erro => console.log(erro))
    ;
  }

  //ENVIA O ARQUIVO PARA O SERVIDOR
  enviarArquivo(){
    //CRIANDO OBJETO DO ARQUIVO DE TRANFERENCIA
    const fileTransfer: FileTransferObject = this.transfer.create();

    //OPCOES PARA A TRANSFERENCIA
    let opcoes: FileUploadOptions = {
      fileKey: "file",
      fileName: this.nomeArquivo,
      chunkedMode: false,
      httpMethod: 'post',
      headers: {}
    }

    //REALIZANDO UPLOAD
    fileTransfer.upload(this.arquivo, this.url + "upload.php", opcoes)
      .then((data) => {
        var resultado = JSON.parse(data.response);

        if(resultado[0].indexOf("Sucesso") > -1){
          resultado[1].push(this.usuarioLogado.matricula);
          
          this.salvarDadosEvidencia(resultado[1]);
        } else{
          alert("Erro ao anexar!");
        }
      }, (erro) => {
        console.log(erro);
      })
    ;
  }

  //SALVA OS DADOS DA EVIDENCIA COLETADA NO BANCO
  salvarDadosEvidencia(dados) {
    var myData = JSON.stringify({acao: 'salvarDadosEvidencia', dados: dados});

    this.http.post(this.url + "/index.php", myData)
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

  //EXIBIR TOAST
  showToast(mensagem){
    let toast = this.toastControl.create({
      message: mensagem,
      duration: 3000
    });
    toast.present();
  }
}
