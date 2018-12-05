import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaEvidenciasPage } from './lista-evidencias';

@NgModule({
  declarations: [
    ListaEvidenciasPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaEvidenciasPage),
  ],
})
export class ListaEvidenciasPageModule {}
