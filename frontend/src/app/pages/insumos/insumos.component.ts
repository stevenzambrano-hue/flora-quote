import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { GenericTableComponent, TableColumn } from '../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './insumos.component.html'
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
