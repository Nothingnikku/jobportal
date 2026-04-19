import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService, UserRole } from '../services/auth-state.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthStateService);
  const router = inject(Router);
  const session = auth.currentSession;
  const requiredRoles = (route.data?.['roles'] ?? []) as UserRole[];

  if (!session) {
    return router.createUrlTree(['/login']);
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(session.role)) {
    return router.createUrlTree(['/']);
  }

  return true;
};
