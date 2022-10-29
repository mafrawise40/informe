import { Time } from "@angular/common";
import { Timestamp } from "rxjs";

export class Serializable { }
export class BaseDTO extends Serializable {

 

  dataInclusao: Date;
  dataAtualizacao: Date

}

export class MarcadorMaps extends BaseDTO {

  id: number;
  latitude: number;
  longitude: number;
  label: string;
  isOpen: boolean;
  tipo: string; //veiculo suspeito; pessoa suspeita; ocorrencia; endereco;


}

export class Veiculo extends BaseDTO {

  id: number;
  descricao: string;
  placa: number;
  marcador: MarcadorMaps;

}

export class Pessoa extends BaseDTO {

  id: number;
  nome: string;
  rg: string;
  cpf: string;
  mae: string;
  pai: string;
  suspeita: string;
  situacao: string;
  regiao: string;
  observacao: string;
  endereco: Endereco[];

}

export class Endereco extends BaseDTO {

  id: number;
  descricao: string;
  regiao: string;
  uf: string;
  marcador: MarcadorMaps;

}


export class Informacao extends BaseDTO {

  id: number;
  titulo: string;
  informacao: string;
  pessoas: Pessoa[];
  veiculos: Veiculo[];
  marcador: MarcadorMaps;

}
