import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { QuoteFormComponent } from '../../components/quote-form/quote-form.component';
import { ProfitSummaryComponent } from '../../components/profit-summary/profit-summary.component';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [CommonModule, RouterOutlet, QuoteFormComponent, ProfitSummaryComponent],
  templateUrl: './quotations.component.html',
  styles: []
})
export class QuotationsComponent {}
