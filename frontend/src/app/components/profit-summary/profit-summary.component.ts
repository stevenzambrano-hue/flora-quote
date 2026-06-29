import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuoteLogicService } from '../../services/quote-logic.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-profit-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profit-summary.component.html'
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
