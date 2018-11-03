import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Response } from '@angular/http';

import 'rxjs';
import { ListPage } from '../list/list';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: any;
  messageEmail = ""
  messagePassword = "";
  errorEmail = false;
  errorPassword = false;

  private url: string = 'https://jefferson-icm1.000webhostapp.com/';
  data: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public formBuilder: FormBuilder) {
    this.data.username = '';
    this.data.response = '';
    
    this.http = http;

    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20), Validators.required])],
    });
  }

  //VALIDA LOGIN
  validarLogin(){
    let { email, password } = this.loginForm.controls;
    
    if (!this.loginForm.valid) {
      
      if (!email.valid) {
        this.errorEmail = true;
        this.messageEmail = "Ops! Email inválido";
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

    let { email, password } = this.loginForm.controls;

    
    var myData = JSON.stringify({acao: 'login', dados: [email.value, password.value]});

    this.http.post(this.url, myData)
      .subscribe(data => {

        var retorno = data.json();

        if(retorno[0].indexOf("sucesso") > -1){
          alert('Login Realizado com sucesso!');
          this.navCtrl.setRoot(HomePage, {
            retorno
          });
        } else{
          alert('Erro ao realizar login!');
        }
      });
  }

  registrar(){
    alert('aqui');
    this.navCtrl.push(ListPage);
  }
}
