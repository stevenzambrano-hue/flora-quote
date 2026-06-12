import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'; // <-- Para transformar RxJS a Signals
import { QuoteCalculatorComponent } from './quote-calculator.component';
import { QuoteHistoryComponent } from './quote-history.component';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [CommonModule, QuoteCalculatorComponent, QuoteHistoryComponent],
  template: `
    <div class="h-full w-full">
      @if (currentView() === 'history') {
        <app-quote-history (onNewQuote)="viewOverride.set('calculator')"></app-quote-history>
      } @else {
        <div class="p-4">
          <button (click)="viewOverride.set('history')" class="mb-4 px-6 py-2 bg-white text-slate-500 rounded-xl shadow-sm hover:shadow-md hover:text-indigo-600 transition-all font-bold text-sm flex items-center gap-2">
            Go to History
          </button>
        </div>
        <app-quote-calculator></app-quote-calculator>
      }
    </div>
  `
})
export class QuotationsComponent {
  private route = inject(ActivatedRoute);
  
  private queryParams = toSignal(this.route.queryParams);
  
  viewOverride = signal<'history' | 'calculator' | null>(null);
  currentView = computed(() => {
    const override = this.viewOverride();
    if (override) return override;
    
    return this.queryParams()?.['tab'] === 'calculator' ? 'calculator' : 'history';
  });
}