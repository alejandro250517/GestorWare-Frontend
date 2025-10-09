/*
* @author Brayan Cruz | Brynware 
* @email brayanmcruz.425@gmail.com
* @github https://github.com/alejandro2505
*/

// ------------------------------------------------------------
// Importación de módulos necesarios para el funcionamiento del componente
// ------------------------------------------------------------

import { Component, OnInit } from '@angular/core'; // Permite crear componentes y usar el ciclo de vida OnInit
import { trigger, state, style, animate, transition } from '@angular/animations'; // Módulos para crear animaciones en Angular
import { AutenticacionService } from '../../servicios/autenticacion.service'; // Servicio personalizado que maneja las peticiones de login y token
import { Router } from '@angular/router'; // Permite la navegación entre rutas (redirección)
import Swal from 'sweetalert2'; // Librería para mostrar alertas elegantes

// ------------------------------------------------------------
// Decorador del componente (configuración principal)
// ------------------------------------------------------------
@Component({
  selector: 'app-autenticacion',            // Nombre del selector que se usa en el HTML principal
  standalone: false,                        // Indica que este componente depende de un módulo
  templateUrl: './autenticacion.component.html', // Ruta del archivo HTML asociado
  styleUrl: './autenticacion.component.css',     // Ruta del archivo CSS asociado
  
  // --------------------------------------------------------
  // Definición de animaciones (entrada y salida con efecto de escala)
  // --------------------------------------------------------
  animations: [
    trigger('growShrink', [ // Nombre de la animación
      // Transición al entrar (escala desde 0 hasta 1 con opacidad)
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),             // Estado inicial (invisible y pequeño)
        animate('500ms ease-out', style({ transform: 'scale(1)', opacity: 1 })) // Animación al aparecer
      ]),
      // Transición al salir (escala de 1 a 0 y se desvanece)
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'scale(0)', opacity: 0 }))
      ])
    ]),
    trigger('efectoPie',[
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))             // Estado inicial (invisible y pequeño)
      ])
    ])
  ]
})
export class AutenticacionComponent implements OnInit { // Clase del componente

  // ------------------------------------------------------------
  // Declaración de variables del componente
  // ------------------------------------------------------------
  
  campoCorreoInvalido: boolean = false;       // Indica si el campo de correo está vacío o inválido
  campoContrasenaInvalido: boolean = false;   // Indica si el campo de contraseña está vacío o inválido

  correo: string = '';                        // Variable vinculada al input del correo
  contrasena: string = '';                    // Variable vinculada al input de la contraseña

  // ------------------------------------------------------------
  // Inyección de dependencias (servicios y router)
  // ------------------------------------------------------------
  constructor(
    private autenticacionService: AutenticacionService, // Servicio encargado de la autenticación con el backend
    private router: Router                              // Permite redireccionar entre rutas de la aplicación
  ) { }

  // ------------------------------------------------------------
  // Método del ciclo de vida: se ejecuta al inicializar el componente
  // ------------------------------------------------------------
  ngOnInit(): void {
  }

  //Limpiar campos de correo y contraseña
  limpiarCampos() {
    this.correo = ''; // Limpia el campo de correo
    this.contrasena = ''; // Limpia el campo de contraseña
  }

  // ------------------------------------------------------------
  // Método principal: Iniciar sesión
  // ------------------------------------------------------------
  login() {

    // Validación 1: Verificar si el campo correo está vacío
    if (!this.correo || this.correo.trim() === '') {
      this.campoCorreoInvalido = true; // Marca el campo como inválido
      Swal.fire({
        icon: 'warning',
        title: 'Campo obligatorio',
        text: 'Debes diligenciar el correo antes de iniciar sesión'
      });
      return; // Detiene la ejecución del método
    }

    // Validación 2: Verificar si el campo contraseña está vacío
    if (!this.contrasena || this.contrasena.trim() === '') {
      this.campoContrasenaInvalido = true; // Marca el campo como inválido
      Swal.fire({
        icon: 'warning',
        title: 'Campo obligatorio',
        text: 'Debes diligenciar la contraseña antes de iniciar sesión'
      });
      return; // Detiene la ejecución del método
    }

    // Si ambos campos están diligenciados, se quitan los indicadores de error
    if (this.correo && this.contrasena) {
      this.campoCorreoInvalido = false;
      this.campoContrasenaInvalido = false;
    }

    // ------------------------------------------------------------
    // Se realiza la petición al servicio de autenticación
    // ------------------------------------------------------------
    this.autenticacionService.login({
      correo: this.correo,
      contrasena: this.contrasena
    }).subscribe({

      // Caso exitoso (login correcto)
      next: (res: any) => {
        // Guarda el token recibido en el almacenamiento local
        this.autenticacionService.guardarToken(res.token);
  
        // Muestra un mensaje de bienvenida con animación
        let timerInterval: any;
        Swal.fire({
          title: '¡Bienvenido a GestorWare!',
          html: `!<b>${this.correo}</b>!<br>A continuación te redireccionaremos al módulo de gestión`,
          imageWidth: 200,
          imageHeight: 200,
          background: '#3a4447ff', // Color de fondo personalizado
          color: 'white',          // Color del texto
          timer: 2000,             // Tiempo antes de redirigir (1 segundo)
          timerProgressBar: true,  // Barra de progreso del temporizador
          didOpen: () => {
            Swal.showLoading(); // Muestra animación de carga
            const timer = Swal.getPopup()?.querySelectorAll('b')[1];
            // Intervalo para actualizar el tiempo restante
            timerInterval = setInterval(() => {
              if (timer) {
                timer.textContent = `${Swal.getTimerLeft()}`;
              }
            }, 100);
          },
          willClose: () => {
            // Limpia el intervalo al cerrar la alerta
            clearInterval(timerInterval);
          }
        }).then((result) => {
          //  Redirección al módulo de inventario una vez que la alerta termina
          if (result.dismiss === Swal.DismissReason.timer) {
            this.router.navigate(['/inventario']), { replaceURL: true };
          }
        });
      },
      // Caso de error (credenciales inválidas o error del servidor)
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: error.error.message || 'Credenciales inválidas',
          confirmButtonColor: '#3085d6'
        });
        this.limpiarCampos();
      }
    });
  }

  // ------------------------------------------------------------
  // Método: Cerrar sesión
  // ------------------------------------------------------------
  cerrarSesion() {
    this.autenticacionService.cerrarSesion(); // Elimina el token y limpia la sesión
    this.router.navigate(['/iniciar-sesion']); // Redirige nuevamente al formulario de login
  }
}
