import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuoteLogicService } from '../../services/quote-logic.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <h2 class="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <span class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">💐</span>
        New Quotation
      </h2>

      <!-- Client -->
      <div class="mb-8">
        <label class="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Client</label>
        <input 
          [(ngModel)]="quoteLogic.cotizacion().cliente"
          placeholder="Type client name..."
          class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
        />
      </div>

      <!-- Item Search -->
      <div class="mb-6 relative">
        <label class="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Add Flower / Supply</label>
        <div class="flex gap-2">
          <select 
            #selectItem
            class="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
          >
            <option value="" disabled selected>Select an item...</option>
            @for (item of catalogo(); track item.item) {
              <option [value]="item.item">{{ item.item }} ({{ item.precio_unitario | currency }})</option>
            }
          </select>
          <button 
            (click)="addItem(selectItem.value)"
            class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            Add
          </button>
        </div>
      </div>

      <!-- Details Table -->
      <div class="mt-8">
        <label class="block text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Composition Details</label>
        
        <div class="overflow-hidden rounded-xl border border-slate-100">
          <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Item</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest text-center">Qty.</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">Unit Price</th>
                <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">Subtotal</th>
                <th class="px-4 py-3 text-center"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (detalle of quoteLogic.detalles(); track $index) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-4 py-4 text-sm font-medium text-slate-700">{{ detalle.item }}</td>
                  <td class="px-4 py-4 text-center">
                    <input 
                      type="number"
                      [ngModel]="detalle.cantidad"
                      (ngModelChange)="quoteLogic.updateDetalle($index, $event)"
                      min="1"
                      class="w-16 text-center px-2 py-1 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-sm"
                    />
                  </td>
                  <td class="px-4 py-4 text-sm text-slate-500 text-right">{{ detalle.precio_unitario | currency }}</td>
                  <td class="px-4 py-4 text-sm font-semibold text-indigo-600 text-right">{{ detalle.subtotal | currency }}</td>
                  <td class="px-4 py-4 text-center">
                    <button (click)="quoteLogic.removeDetalle($index)" class="text-slate-300 hover:text-rose-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-4 py-12 text-center text-slate-400 italic">
                    No items added yet. Start by selecting one.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class QuoteFormComponent {
  quoteLogic = inject(QuoteLogicService);
  supabase = inject(SupabaseService);

  catalogo = signal<any[]>([]);

  constructor() {
    this.supabase.getCatalogo().subscribe(data => {
      this.catalogo.set(data);
    });
  }

  addItem(itemName: string) {
    if (!itemName) return;
    const item = this.catalogo().find(i => i.item === itemName);
    if (item) {
      this.quoteLogic.addDetalle(item.item, item.precio_unitario);
    }
  }
}
