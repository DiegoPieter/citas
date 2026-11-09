import { Component, OnInit, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonToggle,
} from '@ionic/angular';
import { ConfiguracionService } from '../../services/configuracion.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonToggle,
  ],
})
export class ConfiguracionPage implements OnInit {
  permitirBorrarInicio = signal(false);

  constructor(private configuracionService: ConfiguracionService) {}

  async ngOnInit(): Promise<void> {
    this.permitirBorrarInicio.set(await this.configuracionService.obtenerPermitirBorrarInicio());
  }

  async onCambioPermitirBorrar(event: CustomEvent): Promise<void> {
    const permitir = event.detail.checked as boolean;
    this.permitirBorrarInicio.set(permitir);
    await this.configuracionService.guardarPermitirBorrarInicio(permitir);
  }
}
