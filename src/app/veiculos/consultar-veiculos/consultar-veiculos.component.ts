import { VeiculoService } from './../../services/veiculo.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationUtil } from 'app/util/NotificationUtil';
import { Veiculo } from 'app/models/models.dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogoVeiculoDesfechoComponent } from 'app/dialogo/dialogo-veiculo-desfecho/dialogo-veiculo-desfecho.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-consultar-veiculos',
  templateUrl: './consultar-veiculos.component.html',
  styleUrls: ['./consultar-veiculos.component.scss']
})
export class ConsultarVeiculosComponent implements OnInit {


  @ViewChild(MatPaginator) paginatorVeiculos: MatPaginator;
  @ViewChild(MatPaginator) paginatorVeiculosCaGeral: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  //veiculos
  displayedColumnsVeiculos: string[] = ['Placa', 'Descrição', 'Informações', 'Ações'];
  dataSourceVeiculo: MatTableDataSource<Veiculo> = new MatTableDataSource<Veiculo>();
  veiculosLista: Veiculo[] = [];

  //veiculos carater geral
  displayedColumnsVeiculosCaGeral: string[] = ['Placa', 'Descrição', 'Informações', 'Ações'];
  dataSourceVeiculoCageral: MatTableDataSource<Veiculo> = new MatTableDataSource<Veiculo>();
  veiculosListaCaGeral: Veiculo[] = [];

  constructor(private veiculoService: VeiculoService,
    private dialog: MatDialog,
    private redirect: Router
  ) { }

  ngOnInit(): void {
    this.getVeiculos();
    this.getVeiculosCaGeral();
  }

  getVeiculos() {
    this.veiculoService.getAll().subscribe({
      next: (v) => {
        this.veiculosLista = v;
        this.dataSourceVeiculo = new MatTableDataSource<Veiculo>(this.veiculosLista);
        this.dataSourceVeiculo.paginator = this.paginatorVeiculos;
        this.dataSourceVeiculo.paginator._intl.itemsPerPageLabel = 'Exibir';


      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar buscar os veículos. ', 4)
      },
      complete: () => {

      }



    })
  }

  getVeiculosCaGeral() {
    this.veiculoService.getAllCaGeral().subscribe({
      next: (v) => {
        this.veiculosListaCaGeral = v;
        this.dataSourceVeiculoCageral = new MatTableDataSource<Veiculo>(this.veiculosListaCaGeral);


      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar buscar os veículos. ', 4)
      },
      complete: () => {

      }



    })
  }

  incluirCarater(element: Veiculo) {
    this.veiculoService.incluirCarater(element.id).subscribe({
      next: (v) => {
        this.getVeiculos();
        this.getVeiculosCaGeral();

      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar incluir no carater geral. ', 4)
      },
      complete: () => {

      }



    })

  }

  incluirDesfechoCarater(element: Veiculo) {

    console.log(element);

    let textoMarcacao = "";
    const dialogRef = this.dialog.open(DialogoVeiculoDesfechoComponent, {
      width: '40%',
      data: {
        inputText: element.desfechoCaraterGeral
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        element.desfechoCaraterGeral = result;
        this.veiculoService.incluirDesfecho(element).subscribe({
          next: (v) => {
            this.getVeiculos();
            this.getVeiculosCaGeral();

          },
          error: (e) => {
            NotificationUtil.showNotification('top', 'right', 'Erro ao tentar incluir no carater geral. ', 4)
          },
          complete: () => {

          }



        })

      }
    });

  }

  public editar(element: Veiculo) {
    this.redirect.navigate(['veiculo/editar/', element.id]);
  }




}
