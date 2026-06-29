import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuoteLogicService } from '../../services/quote-logic.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-quote-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './quote-calculator.component.html',
  styles: [`
    input[type='range']::-webkit-slider-runnable-track {
      background: rgba(255,255,255,0.05);
    }
  `]
})
export class QuoteCalculatorComponent implements OnInit {
  quoteLogic = inject(QuoteLogicService);
  supabase = inject(SupabaseService);

  seasons: ('Regular' | 'Alta' | 'Local')[] = ['Regular', 'Alta', 'Local'];
  
  flores = signal<any[]>([]);
  insumos = signal<any[]>([]);
  colores = signal<any[]>([]);
  cajas = signal<any[]>([]);

  ngOnInit() {
    this.loadCatalogs();
  }

  updateCotizacion = (key: string, value: any) => (prev: any) => ({ ...prev, [key]: value });

  loadCatalogs() {
    this.supabase.getAll('flores').subscribe(res => this.flores.set(res));
    this.supabase.getAll('insumos').subscribe(res => this.insumos.set(res));
    this.supabase.getAll('colores').subscribe(res => this.colores.set(res));
    this.supabase.getAll('cajas').subscribe(res => this.cajas.set(res));
    // Load rendimientos and apply labor cost for initial season
    this.supabase.getRendimientos().subscribe(res => {
      this.quoteLogic.rendimientos.set(res);
      this.quoteLogic.applyLaborCostFromRendimiento();
    });
  }

  changeSeason(s: 'Regular' | 'Alta' | 'Local') {
    this.quoteLogic.cotizacion.update(prev => ({ ...prev, temporada: s }));
    this.quoteLogic.applySeasonChange(s, this.flores());
    // Update labor cost from rendimiento for the new season
    this.quoteLogic.applyLaborCostFromRendimiento();
  }

  addFlower(id: string) {
    const item = this.flores().find(f => f.id === id);
    if (item) {
      this.quoteLogic.addDetalle(item, 'flower', this.quoteLogic.cotizacion().temporada);
    }
  }

  isSupplyAdded(id: string): boolean {
    return this.quoteLogic.detalles().some(d => d.id_referencia === id && d.tipo_item === 'supply');
  }

  addSupply(id: string) {
    if (this.isSupplyAdded(id)) return;
    const item = this.insumos().find(s => s.id === id);
    if (item) {
      this.quoteLogic.addDetalle(item, 'supply', this.quoteLogic.cotizacion().temporada);
    }
  }

  selectBox(id: string | null) {
    if (!id) {
      this.quoteLogic.cotizacion.update(prev => ({ ...prev, caja_id: null, costo_caja: 0 }));
      return;
    }
    const box = this.cajas().find(b => b.id === id);
    if (box) {
      this.quoteLogic.cotizacion.update(prev => ({ ...prev, caja_id: box.id, costo_caja: box.costo }));
    }
  }

  clearBox() {
    this.quoteLogic.cotizacion.update(prev => ({ ...prev, caja_id: null, costo_caja: 0 }));
  }

  save() {
    const payload = {
      cotizacion: {
        ...this.quoteLogic.cotizacion(),
        costo_total_materiales: this.quoteLogic.subtotal(),
        costo_con_desperdicio: this.quoteLogic.totalConDesperdicio(),
        precio_venta: this.quoteLogic.precioVenta()
      },
      detalles: this.quoteLogic.detalles()
    };

    // DEBUG: verificar que caja_id y costo_caja lleguen al payload
    console.log('📦 Payload enviado:', JSON.stringify(payload.cotizacion, null, 2));

    this.supabase.guardarCotizacion(payload).subscribe({
      next: () => {
        alert('Quotation saved successfully! ✅');
        this.quoteLogic.reset();
      },
      error: (err) => alert('Error saving quotation: ' + err.message)
    });
  }
}
