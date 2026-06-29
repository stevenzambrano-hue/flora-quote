import { Component, OnInit, inject, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-quote-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quote-history.component.html'
})
export class QuoteHistoryComponent implements OnInit {
  private supabase = inject(SupabaseService);

  quotes = signal<any[]>([]);
  searchTerm = signal('');
  statusFilter = signal('Todos');
  startDate = signal<string | null>(null);
  endDate = signal<string | null>(null);
  
  selectedQuote = signal<any | null>(null);

  // Dinamically extract unique statuses
  availableStatuses = computed(() => {
    const statuses = this.quotes().map(q => q.estado).filter(Boolean);
    return [...new Set(statuses)].sort();
  });

  // Computed signal for filtering
  filteredQuotes = computed(() => {
    let filtered = this.quotes();
    
    if (this.statusFilter() !== 'Todos') {
      filtered = filtered.filter(q => q.estado === this.statusFilter());
    }
    
    if (this.searchTerm().trim() !== '') {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(q => q.cliente.toLowerCase().includes(term));
    }

    if (this.startDate()) {
      const start = new Date(this.startDate() as string).getTime();
      filtered = filtered.filter(q => new Date(q.fecha_creacion).getTime() >= start);
    }
    
    if (this.endDate()) {
      const end = new Date(this.endDate() as string);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(q => new Date(q.fecha_creacion).getTime() <= end.getTime());
    }
    
    return filtered;
  });

  ngOnInit() {
    this.loadQuotations();
  }

  loadQuotations() {
    this.supabase.getAllCotizaciones().subscribe({
      next: (data) => this.quotes.set(data),
      error: (err) => console.error('Error loading quotes:', err)
    });
  }

  viewDetails(quote: any) {
    this.selectedQuote.set(quote);
  }

  closeDetails() {
    this.selectedQuote.set(null);
  }

  deleteQuotation(id: string) {
    if (confirm('Are you sure you want to delete this quotation? This action cannot be undone.')) {
      this.supabase.deleteCotizacion(id).subscribe({
        next: () => {
          this.quotes.update(prev => prev.filter(q => q.id !== id));
          if (this.selectedQuote()?.id === id) this.closeDetails();
        },
        error: (err) => alert('Error deleting quotation: ' + err.message)
      });
    }
  }

  // To wire up with parent component to toggle views
  onNewQuote = output<void>();
}
