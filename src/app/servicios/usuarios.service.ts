import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  //private url = 'http://localhost:3000/cielApp';
  private url = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  serviceRegistrarUsuario(usuario: any ): Observable<any> {
    return this.http.post(`${this.url}/registrar-usuario`, usuario);
  }
} 
