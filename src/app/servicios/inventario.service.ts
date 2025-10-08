import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  
  private url= environment.apiUrl

  //private url='http://localhost:3000/cielApp'

  constructor(private http: HttpClient) { }

  servicioRegistrarInventario(inventario: any ): Observable<any> {
    return this.http.post(`${this.url}/registrar-inventario`, inventario);
  }

  servicioObtenerInventarios(): Observable<any> {
    return this.http.get(`${this.url}/obtener-inventarios`);
  }
 
  servicioActualizarInventario(id: string, data: any): Observable<any> {
    return this.http.put(`${this.url}/actualizar-inventario/${id}`, data);
  }

  servicioEliminarInventario(id: string) {
    const token =   localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.url}/eliminar-inventario/${id}`, { headers });
  }

  servicioExportarInventario(){
    return this.http.get(`${this.url}/exportar-inventario`, {
   responseType: 'blob' as 'blob'  // 👈 importante para evitar error de tipo
  });
  }
}
