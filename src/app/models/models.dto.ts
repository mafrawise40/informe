import { SafeUrl } from '@angular/platform-browser';
import { Time } from "@angular/common";
import { Timestamp } from "rxjs";

export class Serializable { }
export class BaseDTO extends Serializable {

 

  dataInclusao: Date;
  dataAlteracao: Date

}

export class MarcadorMaps extends BaseDTO {

  id: number;
  latitude: number;
  longitude: number;
  label: string;
  open: string;
  tipo: string;
  tipoIcone: string;
  endereco: Endereco  //veiculo suspeito; pessoa suspeita; ocorrencia; endereco;


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

export class Arquivo extends BaseDTO {

  id: number;
  descricao: string;
  arquivo: Blob;
  url: SafeUrl;

}


export class Informacao extends BaseDTO {

  id: number;
  titulo: string;
  detalhe: string;
  pessoas: Pessoa[];
  veiculos: Veiculo[];
  marcadores: MarcadorMaps[];
  arquivos: Arquivo[];
  situacao: string;
  relevancia: number;
  //mat table
  pessoasMat: string;
  veiculosMat: string;
  enderecoMat: string;

  //chip
  pessoasRemovidas: number[];
  veiculosRemovido: number[];
}

export class FiltroPainelDTO extends BaseDTO {

  campoPesquisa: string;
  dataInicial: any;
  dataFinal: any;
}
