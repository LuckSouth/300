import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CredenciaisPage } from '../credenciais/credenciais';

@NgModule({
  declarations: [
    CredenciaisPage,
  ],
  imports: [
    IonicPageModule.forChild(CredenciaisPage),
  ],
})
export class CredenciaisPageModule {}
