import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { Session } from '../../providers/session/session';
import { Usuario } from '../../models/model/usuario-model';
import * as Constants from '../../services/constants';

@IonicPage()
@Component({
  selector: 'page-lista-evidencias',
  templateUrl: 'lista-evidencias.html',
})
export class ListaEvidenciasPage {
  usuarioLogado: Usuario;
  evidenciasColetadas: any;

  //URL CELULAR
  url = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public session: Session, 
    public fileTransfer: FileTransfer, public file: File, public toastControl: ToastController, public diagnostic: Diagnostic, public androidPermissions: AndroidPermissions) {
    
    //PEGANDO OS DADOS DO USUARIO SALVOS NA SESSÃO
    this.session.get()
      .then(res => {
          this.usuarioLogado = new Usuario(res);

          //CHAMANDO A FUNÇÃO PARA LISTAR EVIDENCIAS COLETADAS
          this.listarEvidenciasColetadas();
      })
    ;

    this.url = Constants.URL;
  }

  //FUNÇÃO PARA LISTAR EVIDENCIAS COLETADAS
  listarEvidenciasColetadas(){
    var myData = JSON.stringify({acao: 'listarEvidenciasColetadas', dados: this.usuarioLogado.matricula});

    this.http.post(this.url + "index.php", myData)
      .subscribe(data => {
        this.evidenciasColetadas = data.json();
      });
  }

  //DOWNLOAD DO EVIDENCIA    
  download(dados){
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    this.diagnostic.requestExternalStorageAuthorization().then(()=>{

      fileTransfer.download(this.url + "arquivos/" + dados.NO_EVIDENCIA, this.file.externalRootDirectory + "Download/" + dados.NO_EVIDENCIA).then((entry) => {
        console.log('download complete: ' + entry.toURL());
        this.showToast('Download realizado com sucesso!');
      }, (error) => {
        console.log(error);
        this.showToast('Erro ao realizar operação!');
      });

    }).catch(error => {
      console.log(error);
    });    
  }

  //EXCLUIR EVIDENCIA
  excluir(dados){

    var myData = JSON.stringify({acao: 'excluirEvidencia', dados: dados});

    this.http.post(this.url + "index.php", myData)
      .subscribe(data => {
        console.log(data);
        var retorno = data.json();

        if(retorno.indexOf("Sucesso") > -1){
          this.showToast('Evidência excluída com sucesso!');
          this.listarEvidenciasColetadas();
        } else{
          this.showToast('Erro ao realizar operação!');
        }
      })
    ;
  }

  getPermission(dados, textFuncao) {

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          
          if(textFuncao == "excluir"){
            this.excluir(dados);
          } else{
            this.download(dados);
          }
        } 
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then(status => {
              if(status.hasPermission) {

                if(textFuncao == "excluir"){
                  this.excluir(dados);
                } else{
                  this.download(dados);
                }
              }
            });
        }
      });
  }

  showToast(mensagem){
    let toast = this.toastControl.create({
      message: mensagem,
      duration: 3000
    });

    toast.present();
  }
}
