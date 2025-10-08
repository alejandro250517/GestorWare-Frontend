import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { inject } from '@angular/core';
export const autenticacionGuard: CanActivateFn = (route, state) => {
  const autenticacionServicio = inject(AutenticacionService);
  const router = inject(Router);

  if (autenticacionServicio.esAutenticado()) {
    return true;
  }else{
    router.navigate(['/iniciar-sesion']); // Redirige al login si no está autenticado
  }
  return false;
};

