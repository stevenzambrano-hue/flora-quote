import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuoteLogicService } from '../../services/quote-logic.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-quote-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-[1600px] mx-auto p-4 lg:p-10 min-h-screen bg-slate-50/50">
      <div class="flex flex-col lg:flex-row gap-10">
        
        <!-- MAIN CALCULATOR AREA -->
        <div class="flex-1 space-y-8">
          
          <!-- STICKY HEADER / CLIENT INFO -->
          <div class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-end">
            <div class="flex-1 w-full">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Client / Project Name</label>
              <input 
                [(ngModel)]="quoteLogic.cotizacion().cliente"
                class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-300 focus:ring-4 focus:ring-indigo-500/10 transition-all text-xl font-medium"
                placeholder="Ex. Smith Wedding - Floral Design"
              />
            </div>
            
            <div class="w-full md:w-auto">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Season Mode</label>
              <div class="bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-100">
                @for (s of seasons; track s) {
                  <button 
                    (click)="changeSeason(s)"
                    [class.bg-white]="quoteLogic.cotizacion().temporada === s"
                    [class.shadow-md]="quoteLogic.cotizacion().temporada === s"
                    [class.text-indigo-600]="quoteLogic.cotizacion().temporada === s"
                    [class.text-slate-400]="quoteLogic.cotizacion().temporada !== s"
                    class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                  >
                    {{ s }}
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- ITEM SELECTOR PANEL -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Add Flower -->
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div class="flex items-center gap-4 mb-4">
                 <div class="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 text-xl font-bold">🌸</div>
                 <div>
                   <h4 class="text-sm font-bold text-slate-800 tracking-tight">Add Flowers</h4>
                   <p class="text-xs text-slate-400">Varieties from master catalog</p>
                 </div>
               </div>
               <select #flowerSelect (change)="addFlower(flowerSelect.value); flowerSelect.value=''" class="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                 <option value="" disabled selected>Select Variety...</option>
                 @for (f of flores(); track f.id) {
                   <option [value]="f.id">{{ f.nombre }} ({{ (quoteLogic.cotizacion().temporada === 'Regular' ? f.costo_regular : quoteLogic.cotizacion().temporada === 'Alta' ? f.costo_alta : f.costo_local) | currency }})</option>
                 }
               </select>
            </div>

            <!-- Add Supply -->
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div class="flex items-center gap-4 mb-4">
                 <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-xl font-bold">📦</div>
                 <div>
                   <h4 class="text-sm font-bold text-slate-800 tracking-tight">Add Supplies</h4>
                   <p class="text-xs text-slate-400">Packaging and maintenance items</p>
                 </div>
               </div>
               <select #supplySelect (change)="addSupply(supplySelect.value); supplySelect.value=''" class="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                 <option value="" disabled selected>Select Supply...</option>
                 @for (s of insumos(); track s.id) {
                   <option [value]="s.id">{{ s.nombre }} ({{ s.costo_unitario | currency }})</option>
                 }
               </select>
            </div>
          </div>

          <!-- DATA TABLE -->
          <div class="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-slate-50/50 border-b border-slate-100">
                  <th class="pl-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Detail</th>
                  <th class="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Color</th>
                  <th class="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-24">Qty.</th>
                  <th class="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
                  <th class="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Subtotal</th>
                  <th class="pr-8 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                @for (d of quoteLogic.detalles(); track $index) {
                  <tr class="group hover:bg-slate-50/30 transition-all duration-300">
                    <td class="pl-8 py-6">
                      <div class="flex flex-col">
                        <span class="text-slate-800 font-bold tracking-tight text-lg">{{ d.item }}</span>
                        <span class="text-[10px] font-bold text-slate-400 uppercase mt-1">{{ d.tipo === 'flower' ? 'Flower' : 'Supply' }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-6 text-center">
                      @if (d.tipo === 'flower') {
                        <select 
                          [ngModel]="d.color"
                          (ngModelChange)="quoteLogic.updateDetalleRow($index, { color: $event })"
                          class="bg-slate-100 border-none rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer outline-none"
                        >
                          <option value="">No Color</option>
                          @for (c of colores(); track c.id) {
                            <option [value]="c.nombre">{{ c.nombre }}</option>
                          }
                        </select>
                      } @else {
                        <span class="text-slate-300">—</span>
                      }
                    </td>
                    <td class="px-4 py-6 text-center">
                      <input 
                        type="number"
                        [ngModel]="d.cantidad"
                        (ngModelChange)="quoteLogic.updateDetalleRow($index, { cantidad: $event })"
                        class="w-16 bg-slate-100/50 border-none rounded-xl px-3 py-2 text-center text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      />
                    </td>
                    <td class="px-4 py-6 text-right">
                      <div class="flex flex-col items-end">
                        <input 
                          type="number"
                          [ngModel]="d.precio_unitario"
                          (ngModelChange)="quoteLogic.updateDetalleRow($index, { precio_unitario: $event })"
                          class="w-24 bg-transparent border-none text-right font-medium focus:ring-2 focus:ring-indigo-500/20 rounded px-1 outline-none transition-all"
                          [class.text-amber-600]="d.es_precio_manual"
                          [class.font-black]="d.es_precio_manual"
                        />
                        @if (d.es_precio_manual) {
                          <span class="text-[9px] font-black text-amber-500 uppercase tracking-tighter mt-0.5">Custom Price</span>
                        }
                      </div>
                    </td>
                    <td class="px-4 py-6 text-right">
                      <span class="text-indigo-600 font-black text-lg">{{ d.subtotal | currency }}</span>
                    </td>
                    <td class="pr-8 py-6 text-right">
                      <button 
                        (click)="quoteLogic.removeDetalle($index)"
                        class="p-2.5 rounded-xl bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 group-hover:scale-110"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="py-24 text-center">
                      <div class="flex flex-col items-center opacity-20 grayscale scale-150">
                        <span class="text-6xl mb-4">🕯️</span>
                        <p class="text-sm font-black uppercase tracking-widest">Workspace is empty</p>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- STICKY SUMMARY SIDEBAR -->
        <div class="w-full lg:w-[400px]">
          <div class="sticky top-10 space-y-8">
            
            <!-- PRICING PARAMS -->
            <div class="bg-indigo-900 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 text-white">
               <h3 class="text-indigo-200 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Base Parameters</h3>
               
               <div class="space-y-6">
                 <div>
                   <div class="flex justify-between text-xs font-bold mb-3 uppercase tracking-wider">
                     <span>Waste Compensation</span>
                     <span class="text-indigo-300">{{ quoteLogic.cotizacion().porcentaje_desperdicio }}%</span>
                   </div>
                   <input type="range" min="0" max="50" [(ngModel)]="quoteLogic.cotizacion().porcentaje_desperdicio" class="w-full accent-indigo-400 h-1.5 bg-indigo-800 rounded-lg appearance-none cursor-pointer" />
                 </div>

                 <div>
                    <label class="block text-xs font-bold mb-3 uppercase tracking-wider">Labor Cost ($)</label>
                    <input type="number" [(ngModel)]="quoteLogic.cotizacion().mano_obra" class="w-full bg-indigo-800/50 border-none rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
                 </div>

                 <div>
                   <div class="flex justify-between text-xs font-bold mb-3 uppercase tracking-wider">
                     <span>Target Margin</span>
                     <span class="text-indigo-300">{{ quoteLogic.cotizacion().margen_esperado }}%</span>
                   </div>
                   <input type="range" min="5" max="90" [(ngModel)]="quoteLogic.cotizacion().margen_esperado" class="w-full accent-emerald-400 h-1.5 bg-indigo-800 rounded-lg appearance-none cursor-pointer" />
                 </div>
               </div>
            </div>

            <!-- FINAL TOTALS -->
            <div class="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center text-center">
               <h4 class="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Total Material Cost</h4>
               <div class="text-4xl font-extrabold text-slate-900 tracking-tighter mb-10">{{ quoteLogic.subtotal() | currency }}</div>
               
               <div class="w-full space-y-4 mb-10">
                 <div class="flex justify-between items-center py-4 border-b border-slate-50">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Waste Cost</span>
                    <span class="font-bold text-slate-700">+ {{ (quoteLogic.totalConDesperdicio() - quoteLogic.subtotal()) | currency }}</span>
                 </div>
                 <div class="flex justify-between items-center py-4 font-black">
                    <span class="text-xs text-indigo-500 uppercase tracking-widest">Suggested Price</span>
                    <span class="text-3xl text-indigo-600 tracking-tighter">{{ quoteLogic.precioVenta() | currency }}</span>
                 </div>
               </div>

               <button 
                 (click)="save()"
                 [disabled]="!quoteLogic.cotizacion().cliente || quoteLogic.detalles().length === 0"
                 class="w-full py-5 bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
               >
                 <span>Save Quotation</span>
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                   <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                 </svg>
               </button>
               
               <button 
                 (click)="quoteLogic.reset()"
                 class="mt-4 text-slate-300 hover:text-slate-500 text-[10px] font-black uppercase tracking-widest transition-colors"
               >
                 Reset All
               </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    input[type='range']::-webkit-slider-runnable-track {
      background: rgba(255,255,255,0.05);
    }
  `]
})
export class QuoteCalculatorComponent implements OnInit {
  quoteLogic = inject(QuoteLogicService);
  supabase = inject(SupabaseService);

  seasons: ('Regular' | 'Alta' | 'Local')[] = ['Regular', 'Alta', 'Local'];
  
  flores = signal<any[]>([]);
  insumos = signal<any[]>([]);
  colores = signal<any[]>([]);

  ngOnInit() {
    this.loadCatalogs();
  }

  loadCatalogs() {
    this.supabase.getAll('flores').subscribe(res => this.flores.set(res));
    this.supabase.getAll('insumos').subscribe(res => this.insumos.set(res));
    this.supabase.getAll('colores').subscribe(res => this.colores.set(res));
  }

  changeSeason(s: 'Regular' | 'Alta' | 'Local') {
    this.quoteLogic.cotizacion.update(prev => ({ ...prev, temporada: s }));
    this.quoteLogic.applySeasonChange(s, this.flores());
  }

  addFlower(id: string) {
    const item = this.flores().find(f => f.id === id);
    if (item) {
      this.quoteLogic.addDetalle(item, 'flower', this.quoteLogic.cotizacion().temporada);
    }
  }

  addSupply(id: string) {
    const item = this.insumos().find(s => s.id === id);
    if (item) {
      this.quoteLogic.addDetalle(item, 'supply', this.quoteLogic.cotizacion().temporada);
    }
  }

  save() {
    const payload = {
      ...this.quoteLogic.cotizacion(),
      items: this.quoteLogic.detalles(),
      total_materiales: this.quoteLogic.subtotal(),
      total_con_desperdicio: this.quoteLogic.totalConDesperdicio(),
      precio_final: this.quoteLogic.precioVenta()
    };

    this.supabase.guardarCotizacion(payload).subscribe({
      next: () => {
        alert('Quotation saved successfully! ✅');
        this.quoteLogic.reset();
      },
      error: (err) => alert('Error saving quotation: ' + err.message)
    });
  }
}
