import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Cita } from '../../models/cita';

@Component({
  selector: 'app-form-cita',
  templateUrl: './form-cita.component.html',
  styleUrls: ['./form-cita.component.scss'],
  imports: [
    NgIf,
    ReactiveFormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
  ],
})
export class FormCitaComponent {
  @Output() nuevaCita = new EventEmitter<Cita>();

  formulario: FormGroup;
  intentoEnviar = false;

  constructor(private fb: FormBuilder) {
    addIcons({ add });

    this.formulario = this.fb.group({
      frase: ['', [Validators.required, Validators.minLength(5)]],
      autor: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  mostrarError(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && (control.touched || this.intentoEnviar);
  }

  tieneError(campo: string, error: string): boolean {
    return !!this.formulario.get(campo)?.hasError(error);
  }

  onAgregar(): void {
    this.intentoEnviar = true;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const cita: Cita = {
      frase: this.formulario.value.frase.trim(),
      autor: this.formulario.value.autor.trim(),
    };

    this.nuevaCita.emit(cita);

    this.formulario.reset({ frase: '', autor: '' });
    this.intentoEnviar = false;
  }
}
