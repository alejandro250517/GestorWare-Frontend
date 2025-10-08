import { Component, OnInit, AfterViewInit } from '@angular/core';
import { InventarioService } from '../../servicios/inventario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var M: any;

@Component({
  selector: 'app-ver-inventario',
  standalone: false,
  templateUrl: './ver-inventario.component.html',
  styleUrl: './ver-inventario.component.css'
})
export class VerInventarioComponent implements OnInit, AfterViewInit {

  ingresosRegistrados: any[] = [];
  inventarioEditado: any = {};


  constructor(private inventarioService: InventarioService, private router: Router) { }
  
    ngOnInit(): void {
      this.obtenerIngresos();
        const modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);
    }

    ngAfterViewInit(): void {
      M.Sidenav.init(document.querySelectorAll('.sidenav'));
    }

      obtenerIngresos() {
      this.inventarioService.servicioObtenerInventarios().subscribe(
      data => {
      this.ingresosRegistrados = data;
    },
    error => console.error(error)
  );
}

    abrirModalEditar(inv: any) {
    this.inventarioEditado = {
    ...inv,
    productoId: inv.productoId ? { ...inv.productoId } : null,
    usuario: inv.usuario ? { ...inv.usuario } : null,
    selectores: inv.selectores ? inv.selectores.map((s: any) => ({ ...s })) : [],
    encuestadores: inv.encuestadores ? inv.encuestadores.map((e: any) => ({ ...e })) : [],
    players: inv.players ? inv.players.map((p: any) => ({ ...p })) : [],
    otros: inv.otros ? inv.otros.map((o: any) => ({ ...o })) : []
  };

  const elem = document.getElementById('modalEditar');
  if (elem) {
    const modal = M.Modal.getInstance(elem);
    modal.open();
     setTimeout(() => {
      M.updateTextFields(); // 👈 Actualiza los labels de los inputs
    }, 100); // Pequeño delay para asegurar que el modal se renderice
  }
}


      editarInventario(inv: any) {
    this.inventarioEditado = { ...inv }; 

    const elem = document.getElementById('modalEditar');
    if (elem) {
      const modal = M.Modal.getInstance(elem);
      modal.open();
    }
  }

  

      guardarCambios() {
        this.inventarioService.servicioActualizarInventario(this.inventarioEditado._id, this.inventarioEditado).subscribe(
      res => {
        Swal.fire('Actualizado', 'Inventario actualizado correctamente', 'success');
        this.obtenerIngresos();
        const elem = document.getElementById('modalEditar');
        if (elem) {
          const modal = M.Modal.getInstance(elem);
          modal.close();
        }
      },
      err => {
        Swal.fire('Error', 'No se pudo actualizar el inventario', 'error');
      }
    );
  }

    eliminarInventario(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción', 
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventarioService.servicioEliminarInventario(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'No se pudo eliminar el usuario', 'error');
          }
          
        });
        this.obtenerIngresos();
      }
    });
  }


  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/autenticacion']);
  }
}
