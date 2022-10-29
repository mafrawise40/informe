import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Informacao } from 'app/models/models.dto';

@Component({
  selector: 'app-informacao-consultar',
  templateUrl: './informacao-consultar.component.html',
  styleUrls: ['./informacao-consultar.component.scss']
})
export class InformacaoConsultarComponent implements OnInit {


  informacaoDto: Informacao;
  listInformacao: Informacao[];

  displayedColumns: string[] = ['Título', 'Informação', 'Pessoas', 'Veículo', 'Endereço' , 'Atualização' , 'Ações'];
  dataSource: MatTableDataSource<Informacao>;

  constructor() { }

  ngOnInit(): void {
    this.carregarInformacoes();
   
  }

  cadastrar() {

  }
  carregarInformacoes() {
    if (localStorage.getItem("marcadorInformacao")) {
      this.listInformacao = JSON.parse(localStorage.getItem("marcadorInformacao"));
      console.log(this.listInformacao);
      this.dataSource = new MatTableDataSource<Informacao>(this.listInformacao);
    } 

  }


}
