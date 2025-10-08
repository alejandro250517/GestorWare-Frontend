import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  //private url='http://localhost:3000/cielApp';

  private url= environment.apiUrl

  constructor(private http: HttpClient) { }

  //Servicio para el inicio de sesion
  login(credenciales: any ): Observable<any> {
    return this.http.post(`${this.url}/iniciar-sesion`, credenciales);  
  }

  // Servicio para guardar token y poder acceder a las rutas protegidas
  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Servicio para obtener el token
  obtenerToken() {
    return localStorage.getItem('token');
  }
  //Servicio que permite verificar si el usuario esta autenticado
  esAutenticado() {
    return !!localStorage.getItem('token'); 
  }

  // Servicio para el cierre de sesion
  cerrarSesion() {
    localStorage.removeItem('token');
  } 
}
