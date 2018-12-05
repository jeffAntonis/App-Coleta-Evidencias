import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { LoginPage } from '../login/login';
import * as Constants from '../../services/constants';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

//CLASSE
export class RegisterPage {
  public registerForm: any;

  //URL 
  url = "";

  //CONSTRUTOR
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public http: Http, public toastControl: ToastController) {
    this.registerForm = formBuilder.group({
      matricula: ['', Validators.required],
      nome: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20), Validators.required])],
    });

    this.url = Constants.URL;
  }

  //REGISTRAR USUARIO
  registrar(){
    let { email, nome, password, matricula } = this.registerForm.controls;

    var myData = JSON.stringify({acao: 'register', dados: [matricula.value, nome.value, password.value, email.value]});

    this.http.post(this.url + "index.php", myData)
      .subscribe(data => {
        var retorno = data.json();
        if(retorno.indexOf("Sucesso") > -1){
          this.showToast('Reistro realizado com sucesso!');
          this.navCtrl.setRoot(LoginPage);
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