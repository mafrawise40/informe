import { element } from 'protractor';
import { NotificationUtil } from './../../util/NotificationUtil';
import { InformacaoService } from './../../services/informacao.service';
import { Informacao, Pessoa, Veiculo, Endereco } from './../../models/models.dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, X } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarcadorMaps } from 'app/models/models.dto';
import { AgmMap } from '@agm/core';
import { google } from "google-maps";


declare var google: google;

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
    'agm-map { height: 600px; width: 800px }'
  ]
})
export class InformacaoComponent implements OnInit {

  @ViewChild(AgmMap) //só carregar depois do afterInit
  agmMap: AgmMap;

  markers: Marker[] = [];

  lat: number = -15.897029963258108; //inicial
  lng: number = -47.78420998141388;
  zoom: number = 17;
  regiao: string = "";
  latMarcado = 0;
  lngMarcado = 0;

  editar: boolean = this.redirect.url.includes('editar');

  formulario: FormGroup;
  marcador: MarcadorMaps;

  files: any[];
  urls = new Array<string>();

  informacaoDto: Informacao;

  constructor(private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private redirect: Router,
    private informacaoService: InformacaoService) { }

  ngOnInit(): void {
    this.criarFormulario();
    this.getLocation();
  }





  criarFormulario() {

    this.formulario = this.formBuilder.group({
      titulo: null,
      detalhe: null,
      endereco: null,
      regiao: null
    });

    
    if (this.editar) {
      this.router.params.subscribe(params => {
        this.informacaoService.getById(params.id).subscribe({
          next: (v) => {
            this.formulario.patchValue({
              id: v.id,
              titulo: v.titulo,
              detalhe: v.detalhe,
            });

            console.log(v);
            if (v.pessoas) {
              v.pessoas.forEach(pessoa => {
                this.pessoas.push({ name: pessoa.nome });
              });
            }
            if (v.veiculos) {
              v.veiculos.forEach(veiculo => {
                this.veiculos.push({ name: veiculo.descricao });
              });
            }

            if (v.marcadores[0] && v.marcadores[0].endereco) {
              this.formulario.patchValue({
                endereco: v.marcadores[0].endereco.descricao,
                regiao: v.marcadores[0].endereco.regiao
              });

            }

            this.informacaoDto = v;
            this.atualizarMarker(this.informacaoDto.marcadores[0].latitude, this.informacaoDto.marcadores[0].longitude);
          },

          error: (e) => {
            NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar a informação. ', 4)
          },
          complete: () => console.info('complete')
        });
      });
    }
  }

  salvarNotifica() {

  }

  salvar() {

    this.informacaoDto = this.formulario.value;
    let pessoasList: Pessoa[] = [];
    let VeiculoList: Veiculo[] = [];
    let endereco: Endereco = new Endereco();
    let marcadorMapa: MarcadorMaps = new MarcadorMaps();


    this.pessoas.forEach(element => {
      let pessoaDTO: Pessoa = new Pessoa();
      pessoaDTO.nome = element.name;
      pessoaDTO.dataAlteracao = new Date();
      pessoaDTO.dataInclusao = new Date();
      pessoasList.push(pessoaDTO);
    });

    this.veiculos.forEach(element => {
      let veiculoDTO: Veiculo = new Veiculo();
      veiculoDTO.descricao = element.name;
      veiculoDTO.dataAlteracao = new Date();
      veiculoDTO.dataInclusao = new Date();
      VeiculoList.push(veiculoDTO);
    });

    this.informacaoDto.pessoas = pessoasList;
    this.informacaoDto.veiculos = VeiculoList;
    this.informacaoDto.dataAlteracao = new Date();
    this.informacaoDto.dataInclusao = new Date();


    this.router.params.subscribe(params => {
      if (params) {
        marcadorMapa.latitude = params['latitude'];
        marcadorMapa.longitude = params['longitude'];
        marcadorMapa.open = 'true';


        if (params['tipoInformacao'] === "carro") {
          marcadorMapa.tipo = 'carro'
          marcadorMapa.tipoIcone = "'http://maps.google.com/mapfiles/kml/pal4/icon15.png'";
        } else if (params['tipoInformacao'] === "pessoa") {
          marcadorMapa.tipo = 'pessoa'
          marcadorMapa.tipoIcone = "'http://maps.google.com/mapfiles/kml/pal2/icon14.png'";
        } else {
          marcadorMapa.tipo = 'informacao'
          marcadorMapa.tipoIcone = "'http://maps.google.com/mapfiles/kml/pal4/icon49.png'";
        }

        if (this.markers.length > 0) {
          marcadorMapa.latitude = this.markers[0].lat;
          marcadorMapa.longitude = this.markers[0].lng;
        }

        marcadorMapa.endereco = endereco;
        this.informacaoDto.marcadores = marcadorMapa;

      }
    });

    endereco.descricao = this.formulario.get("endereco").value;
    endereco.regiao = this.formulario.get("regiao").value;



    //salvar arquivos...
    if (this.files) {
      let formData: FormData = new FormData();

      for (let index = 0; index < this.files.length; index++) {
        const element = this.files[index];
        formData.append('image[' + index + ']', element);
      }

      /*this.informacaoService.uploadImagens(formData).subscribe(result=> {
        console.log("Imagem salva");
      })*/
    }

    //salvar a informacao
    this.informacaoService.save(this.informacaoDto, false).subscribe({
      next: (v) => {
        NotificationUtil.showNotification('top', 'right', 'Informação salva com sucesso.', 2)
        this.redirect.navigate(['painel']);
      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar salvar a informação. ', 4)
      },
      complete: () => console.info('complete')
    });

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

    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;

    this.carregarEndereco();
  }

  clickedMarker() {

  }

  atualizarMarker(lat: any, lng: any) {
    if (this.markers.length > 0) {
      this.markers[0] = {
        lat: lat,
        lng: lng,
        draggable: true
      }
    } else {
      this.markers.push(
        {
          lat: lat,
          lng: lng,
          draggable: true
        }
      )
    }

    //atualiza na tela.
    this.lat = Number(lat);
    this.lng = Number(lng);
    this.zoom = 20;
  }

  getLocation() {

    this.router.params.subscribe(params => {
      if (!this.editar && params && params.latitude != 0) {

        this.atualizarMarker(params.latitude, params.longitude);
        

      } else {

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


  carregarEndereco() {

    let geocoder = new google.maps.Geocoder();
    let latlng = {
      lat: Number(0),
      lng: Number(0),
    };

    if (this.markers.length > 0) {
      latlng.lat = Number(this.markers[0].lat);
      latlng.lng = Number(this.markers[0].lng);
    } else {
      latlng.lat = Number(this.lat);
      latlng.lng = Number(this.lng);
    }

    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {
          this.zoom = 20;


          var roofTop: any = response.results.filter(achando => achando.geometry.location_type === "ROOFTOP")[0];
          if (roofTop === undefined) {
            roofTop = response.results.filter(achando => achando.types.find(tipos => tipos === "route"))[0];
          }

          let regia = response.results.filter(achando => achando.types.find(tipos => tipos === "administrative_area_level_5"))[0];
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



  detectFiles(event) {
    this.files = event.target.files;

    if (this.files) {
      for (let file of this.files) {
        if (file.size > 5120000) {

        } else {
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.urls.push(e.target.result);
          }
          reader.readAsDataURL(file);

        }

      }
    }

  }

  removerImagem(i: number) {
    if (this.urls) {
      this.urls.splice(i, 1);
    }
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
