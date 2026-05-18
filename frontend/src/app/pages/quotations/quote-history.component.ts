import { Component, OnInit, inject, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-quote-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-[1600px] mx-auto p-4 lg:p-10 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- HEADER & ACTIONS -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div>
          <h2 class="text-3xl font-black text-slate-900 tracking-tight">Quotations History</h2>
          <p class="text-slate-400 font-medium mt-1">Manage and review your saved quotes</p>
        </div>
        <button 
          (click)="onNewQuote.emit()"
          class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          New Quotation
        </button>
      </div>

      <!-- FILTERS -->
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 mb-8">
        <div class="flex-1 relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Search by client name..."
            class="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
          />
        </div>
        
        <div class="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
          <div class="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 shrink-0 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</span>
            <input 
              type="date"
              [ngModel]="startDate()"
              (ngModelChange)="startDate.set($event)"
              class="bg-transparent border-none py-4 text-slate-700 focus:ring-0 outline-none font-medium cursor-pointer text-sm p-0 m-0"
            />
          </div>
          
          <div class="flex items-center gap-3 bg-slate-50 rounded-2xl px-5 shrink-0 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</span>
            <input 
              type="date"
              [ngModel]="endDate()"
              (ngModelChange)="endDate.set($event)"
              class="bg-transparent border-none py-4 text-slate-700 focus:ring-0 outline-none font-medium cursor-pointer text-sm p-0 m-0"
            />
          </div>

          <div class="w-48 shrink-0">
            <select 
              [ngModel]="statusFilter()"
              (ngModelChange)="statusFilter.set($event)"
              class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer font-medium font-bold"
            >
              <option value="Todos">All Statuses</option>
              @for (status of availableStatuses(); track status) {
                <option [value]="status">{{ status }}</option>
              }
            </select>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"># Quote</th>
                <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Cost</th>
                <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Sale Price</th>
                <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Profit</th>
                <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th class="px-6 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (q of filteredQuotes(); track q.id) {
                <tr class="group hover:bg-slate-50/50 transition-all duration-300">
                  <td class="px-6 py-6 text-sm font-bold text-slate-500 whitespace-nowrap">
                    #{{ q.id.split('-')[0] | uppercase }}
                  </td>
                  <td class="px-6 py-6 font-bold text-slate-800 text-lg">
                    {{ q.cliente }}
                  </td>
                  <td class="px-6 py-6 text-sm font-medium text-slate-500">
                    {{ q.fecha_creacion | date:'dd/MM/yyyy' }}
                  </td>
                  <td class="px-6 py-6 text-right font-semibold text-rose-500">
                    {{ q.total_costo_materiales + q.total_costo_mano_obra | currency }}
                  </td>
                  <td class="px-6 py-6 text-right font-black text-indigo-600 text-lg">
                    {{ q.precio_venta_final | currency }}
                  </td>
                  <td class="px-6 py-6 text-center">
                    <div class="flex flex-col items-center">
                      <span class="text-sm font-black text-emerald-500">{{ q.precio_venta_final - (q.total_costo_materiales + q.total_costo_mano_obra) | currency }}</span>
                      <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mt-1">{{ q.margen_esperado }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-6 text-center">
                    <span 
                      class="px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-full"
                      [ngClass]="{
                        'bg-slate-100 text-slate-500': q.estado === 'Borrador',
                        'bg-indigo-100 text-indigo-600': q.estado === 'Cotizado' || q.estado === 'Quoted',
                        'bg-blue-100 text-blue-600': q.estado === 'Enviada',
                        'bg-emerald-100 text-emerald-600': q.estado === 'Aceptada',
                        'bg-gray-100 text-gray-600': !['Borrador', 'Cotizado', 'Quoted', 'Enviada', 'Aceptada'].includes(q.estado)
                      }"
                    >
                      {{ q.estado }}
                    </span>
                  </td>
                  <td class="px-6 py-6 text-right whitespace-nowrap">
                    <button (click)="viewDetails(q)" class="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors font-bold text-sm mr-2">View Details</button>
                    <button (click)="deleteQuotation(q.id)" class="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="py-24 text-center">
                    <div class="flex flex-col items-center opacity-40">
                      <span class="text-6xl mb-4">📭</span>
                      <p class="text-sm font-black uppercase tracking-widest text-slate-500">No quotations found</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- DETAILS DRAWER (SLIDE-OVER) -->
    @if (selectedQuote()) {
      <div class="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
        
        <!-- Drawer Panel -->
        <div class="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          <!-- Drawer Header -->
          <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 class="text-xl font-black text-slate-800">Quotation Detail</h3>
              <p class="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">#{{ selectedQuote().id.split('-')[0] }}</p>
            </div>
            <button (click)="closeDetails()" class="p-2 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Drawer Content -->
          <div class="flex-1 overflow-y-auto p-8">
            
            <div class="grid grid-cols-2 gap-6 mb-10">
              <div class="bg-indigo-50 p-5 rounded-2xl">
                <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Client</span>
                <span class="text-lg font-bold text-indigo-900">{{ selectedQuote().cliente }}</span>
              </div>
              <div class="bg-emerald-50 p-5 rounded-2xl">
                <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Final Price</span>
                <span class="text-xl font-black text-emerald-700">{{ selectedQuote().precio_venta_final | currency }}</span>
              </div>
            </div>

            <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Quoted Items</h4>
            
            <div class="space-y-4">
              @for (item of selectedQuote().cotizaciones_detalle; track item.id) {
                <div class="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm" [ngClass]="item.tipo_item === 'flower' ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'">
                      {{ item.tipo_item === 'flower' ? '🌸' : '📦' }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 text-sm">{{ item.descripcion }}</p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{{ item.cantidad }}x @ {{ item.precio_unitario | currency }}</p>
                    </div>
                  </div>
                  <div class="font-black text-indigo-600">
                    {{ item.subtotal | currency }}
                  </div>
                </div>
              }
            </div>

            <div class="mt-8 border-t border-slate-100 pt-8 space-y-3">
              <div class="flex justify-between text-sm font-bold text-slate-500">
                <span>Materials</span>
                <span>{{ selectedQuote().total_costo_materiales | currency }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-slate-500">
                <span>Labor Cost</span>
                <span>+ {{ selectedQuote().total_costo_mano_obra | currency }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-slate-500">
                <span>Applied Waste</span>
                <span>{{ selectedQuote().porcentaje_desperdicio }}%</span>
              </div>
            </div>

          </div>

          <!-- Drawer Footer -->
          <div class="p-6 bg-slate-50 border-t border-slate-100">
            <button (click)="closeDetails()" class="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors">
              Close
            </button>
          </div>
        </div>

      </div>
    }
  `,
  styles: []
})
export class QuoteHistoryComponent implements OnInit {
  private supabase = inject(SupabaseService);

  quotes = signal<any[]>([]);
  searchTerm = signal('');
  statusFilter = signal('Todos');
  startDate = signal<string | null>(null);
  endDate = signal<string | null>(null);
  
  selectedQuote = signal<any | null>(null);

  // Dinamically extract unique statuses
  availableStatuses = computed(() => {
    const statuses = this.quotes().map(q => q.estado).filter(Boolean);
    return [...new Set(statuses)].sort();
  });

  // Computed signal for filtering
  filteredQuotes = computed(() => {
    let filtered = this.quotes();
    
    if (this.statusFilter() !== 'Todos') {
      filtered = filtered.filter(q => q.estado === this.statusFilter());
    }
    
    if (this.searchTerm().trim() !== '') {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(q => q.cliente.toLowerCase().includes(term));
    }

    if (this.startDate()) {
      const start = new Date(this.startDate() as string).getTime();
      filtered = filtered.filter(q => new Date(q.fecha_creacion).getTime() >= start);
    }
    
    if (this.endDate()) {
      const end = new Date(this.endDate() as string);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(q => new Date(q.fecha_creacion).getTime() <= end.getTime());
    }
    
    return filtered;
  });

  ngOnInit() {
    this.loadQuotations();
  }

  loadQuotations() {
    this.supabase.getAllCotizaciones().subscribe({
      next: (data) => this.quotes.set(data),
      error: (err) => console.error('Error loading quotes:', err)
    });
  }

  viewDetails(quote: any) {
    this.selectedQuote.set(quote);
  }

  closeDetails() {
    this.selectedQuote.set(null);
  }

  deleteQuotation(id: string) {
    if (confirm('Are you sure you want to delete this quotation? This action cannot be undone.')) {
      this.supabase.deleteCotizacion(id).subscribe({
        next: () => {
          this.quotes.update(prev => prev.filter(q => q.id !== id));
          if (this.selectedQuote()?.id === id) this.closeDetails();
        },
        error: (err) => alert('Error deleting quotation: ' + err.message)
      });
    }
  }

  // To wire up with parent component to toggle views
  onNewQuote = output<void>();
}
