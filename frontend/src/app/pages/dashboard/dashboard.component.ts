import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styles: [`
    .catalog-card {
      @apply p-8 rounded-3xl border transition-all active:scale-95 shadow-sm hover:shadow-md h-56 flex flex-col justify-center;
    }
    .catalog-card h4 {
      @apply text-xl font-bold mb-2;
    }
    .catalog-card p {
      @apply text-sm opacity-60 font-medium;
    }
    .icon-bg {
      @apply p-3 w-fit rounded-xl mb-4 text-2xl;
    }
  `]
})
export class DashboardComponent {}
