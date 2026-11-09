import { Component, OnInit, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  ToastController,
} from '@ionic/angular';
import { Cita } from '../../models/cita';
import { CitasService } from '../../services/citas.service';
import { FormCitaComponent } from '../../components/form-cita/form-cita.component';
import { ListaCitasComponent } from '../../components/lista-citas/lista-citas.component';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    FormCitaComponent,
    ListaCitasComponent,
  ],
})
export class GestionCitasPage implements OnInit {
  citas = signal<Cita[]>([]);

  constructor(
    private citasService: CitasService,
    private toastController: ToastController,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.citasService.iniciarPlugin();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarCitas();
  }

  async cargarCitas(): Promise<void> {
    this.citas.set(await this.citasService.obtenerCitas());
  }

  async onNuevaCita(cita: Cita): Promise<void> {
    await this.citasService.agregarCita(cita);
    await this.cargarCitas();
    await this.mostrarMensaje('Cita agregada');
  }

  async onEliminarCita(cita: Cita): Promise<void> {
    if (cita.id !== undefined) {
      await this.citasService.eliminarCita(cita.id);
      await this.cargarCitas();
      await this.mostrarMensaje('Cita eliminada');
    }
  }

  private async mostrarMensaje(mensaje: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }
}
