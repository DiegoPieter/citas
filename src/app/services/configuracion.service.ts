import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  private readonly KEY_PERMITIR_BORRAR_INICIO = 'permitir_borrar_inicio';

  async obtenerPermitirBorrarInicio(): Promise<boolean> {
    const resultado = await Preferences.get({ key: this.KEY_PERMITIR_BORRAR_INICIO });
    return resultado.value === 'true';
  }

  async guardarPermitirBorrarInicio(permitir: boolean): Promise<void> {
    await Preferences.set({
      key: this.KEY_PERMITIR_BORRAR_INICIO,
      value: String(permitir),
    });
  }
}
