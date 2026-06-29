import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { Rendimiento } from '../../models/rendimiento.model';

@Component({
  selector: 'app-rendimientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rendimientos.component.html'
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
