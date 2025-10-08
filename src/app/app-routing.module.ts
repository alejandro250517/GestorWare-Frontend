import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AutenticacionComponent } from './componentes/autenticacion/autenticacion.component';
import { InventarioComponent } from './componentes/inventario/inventario.component';
import { VerInventarioComponent } from './componentes/ver-inventario/ver-inventario.component';
import { autenticacionGuard } from './guards/autenticacion.guard';
import { loginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: 'iniciar-sesion', component: AutenticacionComponent, canActivate: [loginGuard] },
  { path: 'inventario', component: InventarioComponent, canActivate: [autenticacionGuard] }, 
  { path: 'ver-inventario', component: VerInventarioComponent, canActivate: [autenticacionGuard]},

  { path: '**', redirectTo: '/iniciar-sesion'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule { }
