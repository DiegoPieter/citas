# Citas – Taller 2 Programación Híbrida (Diego Aranda)

## Cómo ejecutar el proyecto
1. Descomprimir el ZIP y abrir la carpeta `citas` en VS Code.
2. En la terminal:
   npm install
   ionic serve
   (si no tienes Ionic CLI: npm install -g @ionic/cli, o usa `npm start`)
3. Se abre en http://localhost:8100

## Estructura
src/app/
  models/cita.ts                         -> interface Cita
  services/citas.service.ts              -> SQLite (citas)
  services/configuracion.service.ts      -> Preferences (configuración)
  components/cita/                       -> muestra una cita (@Input cita, permitirBorrar, destacada / @Output borrarCita)
  components/lista-citas/                -> lista con *ngFor (@Input citas / @Output eliminarCita)
  components/form-cita/                  -> formulario validado (@Output nuevaCita)
  pages/home/                            -> cita aleatoria
  pages/gestion-citas/                   -> agregar y eliminar
  pages/configuracion/                   -> toggle "Permitir eliminar citas en el inicio"

## Plugins usados
npm install @capacitor/core @capacitor/preferences @capacitor-community/sqlite jeep-sqlite
npm install sql.js@1.11.0 --save-exact
(sql.js 1.11.0 es la versión compatible con jeep-sqlite; con otra versión SQLite falla en el navegador)
