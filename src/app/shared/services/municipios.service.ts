import { Injectable } from '@angular/core';
import { municipios } from '../contants/municipios';
import { Municipio } from '../interfaces/municipios.interface';

@Injectable({
  providedIn: 'root',
})
export class MunicipiosService {
  municipios = municipios;

  constructor() {}

  listaMunicipios(uf: string): Array<Municipio> {
    return this.municipios.filter((m) => m.uf_code === uf);
  }

  listaMunicipiosFaixaPopulacao(uf: string): Array<Municipio> {
    return this.municipios
      .filter((m) => m.uf_code === uf)
      .filter((m) => m.pop_21 > 120000 && m.pop_21 < 500000);
  }
}
