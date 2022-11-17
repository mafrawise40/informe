import { InformacaoService } from './../services/informacao.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Informacao, FiltroPainelDTO, MarcadorMaps } from 'app/models/models.dto';
import { NotificationUtil } from 'app/util/NotificationUtil';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss'],
  styles: [
    'agm-map { height: 850px; }'
  ]
})
export class PainelComponent implements OnInit {
  lat = -15.897029963258108; //inicial
  lng = -47.78420998141388;

  latMenu = 0;
  longMenu = 0;

  filtro: FiltroPainelDTO;
  marcadoresVeiculos: MarcadorMaps[] = [];
  marcadoresInforme: Informacao[] = [];

  formulario: FormGroup;

  dataRange = new FormGroup({
    start: new FormControl<Date | "" | "pt-BR">(null),
    end: new FormControl<Date | "" | "pt-BR">(null),
  });

  constructor(
    private formBuilder: FormBuilder,
    private informacaoService: InformacaoService
  ) { }

  ngOnInit(): void {
    this.criarFormulario();
    this.popularMarcadores();
  }

  criarFormulario() {
    this.formulario = this.formBuilder.group({
      campoPesquisa: null,
      data: this.dataRange,

    });
  }

  inserirOpcoesMarcador() {

  }

  popularMarcadores() {
    //this.marcadoresVeiculos = JSON.parse(localStorage.getItem("marcadores"));

    let hoje = new Date();

    if ( this.filtro === undefined) {
      this.filtro = {
        campoPesquisa: "",
        dataInicial: new Date(hoje.getFullYear(), hoje.getMonth(), 1)  , //primeiro dia do mes
        dataFinal: new Date(hoje.getFullYear(), hoje.getMonth() +1 , 0), //ultimo dia do mes
        dataAlteracao: null,
        dataInclusao: null
      }

    }

    this.informacaoService.getByParametros(this.filtro).subscribe({
      next: (v) => {
        this.marcadoresInforme = v
        console.log(this.marcadoresInforme );
      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar carregar as informações. ', 4)
      },
      complete: () => { }
    })
  }

  //inserir um marcador que irá ter as perguntas....
  marcadorClick($event) {

    this.latMenu = $event.coords.lat;
    this.longMenu = $event.coords.lng;
  }

  pesquisar() {

    this.filtro = this.formulario.value;
    this.filtro.campoPesquisa = this.formulario.get("campoPesquisa").value;
    this.filtro.dataInicial = this.dataRange.value.start;
    this.filtro.dataFinal = this.dataRange.value.end;

    NotificationUtil.showNotification('top', 'center', 'Realizando pesquisa...', 1);
    
    this.informacaoService.getByParametros(this.filtro).subscribe({
      next: (v) => {
        this.marcadoresInforme = v
        
      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar carregar as informações. ', 4)
      },
      complete: () => { 
        let qtd = this.marcadoresInforme.length;
        NotificationUtil.showNotification('top', 'center', qtd+' registro(s) encontrados ', 1);
       }
    })
  }

}
