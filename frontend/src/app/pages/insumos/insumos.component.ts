import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { GenericTableComponent, TableColumn } from '../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- List View -->
      @if (!isEditing()) {
        <app-generic-table 
          title="Supplies Master List"
          [data]="items()"
          [columns]="cols"
          (onAdd)="openCreate()"
          (onEdit)="openEdit($event)"
          (onDelete)="deleteItem($event)"
        ></app-generic-table>
      }

      <!-- Form View -->
      @if (isEditing()) {
        <div class="max-w-2xl bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
           <h3 class="text-2xl font-bold text-slate-900 mb-8 border-l-4 border-indigo-600 pl-4">
             {{ editMode() === 'create' ? 'Add New Supply' : 'Update Supply' }}
           </h3>

           <form [formGroup]="form" (ngSubmit)="save()" class="grid grid-cols-2 gap-6">
              <div class="col-span-2">
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Supply Name</label>
                <input formControlName="nombre" class="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-slate-200" placeholder="e.g. Ribbon"/>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Category</label>
                <input formControlName="categoria" class="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-slate-200" placeholder="e.g. Packaging"/>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Unit Cost ($)</label>
                <input type="number" formControlName="costo_unitario" class="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-slate-200" />
              </div>

              <div class="col-span-2">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" formControlName="es_urbanstems" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span class="text-sm font-medium text-slate-700">Is UrbanStems Supply?</span>
                </label>
              </div>

              <div class="col-span-2 pt-6 flex gap-4">
                <button type="button" (click)="isEditing.set(false)" class="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all">
                   Cancel
                </button>
                <button type="submit" [disabled]="form.invalid" class="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all">
                   Save Changes
                </button>
              </div>
           </form>
        </div>
      }

    </div>
  `,
  styles: []
})
export class InsumosComponent implements OnInit {
  private api = inject(SupabaseService);
  private fb = inject(FormBuilder);

  items = signal<any[]>([]);
  isEditing = signal(false);
  editMode = signal<'create' | 'edit'>('create');
  selectedId = signal<string | null>(null);

  cols: TableColumn[] = [
    { field: 'nombre', header: 'Name', type: 'text' },
    { field: 'categoria', header: 'Category', type: 'text' },
    { field: 'costo_unitario', header: 'Unit Cost', type: 'currency' },
    { field: 'es_urbanstems', header: 'UrbanStems', type: 'boolean' } 
  ];

  form = this.fb.group({
    nombre: ['', Validators.required],
    categoria: [''],
    costo_unitario: [0, [Validators.required, Validators.min(0)]],
    es_urbanstems: [false]
  });

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.getAll('insumos').subscribe(res => this.items.set(res));
  }

  openCreate() {
    this.form.reset({ costo_unitario: 0, es_urbanstems: false, categoria: '' });
    this.editMode.set('create');
    this.isEditing.set(true);
  }

  openEdit(row: any) {
    this.selectedId.set(row.id);
    this.form.patchValue(row);
    this.editMode.set('edit');
    this.isEditing.set(true);
  }

  save() {
    if (this.form.invalid) return;

    const resource = 'insumos';
    const data = this.form.value;

    const op = this.editMode() === 'create' 
      ? this.api.create(resource, data)
      : this.api.update(resource, this.selectedId()!, data);

    op.subscribe({
      next: () => {
        this.isEditing.set(false);
        this.refresh();
      },
      error: (err) => alert('Error saving supply: ' + err.message)
    });
  }

  deleteItem(id: string) {
    if (confirm('Are you sure you want to delete this supply?')) {
      this.api.delete('insumos', id).subscribe({
        next: () => this.refresh(),
        error: (err) => alert('Error deleting supply (record might be linked): ' + err.message)
      });
    }
  }
}
