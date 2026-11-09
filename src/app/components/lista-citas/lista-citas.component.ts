import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { IonList, IonItem, IonText } from '@ionic/angular';
import { Cita } from '../../models/cita';
import { CitaComponent } from '../cita/cita.component';

@Component({
  selector: 'app-lista-citas',
  templateUrl: './lista-citas.component.html',
  styleUrls: ['./lista-citas.component.scss'],
  imports: [NgFor, NgIf, IonList, IonItem, IonText, CitaComponent],
})
export class ListaCitasComponent {
  @Input() citas: Cita[] = [];
  @Output() eliminarCita = new EventEmitter<Cita>();

  onBorrarCita(cita: Cita): void {
    this.eliminarCita.emit(cita);
  }
}
