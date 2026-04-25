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
    path: 'reset-password',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'guest',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['TRAVELER'] },
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
        path: 'itinerary-builder/:id',
        loadComponent: () => import('./pages/itinerary-builder/itinerary-builder.component').then(m => m.ItineraryBuilderComponent)
      },
      {
        path: 'booking/:id',
        loadComponent: () => import('./pages/booking-confirmation/booking-confirmation.component').then(m => m.BookingConfirmationComponent)
      }
    ]
  },
  {
    path: 'traveler',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['TRAVELER'] },
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
        path: 'itinerary-builder/:id',
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
    data: { roles: ['ADMIN', 'STAFF'] },
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
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'itineraries',
        loadComponent: () => import('./pages/itinerary-management/itinerary-management.component').then(m => m.ItineraryManagementComponent)
      },
      {
        path: 'staff',
        loadComponent: () => import('./pages/admin-staff-users/admin-staff-users.component').then(m => m.AdminStaffUsersComponent)
      },
      {
        path: 'drivers',
        loadComponent: () => import('./pages/admin-drivers/admin-drivers.component').then(m => m.AdminDriversComponent)
      },
      {
        path: 'guides',
        loadComponent: () => import('./pages/admin-guides/admin-guides.component').then(m => m.AdminGuidesComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
