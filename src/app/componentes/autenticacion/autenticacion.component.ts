import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-autenticacion',
  standalone: false,
  templateUrl: './autenticacion.component.html',
  styleUrl: './autenticacion.component.css',
  animations: [
        trigger('growShrink', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'scale(0)', opacity: 0 }))
      ])
    ])
  ]
})
export class AutenticacionComponent implements OnInit {

  correo: string = '';
  contrasena: string = '';

  constructor(private autenticacionService: AutenticacionService
    , private router: Router
  ) { }

  ngOnInit(): void {
    
  }
  login() {
    this.autenticacionService.login({
      correo: this.correo,
      contrasena: this.contrasena
    }).subscribe({
      next: (res: any) => {
        this.autenticacionService.guardarToken(res.token);
  
        // Mostrar alerta con nombre de usuario (correo)
        let timerInterval: any;
        Swal.fire({
          title: '¡Bienvenido a GestorWare!',
          html: `!<b>${this.correo}</b>!<br>A continuacion te redireccionaremos al modulo de gestión`,
          imageWidth: 200,
          imageHeight: 200,
          background: '#2c829eff',
          color: 'white',
          timer: 1000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup()?.querySelectorAll('b')[1];
            timerInterval = setInterval(() => {
              if (timer) {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            this.router.navigate(['/inventario']), { replaceURL: true}
          }
        });
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: error.error.message || 'Credenciales inválidas',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }
  cerrarSesion() {
    this.autenticacionService.cerrarSesion();
    this.router.navigate(['/iniciar-sesion']);
  }
  
    

}
