import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuoteLogicService } from '../../services/quote-logic.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quote-form.component.html'
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

  addItem(itemId: string) {
    if (!itemId) return;
    const item = this.catalogo().find(i => i.id === itemId);
    if (item) {
      this.quoteLogic.addDetalle(item, 'flower', this.quoteLogic.cotizacion().temporada);
    }
  }
}
