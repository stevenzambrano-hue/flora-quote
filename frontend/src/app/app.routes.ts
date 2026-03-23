import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QuotationsComponent } from './pages/quotations/quotations.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'quotations', component: QuotationsComponent },
      { 
        path: 'flowers', 
        loadComponent: () => import('./pages/flores/flores.component').then(m => m.FloresComponent) 
      },
      { 
        path: 'boxes', 
        loadComponent: () => import('./pages/cajas/cajas.component').then(m => m.CajasComponent) 
      },
      { 
        path: 'colors', 
        loadComponent: () => import('./pages/colores/colores.component').then(m => m.ColoresComponent) 
      },
      { 
        path: 'supplies', 
        loadComponent: () => import('./pages/insumos/insumos.component').then(m => m.InsumosComponent) 
      },
      { 
        path: 'accessories', 
        loadComponent: () => import('./pages/complementos/complementos.component').then(m => m.ComplementosComponent) 
      },
    ]
  }
];
