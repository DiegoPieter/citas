import { Component, OnInit, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonText,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, settingsOutline } from 'ionicons/icons';
import { Cita } from '../../models/cita';
import { CitasService } from '../../services/citas.service';
import { ConfiguracionService } from '../../services/configuracion.service';
import { CitaComponent } from '../../components/cita/cita.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    NgIf,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonText,
    CitaComponent,
  ],
})
export class HomePage implements OnInit {
  citaAleatoria = signal<Cita | null>(null);
  permitirBorrar = signal(false);

  constructor(
    private citasService: CitasService,
    private configuracionService: ConfiguracionService,
  ) {
    addIcons({ add, settingsOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.citasService.iniciarPlugin();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    this.permitirBorrar.set(await this.configuracionService.obtenerPermitirBorrarInicio());
    this.citaAleatoria.set(await this.citasService.obtenerCitaAleatoria());
  }

  async onBorrarCita(cita: Cita): Promise<void> {
    if (cita.id !== undefined) {
      await this.citasService.eliminarCita(cita.id);
      // Mostrar otra cita aleatoria
      this.citaAleatoria.set(await this.citasService.obtenerCitaAleatoria());
    }
  }
}
