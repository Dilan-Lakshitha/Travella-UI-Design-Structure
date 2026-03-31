import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'guest',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['traveler'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/guest-dashboard/guest-dashboard.component').then(m => m.GuestDashboardComponent)
      },
      {
        path: 'itinerary-builder',
        loadComponent: () => import('./pages/itinerary-builder/itinerary-builder.component').then(m => m.ItineraryBuilderComponent)
      },
      {
        path: 'booking/:id',
        loadComponent: () => import('./pages/booking-confirmation/booking-confirmation.component').then(m => m.BookingConfirmationComponent)
      }
    ]
  },
  {
    path: 'agency',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'staff'] },
    children: [
      {
        path: 'review',
        loadComponent: () => import('./pages/agency-review/agency-review.component').then(m => m.AgencyReviewComponent)
      },
      {
        path: 'pricing/:id',
        loadComponent: () => import('./pages/pricing-assignment/pricing-assignment.component').then(m => m.PricingAssignmentComponent)
      },
      {
        path: 'staff',
        loadComponent: () => import('./pages/staff-management/staff-management.component').then(m => m.StaffManagementComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['super_admin'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'itineraries',
        loadComponent: () => import('./pages/itinerary-management/itinerary-management.component').then(m => m.ItineraryManagementComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
