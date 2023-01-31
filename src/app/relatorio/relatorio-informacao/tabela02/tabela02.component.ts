import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Informacao } from 'app/models/models.dto';
import { InformacaoService } from 'app/services/informacao.service';
import { NotificationUtil } from 'app/util/NotificationUtil';

@Component({
  selector: 'app-tabela02',
  templateUrl: './tabela02.component.html',
  styleUrls: ['./tabela02.component.scss']
})
export class Tabela02Component implements OnInit {

  informacoes02: Informacao[] = [];
  dataSourceInformacao02: MatTableDataSource<Informacao> = new MatTableDataSource<Informacao>();
  @ViewChild(MatPaginator) paginator02: MatPaginator;
  @ViewChild(MatSort) sort02: MatSort;
  displayedColumns02: string[] = ['select', 'numero', 'informacao', 'opcoes'];
  selection02: SelectionModel<Informacao> = new SelectionModel<Informacao>(true, []);

  constructor(private informacaoService: InformacaoService) { }

  ngOnInit(): void {
  }

  carregarInformacao() {
    this.informacaoService.getAll().subscribe({
      next: (v) => {

        this.informacoes02 = v;

        this.dataSourceInformacao02 = new MatTableDataSource<Informacao>(this.informacoes02);
        this.dataSourceInformacao02.paginator = this.paginator02;
     
      }
      , error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar a informação. ', 4)
      },
      complete: () => {
      }
    });
  }

}
