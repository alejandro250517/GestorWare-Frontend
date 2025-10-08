import { Component, OnInit, AfterViewInit } from '@angular/core';
import { InventarioService } from '../../servicios/inventario.service';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { NgForm } from '@angular/forms';
import { Inventario } from '../../models/inventario.model';


declare var M : any;
@Component({
  selector: 'app-inventario',
  standalone: false,
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit, AfterViewInit {

   ingresosRegistrados: any[] = [];
  mostrarTabla: boolean = false;

  inventario: Inventario = {
    regional: '',
    oficina: '',
    selector: [],
    player: [],
    pantalla: [],
    amplificador: [],
    parlante: []
  };

  constructor(private inventarioService: InventarioService, private autenticacionService: AutenticacionService, private router: Router ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
  }

    toggleTabla() {
    this.mostrarTabla = !this.mostrarTabla;
  }
  agregarSelector() {
    this.inventario.selector.push({ serial: '', mac: '', ip: '' });
  }

  eliminarSelector(index: number) {
    this.inventario.selector.splice(index, 1);
  }

  agregarPlayer() {
    this.inventario.player.push({ serial: '', mac: '', ip: '', marca: '', modelo: '', sistemaOperativo: '' });
  }

  eliminarPlayer(index: number) {
    this.inventario.player.splice(index, 1);
  }

  eliminarPantalla(index: number) {
    this.inventario.pantalla.splice(index, 1);
  }

  agregarPantalla() {
    this.inventario.pantalla.push({ marca: '', serial: '', tamano: '' });
  }

  agregarAmplificador() {
    this.inventario.amplificador.push({ serial: '' });
  }

  eliminarAmplificador(index: number) {
    this.inventario.amplificador.splice(index, 1);
  }
      
  agregarParlante() {
    this.inventario.parlante.push({ serial: '' });
  }

  eliminarParlante(index: number) {
    this.inventario.parlante.splice(index, 1);
  }

  registrarInventario() {
    this.inventarioService.servicioRegistrarInventario(this.inventario).subscribe({
      next: res => {
        Swal.fire('Registrado', 'Inventario registrado correctamente', 'success');
      },
      error: err => console.error('Error al registrar:', err)
    });
  }
  obtenerInventario() {
    this.inventarioService.servicioObtenerInventarios().subscribe({
      next: res => {
        this.inventario = res;
        this.mostrarTabla = true;
      },
      error: err => console.error('Error al obtener inventario:', err)
    });
  }
    descargarExcel() {
    Swal.fire({
      title: 'Generando Excel...',
      text: 'Por favor espera unos segundos',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      Swal.close();
    }, 1000);

  this.inventarioService.servicioExportarInventario().subscribe(
    (data: Blob) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventario.xlsx';
      a.click();

      window.URL.revokeObjectURL(url); // limpiar

      Swal.fire({
        icon: 'success',
        title: '¡Descarga completa!',
        text: 'El archivo inventario.xlsx se descargó correctamente.',
        timer: 5000,
        showConfirmButton: false,
      });
    },
    (error) => {
      console.error('Error al descargar el Excel', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al descargar',
        text: 'No se pudo generar el archivo. Intenta nuevamente.',
      });
    }
  );
}
  cerrarSesion(){
    localStorage.removeItem('token');
    this.router.navigate(['/iniciar-sesion']);
  }
}
   
  
  

