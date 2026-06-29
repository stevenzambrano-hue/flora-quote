import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { GenericTableComponent, TableColumn } from '../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-flores',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './flores.component.html'
})
export class FloresComponent implements OnInit {
  private api = inject(SupabaseService);
  private fb = inject(FormBuilder);

  items = signal<any[]>([]);
  isEditing = signal(false);
  editMode = signal<'create' | 'edit'>('create');
  selectedId = signal<string | null>(null);

  cols: TableColumn[] = [
    { field: 'nombre', header: 'Name', type: 'text' },
    { field: 'costo_regular', header: 'Reg. Cost', type: 'currency' },
    { field: 'costo_alta', header: 'High Cost', type: 'currency' },
    { field: 'costo_local', header: 'Local Cost', type: 'currency' }
  ];

  form = this.fb.group({
    nombre: ['', Validators.required],
    costo_regular: [0, [Validators.required, Validators.min(0)]],
    costo_alta: [0, [Validators.min(0)]],
    costo_local: [0, [Validators.min(0)]]
  });

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.getAll('flores').subscribe(res => this.items.set(res));
  }

  openCreate() {
    this.form.reset({ costo_regular: 0, costo_alta: 0, costo_local: 0 });
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

    const resource = 'flores';
    const data = this.form.value;

    const op = this.editMode() === 'create' 
      ? this.api.create(resource, data)
      : this.api.update(resource, this.selectedId()!, data);

    op.subscribe({
      next: () => {
        this.isEditing.set(false);
        this.refresh();
      },
      error: (err) => alert('Error saving flower: ' + err.message)
    });
  }

  deleteItem(id: string) {
    if (confirm('Are you sure you want to delete this flower?')) {
      this.api.delete('flores', id).subscribe({
        next: () => this.refresh(),
        error: (err) => alert('Error deleting flower (record might be linked): ' + err.message)
      });
    }
  }
}
