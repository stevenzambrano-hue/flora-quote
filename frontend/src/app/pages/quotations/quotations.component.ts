import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuoteCalculatorComponent } from './quote-calculator.component';
import { QuoteHistoryComponent } from './quote-history.component';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [CommonModule, QuoteCalculatorComponent, QuoteHistoryComponent],
  template: `
    <div class="h-full w-full">
      @if (view() === 'history') {
        <app-quote-history (onNewQuote)="view.set('calculator')"></app-quote-history>
      } @else {
        <div class="p-4">
          <button (click)="view.set('history')" class="mb-4 px-6 py-2 bg-white text-slate-500 rounded-xl shadow-sm hover:shadow-md hover:text-indigo-600 transition-all font-bold text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Go to History
          </button>
        </div>
        <app-quote-calculator></app-quote-calculator>
      }
    </div>
  `,
  styles: []
})
export class QuotationsComponent implements OnInit {
  view = signal<'history' | 'calculator'>('history');
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'calculator') {
        this.view.set('calculator');
      } else {
        this.view.set('history');
      }
    });
  }
}
