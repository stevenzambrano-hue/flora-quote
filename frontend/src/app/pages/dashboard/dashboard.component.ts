import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <h2 class="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back!</h2>
      <p class="text-slate-500 mb-10 text-lg italic uppercase tracking-wider text-xs font-semibold">Flower Cost Management Terminal</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Cotizaciones (Grand Card) -->
        <a routerLink="/quotations" class="lg:col-span-2 group relative overflow-hidden bg-indigo-600 p-8 rounded-3xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95 flex flex-col justify-between h-64 border border-indigo-500">
          <div class="z-10 text-white">
             <div class="p-3 bg-white/10 w-fit rounded-xl mb-6 backdrop-blur-sm border border-white/20">📝</div>
             <h3 class="text-2xl font-bold mb-2">Quotation Terminal</h3>
             <p class="text-indigo-100/70 max-w-xs lowercase first-letter:uppercase">Calculate flower costs, labor and expected profit in real-time.</p>
          </div>
          <div class="z-10 text-right">
             <span class="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow-lg">New Quote</span>
          </div>
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </a>

        <!-- Master Data Stats -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between border-b-4 border-b-emerald-400">
          <div>
            <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Quick Action</h3>
            <p class="text-xl font-bold text-slate-800">Master Data Management</p>
          </div>
          <div class="space-y-4">
            <a routerLink="/flowers" class="flex items-center justify-between text-slate-600 hover:text-indigo-600 transition-colors font-medium">
              <span>Flowers Inventory</span>
              <span class="p-1 px-3 bg-slate-100 rounded-full text-xs">Manage</span>
            </a>
            <a routerLink="/supplies" class="flex items-center justify-between text-slate-600 hover:text-indigo-600 transition-colors font-medium">
              <span>Supplies & Boxes</span>
              <span class="p-1 px-3 bg-slate-100 rounded-full text-xs">Manage</span>
            </a>
          </div>
        </div>

        <!-- Catalog Cards -->
        <a routerLink="/flowers" class="catalog-card bg-emerald-50 text-emerald-900 border-emerald-100">
           <div class="icon-bg bg-emerald-100">🌹</div>
           <h4>Flowers</h4>
           <p>Regular, High and Local price management.</p>
        </a>

        <a routerLink="/boxes" class="catalog-card bg-amber-50 text-amber-900 border-amber-100">
           <div class="icon-bg bg-amber-100">📦</div>
           <h4>Boxes</h4>
           <p>Dimensions, stems and volume data.</p>
        </a>

        <a routerLink="/colors" class="catalog-card bg-rose-50 text-rose-900 border-rose-100">
           <div class="icon-bg bg-rose-100">🎨</div>
           <h4>Colors</h4>
           <p>Visual catalog for floral selection.</p>
        </a>

        <a routerLink="/supplies" class="catalog-card bg-sky-50 text-sky-900 border-sky-100">
           <div class="icon-bg bg-sky-100">🛠</div>
           <h4>Supplies</h4>
           <p>Integrated filters for UrbanStems catalog.</p>
        </a>

        <a routerLink="/accessories" class="catalog-card bg-violet-50 text-violet-900 border-violet-100">
           <div class="icon-bg bg-violet-100">🎀</div>
           <h4>Accessories</h4>
           <p>Additional items and ribbon pricing.</p>
        </a>
      </div>
    </div>
  `,
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
