import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Cita } from '../models/cita';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  private readonly DB_NAME = 'lista_citas';
  private readonly DB_VERSION = 1;
  private readonly DB_ENCRIPTADA = false;
  private readonly DB_MODO = 'no-encryption';
  private readonly DB_READ_ONLY = false;

  private readonly TABLE_NAME = 'citas';
  private readonly DB_SQL_TABLAS = `
    CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      frase TEXT NOT NULL,
      autor TEXT NOT NULL
    );
  `;

  private readonly CITAS_INICIALES: Cita[] = [
    {
      frase: 'El éxito consiste en obtener lo que se desea. La felicidad en disfrutar lo que se obtiene.',
      autor: 'Ralph Waldo Emerson',
    },
    {
      frase:
        'Las personas no son recordadas por el número de veces que fracasan, sino por el número de veces que tienen éxito.',
      autor: 'Thomas Edison',
    },
    { frase: 'Ningún viento es bueno para el barco que no sabe adónde va.', autor: 'Séneca' },
  ];

  private inicializacion: Promise<void> | null = null;

  iniciarPlugin(): Promise<void> {
    if (!this.inicializacion) {
      this.inicializacion = this.inicializar();
    }
    return this.inicializacion;
  }

  private async inicializar(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      const jeepSqlite = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqlite);
      await customElements.whenDefined('jeep-sqlite');
      await this.sqlite.initWebStore();
    }

    const conexionExiste = (await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)).result;
    if (conexionExiste) {
      this.db = await this.sqlite.retrieveConnection(this.DB_NAME, this.DB_READ_ONLY);
    } else {
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        this.DB_ENCRIPTADA,
        this.DB_MODO,
        this.DB_VERSION,
        this.DB_READ_ONLY,
      );
    }
    await this.db.open();

    await this.db.execute(this.DB_SQL_TABLAS);

    const resultado = await this.db.query(`SELECT COUNT(*) AS total FROM ${this.TABLE_NAME}`);
    const total = resultado.values?.[0]?.total ?? 0;
    if (total === 0) {
      for (const cita of this.CITAS_INICIALES) {
        await this.insertar(cita);
      }
    }
  }

  async obtenerCitas(): Promise<Cita[]> {
    await this.iniciarPlugin();
    const sql = `SELECT id, frase, autor FROM ${this.TABLE_NAME} ORDER BY id DESC`;
    const resultado = await this.db.query(sql);
    return (resultado.values as Cita[]) ?? [];
  }

  async obtenerCitaAleatoria(): Promise<Cita | null> {
    const citas = await this.obtenerCitas();
    if (citas.length === 0) {
      return null;
    }
    const indice = Math.floor(Math.random() * citas.length);
    return citas[indice];
  }

  async agregarCita(cita: Cita): Promise<void> {
    await this.iniciarPlugin();
    await this.insertar(cita);
  }

  async eliminarCita(id: number): Promise<void> {
    await this.iniciarPlugin();
    const sql = `DELETE FROM ${this.TABLE_NAME} WHERE id = ?`;
    await this.db.run(sql, [id]);
    await this.guardarEnWeb();
  }

  private async insertar(cita: Cita): Promise<void> {
    const sql = `INSERT INTO ${this.TABLE_NAME} (frase, autor) VALUES (?, ?)`;
    await this.db.run(sql, [cita.frase, cita.autor]);
    await this.guardarEnWeb();
  }

  private async guardarEnWeb(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore(this.DB_NAME);
    }
  }
}
