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
  templateUrl: './quotations.component.html'
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