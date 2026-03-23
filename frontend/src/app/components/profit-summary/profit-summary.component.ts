import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuoteLogicService } from '../../services/quote-logic.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-profit-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl flex flex-col h-full sticky top-8">
      <h2 class="text-xl font-bold mb-8 flex items-center gap-2">
        <span class="p-2 bg-slate-800 rounded-lg text-emerald-400">📊</span>
        Profit Summary
      </h2>

      <!-- Adjustment Inputs -->
      <div class="space-y-6 mb-8">
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Labor Cost ($)</label>
          <input 
            type="number"
            [(ngModel)]="quoteLogic.cotizacion().mano_obra"
            class="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Waste (%)</label>
          <input 
            type="number"
            [(ngModel)]="quoteLogic.cotizacion().porcentaje_desperdicio"
            class="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Desired Margin (%)</label>
          <input 
            type="number"
            [(ngModel)]="quoteLogic.cotizacion().margen_esperado"
            class="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <hr class="border-slate-800 mb-8" />

      <!-- Results -->
      <div class="space-y-4 flex-1">
        <div class="flex justify-between items-center text-slate-300">
          <span class="text-sm">Supplies Subtotal</span>
          <span class="font-medium">{{ quoteLogic.subtotal() | currency }}</span>
        </div>
        <div class="flex justify-between items-center text-slate-300">
          <span class="text-sm">With Waste</span>
          <span class="font-medium">{{ quoteLogic.totalConDesperdicio() | currency }}</span>
        </div>
        <div class="flex justify-between items-center pt-4 border-t border-slate-800">
          <span class="text-slate-400 text-sm">Suggested Sale Price</span>
          <span class="text-3xl font-bold text-emerald-400">{{ quoteLogic.precioVenta() | currency }}</span>
        </div>
      </div>

      <!-- Save Action -->
      <button 
        (click)="guardar()"
        [disabled]="!isValid()"
        class="w-full mt-8 py-4 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
      >
        Save Quotation
      </button>
      
      <p class="mt-4 text-[10px] text-center text-slate-500 uppercase tracking-widest">
        FloraQuote v1.0 • Node.js Backend Active
      </p>
    </div>
  `,
  styles: []
})
export class ProfitSummaryComponent {
  quoteLogic = inject(QuoteLogicService);
  supabase = inject(SupabaseService);

  isValid(): boolean {
    const q = this.quoteLogic.cotizacion();
    return !!q.cliente && this.quoteLogic.detalles().length > 0;
  }

  guardar() {
    const payload = {
      cotizacion: this.quoteLogic.cotizacion(),
      detalles: this.quoteLogic.detalles()
    };

    this.supabase.guardarCotizacion(payload).subscribe({
      next: (res) => {
        alert('Quotation saved successfully!');
        this.quoteLogic.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Error saving quotation. Please check the backend.');
      }
    });
  }
}
