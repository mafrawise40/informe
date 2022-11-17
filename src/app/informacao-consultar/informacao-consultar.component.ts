import { element } from 'protractor';
import { InformacaoService } from './../services/informacao.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Informacao } from 'app/models/models.dto';
import { NotificationUtil } from 'app/util/NotificationUtil';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informacao-consultar',
  templateUrl: './informacao-consultar.component.html',
  styleUrls: ['./informacao-consultar.component.scss']
})
export class InformacaoConsultarComponent implements OnInit {


  informacaoDto: Informacao;
  listInformacao: Informacao[];

  displayedColumns: string[] = ['Título', 'Informação', 'Pessoas', 'Veículo', 'Endereço', 'Atualização', 'Ações'];
  dataSource: MatTableDataSource<Informacao> = new MatTableDataSource<Informacao>();

  palavraPesquisada: string = "";

  constructor(private informacaoService: InformacaoService,
              private router: Router) { }

  ngOnInit(): void {
    this.carregarInformacoes();

  }

  cadastrar() {

  }
  carregarInformacoes() {

    this.informacaoService.getAll().subscribe({
      next: (v) => {
        this.listInformacao = v;
        this.dataSource = new MatTableDataSource<Informacao>(this.listInformacao);
      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar as informações. ', 4)
      },
      complete: () => {}
    })

  }

  public doFilter = (value: string) => {
    this.palavraPesquisada = value;
    localStorage.setItem('pesquisaInforme', this.palavraPesquisada);
    this.dataSource.filter = this.palavraPesquisada;
  }

  public editar(element: Informacao){
    this.router.navigate(['informacao/editar/', element.id]);
  }

  public deletar(element: Informacao){
    const confirmAction = confirm('Gostaria de deletar esta informação?');
        if (confirmAction) {
         
          this.informacaoService.delete(element.id).subscribe({
            next: (v) => {
              NotificationUtil.showNotification('top','right' , 'Informação deletada com sucesso.' , 2);
              this.removerElementoDoArray(element.id , this.listInformacao);
              this.dataSource = new MatTableDataSource<Informacao>(this.listInformacao);
            },
            error: (e) => {
              NotificationUtil.showNotification('top', 'right', 'Falha ao deletar a informação', 4);
            },
            complete: () => {}
          })
            
        }
    
  }

  removerElementoDoArray(id: number, lista: any[]) {
    const elemento = lista.find(obj => obj.id === id);
    const index = lista.indexOf(elemento);
    lista.splice(index, 1);
  }


}
