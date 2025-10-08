import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const autenticacionServicio = inject(AutenticacionService);
  const router = inject(Router);

  if (autenticacionServicio.esAutenticado()) {
    router.navigate(['/inventario']); // Redirige a inventario si se da clic atras
    return false;
  }
  return true;
};
