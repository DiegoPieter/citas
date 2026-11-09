import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Cita } from '../../models/cita';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss'],
  imports: [NgIf, IonButton, IonIcon],
})
export class CitaComponent {
  @Input() cita!: Cita;
  @Input() permitirBorrar = false;
  @Input() destacada = false;

  @Output() borrarCita = new EventEmitter<Cita>();

  constructor() {
    addIcons({ trashOutline });
  }

  onBorrar(): void {
    this.borrarCita.emit(this.cita);
  }
}
