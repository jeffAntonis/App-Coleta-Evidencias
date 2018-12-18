import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Http, Response } from '@angular/http';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import * as Constants from '../../services/constants';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

//CLASSE
export class LoginPage {
  public loginForm: any;
  messageEmail = ""
  messagePassword = "";
  errorMatricula = false;
  errorPassword = false;
  data: any = {};

  //URL
  url = "";

  //CONSTRUTOR
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public formBuilder: FormBuilder, 
    public loadingCtrl: LoadingController, public toastControl: ToastController) {

    this.loginForm = formBuilder.group({
      matricula: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20), Validators.required])],
    });

    this.url = Constants.URL;
  }

  //VALIDA LOGIN
  validarLogin(){
    let { matricula, password } = this.loginForm.controls;
    
    if (!this.loginForm.valid) {      
      if (!matricula.valid) {
        this.errorMatricula = true;
        this.messageEmail = "Ops! Matrícula inválida";
      } else {
        this.messageEmail = "";
      }
 
      if (!password.valid) {
        this.errorPassword = true;
        this.messagePassword ="A senha precisa ter de 6 a 20 caracteres"
      } else {
        this.messagePassword = "";
      }
    }
    else {
      this.login();
    }    
  }

  //REALIZA LOGIN
  login(){
    let { matricula, password } = this.loginForm.controls;

    let loader = this.loadingCtrl.create({
      content: 'Carregando...'
    });

    loader.present();
    
    var myData = JSON.stringify({acao: 'login', dados: [matricula.value, password.value]});

    this.http.post(this.url + "index.php", myData)
      .subscribe(data => {
        loader.dismiss();
        var retorno = data.json();
        if(retorno[0].indexOf("Sucesso") > -1){
          this.navCtrl.setRoot(HomePage, {
            retorno
          });
        } else{
          this.showToast('Erro! Verifique a matrícula e a senha digitada!');
        }
      })
    ;
  }

  //REGISTRAR 
  registrar(){
    this.navCtrl.push(RegisterPage);
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
