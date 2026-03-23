import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="min-h-screen bg-slate-50">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Content Area -->
      <main class="pl-64 min-h-screen transition-all">
        <div class="p-10 max-w-7xl mx-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {}
