import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteCalculatorComponent } from './quote-calculator.component';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [CommonModule, QuoteCalculatorComponent],
  template: `
    <div class="h-full w-full">
      <app-quote-calculator></app-quote-calculator>
    </div>
  `,
  styles: []
})
export class QuotationsComponent {}
