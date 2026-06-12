import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { Rendimiento } from '../../models/rendimiento.model';

@Component({
  selector: 'app-rendimientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 min-h-screen">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">Rendimientos (Labor Productivity)</h1>
          <p class="text-slate-500 font-medium mt-1">Manage hourly productivity and seasonal labor rates</p>
        </div>
        <button 
          (click)="openForm()"
          class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Rendimiento
        </button>
      </div>

      <!-- FORM MODAL -->
      @if (showForm()) {
        <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 class="text-xl font-black text-slate-800">{{ editingId() ? 'Edit' : 'New' }} Productivity Rate</h3>
              <button (click)="closeForm()" class="p-2 text-slate-400 hover:bg-slate-200 rounded-xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            
            <form [formGroup]="rendimientoForm" (ngSubmit)="save()" class="p-8">
              <div class="space-y-5">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name / Activity</label>
                  <input formControlName="nombre" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="e.g. Basic Floral Arrangement" />
                </div>
                
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Units Per Hour (Productivity)</label>
                  <input formControlName="unidades_por_hora" type="number" min="1" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                </div>

                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Regular ($)</label>
                    <input formControlName="regular" type="number" step="0.01" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">High Season ($)</label>
                    <input formControlName="alta_temporada" type="number" step="0.01" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Local ($)</label>
                    <input formControlName="local" type="number" step="0.01" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div class="mt-8 flex gap-4">
                <button type="button" (click)="closeForm()" class="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" [disabled]="rendimientoForm.invalid || isLoading()" class="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center">
                  @if (isLoading()) {
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  } @else {
                    <span>Save</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- TABLE -->
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-100">
                <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Name / Activity</th>
                <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Units/Hr</th>
                <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Regular Rate</th>
                <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">High Season</th>
                <th class="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Local Rate</th>
                <th class="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (r of rendimientos(); track r.id) {
                <tr class="hover:bg-slate-50/50 transition-colors group">
                  <td class="px-6 py-5 font-bold text-slate-800">{{ r.nombre }}</td>
                  <td class="px-6 py-5 text-center">
                    <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-bold text-sm">{{ r.unidades_por_hora }}</span>
                  </td>
                  <td class="px-6 py-5 text-right font-medium text-slate-600">{{ r.regular | currency }}</td>
                  <td class="px-6 py-5 text-right font-medium text-slate-600">{{ r.alta_temporada | currency }}</td>
                  <td class="px-6 py-5 text-right font-medium text-slate-600">{{ r.local | currency }}</td>
                  <td class="px-6 py-5 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="edit(r)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button (click)="deleteRow(r.id!)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y1="17"></line><line x1="14" y1="11" x2="14" y1="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="py-20 text-center">
                    <div class="flex flex-col items-center justify-center opacity-40">
                      <span class="text-6xl mb-4">⏱️</span>
                      <p class="text-sm font-black text-slate-500 uppercase tracking-widest">No productivity rates defined yet</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class RendimientosComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private fb = inject(FormBuilder);

  rendimientos = signal<Rendimiento[]>([]);
  isLoading = signal<boolean>(false);
  
  showForm = signal<boolean>(false);
  editingId = signal<string | null>(null);

  rendimientoForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    unidades_por_hora: [1, [Validators.required, Validators.min(1)]],
    regular: [0, [Validators.required, Validators.min(0)]],
    alta_temporada: [0, [Validators.required, Validators.min(0)]],
    local: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.supabase.getRendimientos().subscribe({
      next: (data) => {
        this.rendimientos.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading rendimientos', err);
        this.isLoading.set(false);
      }
    });
  }

  openForm() {
    this.rendimientoForm.reset({ unidades_por_hora: 1, regular: 0, alta_temporada: 0, local: 0 });
    this.editingId.set(null);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  edit(r: Rendimiento) {
    this.rendimientoForm.patchValue({
      nombre: r.nombre,
      unidades_por_hora: r.unidades_por_hora,
      regular: r.regular,
      alta_temporada: r.alta_temporada,
      local: r.local
    });
    this.editingId.set(r.id!);
    this.showForm.set(true);
  }

  save() {
    if (this.rendimientoForm.invalid) return;

    this.isLoading.set(true);
    const payload = this.rendimientoForm.value;
    const id = this.editingId();

    if (id) {
      this.supabase.updateRendimiento(id, payload).subscribe({
        next: (updated) => {
          this.rendimientos.update(arr => arr.map(item => item.id === id ? updated : item));
          this.closeForm();
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          alert('Error updating productivity rate');
          this.isLoading.set(false);
        }
      });
    } else {
      this.supabase.createRendimiento(payload).subscribe({
        next: (created) => {
          this.rendimientos.update(arr => [...arr, created]);
          this.closeForm();
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          alert('Error creating productivity rate');
          this.isLoading.set(false);
        }
      });
    }
  }

  deleteRow(id: string) {
    if (confirm('Are you sure you want to delete this productivity rate?')) {
      this.isLoading.set(true);
      this.supabase.deleteRendimiento(id).subscribe({
        next: () => {
          this.rendimientos.update(arr => arr.filter(r => r.id !== id));
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          alert('Error deleting productivity rate');
          this.isLoading.set(false);
        }
      });
    }
  }
}
