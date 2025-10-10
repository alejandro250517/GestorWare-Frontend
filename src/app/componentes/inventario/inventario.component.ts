import { Component, OnInit, Renderer2, AfterViewInit} from '@angular/core';
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
  styleUrl: './inventario.component.css',

})
export class InventarioComponent implements OnInit, AfterViewInit {

  campoRegionalInvalido: boolean = false;

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

  constructor(private inventarioService: InventarioService, private autenticacionService: AutenticacionService, private router: Router, private renderer: Renderer2 ) {}

 
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

    //Validacion: verificar si el campo regional esta vacio 
    if(!this.inventario.regional || this.inventario.regional.trim() === '') {
      this.campoRegionalInvalido = true;
      Swal.fire({
        icon: 'warning',
        title: 'Campo obligatorio',
        text: 'Debes diligenciar la regional antes de registrar'
      }); 
      return 
    }

    //Validacion: Verificar si el campo oficina esta vacio
    if(!this.inventario.oficina || this.inventario.oficina.trim() === '') {

      Swal.fire({
        icon: 'warning',
        title: 'Campo obligatorio',
        text: 'Debes diligenciar la oficina antes de registrar'
      }); 
      return 
    }
    
    //Validacion: Verificar si los campos de selector estan vacios
    for(let i = 0; i < this.inventario.selector.length; i++) {
      const s = this.inventario.selector[i];

      if(!s.serial || s.serial.trim() === '' ||
         !s.ip || s.ip.trim() === '' ||
         !s.mac || s.mac.trim() === '') {
          Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: `Faltan datos en el Selector ${i + 1}. Asegúrate de llenar Serial, MAC e IP.`
          })
      }
      return; 
    }

    for(let i = 0; i < this.inventario.player.length; i++) {
      const p = this.inventario.player[i];

      if(!p.serial || p.serial.trim() === '' ||
         !p.ip || p.ip.trim() === '' ||
         !p.mac || p.mac.trim() === '' ||
         !p.marca || p.marca.trim() === '' ||
         !p.modelo || p.modelo.trim() === '' ||
         !p.sistemaOperativo || p.sistemaOperativo.trim() === '') {
          Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: `Faltan datos en el Player ${i + 1}. Asegúrate de llenar Serial, MAC, IP, Marca, Modelo y S.O.`
          })
      }
      return; 
    }


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
   
  
  

