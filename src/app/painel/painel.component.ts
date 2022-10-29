import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Informacao, MarcadorMaps } from 'app/models/models.dto';

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

  marcadoresVeiculos: MarcadorMaps[] = [];
  marcadoresInforme: Informacao[] = [];

  formulario: FormGroup;

  dataRange = new FormGroup({
    start: new FormControl<Date | "" | "pt-BR">(null),
    end: new FormControl<Date | "" | "pt-BR">(null),
  });

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.criarFormulario();
    this.popularMarcadores();
  }

  criarFormulario() {
    this.formulario = this.formBuilder.group({
      campoPesquisa: null,
      data: this.dataRange
    });
  }

  inserirOpcoesMarcador(){

  }

  popularMarcadores(){
   this.marcadoresVeiculos = JSON.parse(localStorage.getItem("marcadores"));
   this.marcadoresInforme = JSON.parse(localStorage.getItem("marcadorInformacao"));
  }

  //inserir um marcador que irá ter as perguntas....
  marcadorClick($event){

    this.latMenu = $event.coords.lat;
    this.longMenu = $event.coords.lng;
  }

  pesquisar(){
    console.log("Pesquisando ....");
    console.log("Datas: ");
    console.log(this.dataRange.value);
  }

}
