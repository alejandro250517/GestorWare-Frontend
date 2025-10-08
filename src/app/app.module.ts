import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutenticacionComponent } from './componentes/autenticacion/autenticacion.component';
import { InventarioComponent } from './componentes/inventario/inventario.component';
import { VerInventarioComponent } from './componentes/ver-inventario/ver-inventario.component';



@NgModule({
  declarations: [
    AppComponent,
    AutenticacionComponent,
    InventarioComponent,
    VerInventarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
