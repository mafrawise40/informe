import { Informacao, Pessoa, Veiculo } from './../../models/models.dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, X } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarcadorMaps } from 'app/models/models.dto';
import { AgmMap } from '@agm/core';
import { google } from "google-maps";


declare var google : google;

export interface Pessoas {
  name: string;
}

export interface Veiculos {
  name: string;
}

export interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}



@Component({
  selector: 'app-informacao',
  templateUrl: './informacao.component.html',
  styleUrls: ['./informacao.component.scss'],
  styles: [
    'agm-map { height: 850px; }'
  ]
})
export class InformacaoComponent implements OnInit {

  @ViewChild(AgmMap) //só carregar depois do afterInit
  agmMap : AgmMap;

  markers: Marker[] = [];

  lat :number = -15.897029963258108; //inicial
  lng :number = -47.78420998141388;
  zoom :number = 17;
  regiao: string = "";
  latMarcado = 0;
  lngMarcado = 0;

  formulario: FormGroup;
  marcador: MarcadorMaps;

  constructor(private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private redirect: Router) { }

  ngOnInit(): void {
    this.criarFormulario();
    this.getLocation();
  }

 

  criarFormulario() {
    this.formulario = this.formBuilder.group({
      titulo: null,
      informacao: null,
      endereco: null,
      regiao: null
    });
  }

  salvar() {

    let informacaoDto: Informacao = this.formulario.value;
    let pessoasList: Pessoa[] = [];
    let VeiculoList: Veiculo[] = [];
    let marcadorMapa: MarcadorMaps = new MarcadorMaps();

    this.pessoas.forEach(element => {
      let pessoaDTO: Pessoa = new Pessoa();
      pessoaDTO.nome = element.name;
      pessoaDTO.dataAtualizacao = new Date();
      pessoaDTO.dataInclusao = new Date();
      pessoasList.push(pessoaDTO);
    });

    this.veiculos.forEach(element => {
      let veiculoDTO: Veiculo = new Veiculo();
      veiculoDTO.descricao = element.name;
      veiculoDTO.dataAtualizacao = new Date();
      veiculoDTO.dataInclusao = new Date();
      VeiculoList.push(veiculoDTO);
    });

    informacaoDto.pessoas = pessoasList;
    informacaoDto.veiculos = VeiculoList;
    informacaoDto.dataAtualizacao = new Date();
    informacaoDto.dataInclusao = new Date();

    this.router.params.subscribe(params => {
      if (params) {
        marcadorMapa.latitude = params['latitude'];
        marcadorMapa.longitude = params['longitude'];
        marcadorMapa.isOpen = true;
        marcadorMapa.tipo = 'informacao'

       if ( this.markers.length > 0) {
        marcadorMapa.latitude = this.markers[0].lat;
        marcadorMapa.longitude = this.markers[0].lng;
       }
      
       informacaoDto.marcador = marcadorMapa;

      }
    });


    if (localStorage.getItem("marcadorInformacao")) {
      let marcadoresListINforme = JSON.parse(localStorage.getItem("marcadorInformacao"));
      marcadoresListINforme.push(informacaoDto);
      localStorage.setItem('marcadorInformacao', JSON.stringify(marcadoresListINforme));
      this.markers = [];
      this.redirect.navigate(['painel']);
    } else {
      let marcadoresListINforme = [];
      marcadoresListINforme.push(informacaoDto);
      localStorage.setItem('marcadorInformacao', JSON.stringify(marcadoresListINforme));
      this.markers = [];
      this.redirect.navigate(['painel']);
    }


  }



  marcadorClick($event) {

    if (this.markers.length > 0) {
      this.markers[0] = {
        lat: $event.coords.lat,
        lng: $event.coords.lng,
        draggable: true
      }
    } else {
      this.markers.push(
        {
          lat: $event.coords.lat,
          lng: $event.coords.lng,
          draggable: true
        }
      )
    }

    this.lat =  $event.coords.lat;
    this.lng = $event.coords.lng;

    this.carregarEndereco();
  }

  clickedMarker() {

  }


  getLocation() {
  
    this.router.params.subscribe(params => {
      if (params) {
        if (this.markers.length > 0) {
          this.markers[0] = {
            lat: params.latitude,
            lng: params.longitude,
            draggable: true
          }
        } else {
          this.markers.push(
            {
              lat: params.latitude,
              lng: params.longitude,
              draggable: true
            }
          )
        }

        this.lat =  Number(params.latitude);
        this.lng = Number(params.longitude);
        this.zoom = 20;
        //console.log(navigator);
      }else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            
          });
        }
      }
    });
    this.carregarEndereco();
  }


carregarEndereco(){
  
  let geocoder = new google.maps.Geocoder();
  let latlng = {
    lat: Number(0),
    lng: Number(0),
  };

  if ( this.markers.length > 0) {
    latlng.lat = Number(this.markers[0].lat);
    latlng.lng = Number(this.markers[0].lng);
  }else {
    latlng.lat = Number(this.lat);
    latlng.lng = Number(this.lng);
  }

  geocoder
    .geocode({ location: latlng })
    .then((response) => {
      if (response.results[0]) {
        this.zoom = 20;

       
        var roofTop: any = response.results.filter(achando => achando.geometry.location_type === "ROOFTOP")[0];
        if ( roofTop === undefined) {
          roofTop =   response.results.filter(achando => achando.types.find( tipos => tipos === "route"))[0];
        }

      let regia = response.results.filter(achando => achando.types.find( tipos => tipos === "administrative_area_level_5"))[0];
       this.regiao = regia.formatted_address;
       
        this.formulario.patchValue({
          endereco: roofTop.formatted_address,
          regiao: this.regiao
        });
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}





  /** CHUIP TEXT AREA */

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  pessoas: Pessoas[] = [];
  veiculos: Veiculos[] = [];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.pessoas.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(pessoas: Pessoas): void {
    const index = this.pessoas.indexOf(pessoas);

    if (index >= 0) {
      this.pessoas.splice(index, 1);
    }
  }

  addVeiculo(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.veiculos.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeVeiculo(veiculo: Veiculos): void {
    const index = this.veiculos.indexOf(veiculo);

    if (index >= 0) {
      this.veiculos.splice(index, 1);
    }
  }

}
