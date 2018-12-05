import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Usuario } from '../../models/model/usuario-model';
import { Session } from '../../providers/session/session';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  matricula = 0;
  email = "";
  nome = "";
  usuario: Usuario;

  constructor(public navCtrl: NavController, public navParams: NavParams, public session: Session) {

    this.matricula = navParams.get('retorno')[1]['NR_MATRICULA'];
    this.nome = navParams.get('retorno')[1]['NO_USUARIO'];
    this.email = navParams.get('retorno')[1]['DS_EMAIL'];

    this.criaSession();
  }

  //CRIA A SESSÃO PARA SALVAR OS DADOS DO USUARIO AUTENTICADO
  criaSession() {
    this.usuario = new Usuario();

    this.usuario.matricula = this.matricula;
    this.usuario.email = this.email;
    this.usuario.nome = this.nome;

    //DISPARANDO A SESSÃO
    this.session.create(this.usuario);
  } 
}

