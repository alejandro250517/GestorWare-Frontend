export interface Selector {
  serial: string;
  mac: string;
  ip: string;
}

export interface Player {
  serial: string;
  mac: string;
  ip: string;
  marca: string;
  modelo: string;
  sistemaOperativo: string;
}

export interface Pantalla {
  marca: string;
  serial: string;
  tamano: string;
}

export interface Amplificador {
  serial: string;
}

export interface Parlante {
  serial: string;
}

export interface Inventario {
  _id?: string;
  regional: string;
  oficina: string;
  selector: Selector[];
  player: Player[];
  pantalla: Pantalla[];
  amplificador: Amplificador[];
  parlante: Parlante[];
 
}
