import { MobileCheckUtils } from './../../util/MobileCheckUtil';
import { element } from 'protractor';
import { NotificationUtil } from './../../util/NotificationUtil';
import { InformacaoService } from './../../services/informacao.service';
import { Informacao, Pessoa, Veiculo, Endereco, Arquivo } from './../../models/models.dto';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, I, X } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarcadorMaps } from 'app/models/models.dto';
import { AgmMap } from '@agm/core';
import { google } from "google-maps";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { delay } from 'rxjs';


declare var google: google;

export interface Pessoas {
  id: number;
  name: string;
}

export interface Veiculos {
  id: number;
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
    'agm-map { height: 500px; width: 100% }'
  ]
})
export class InformacaoComponent implements OnInit, AfterViewInit {

  @ViewChild(AgmMap) //só carregar depois do afterInit
  agmMap: AgmMap;

  markers: Marker[] = [];

  lat: number = -15.897029963258108; //inicial
  lng: number = -47.78420998141388;
  zoom: number = 1;
  regiao: string = "";
  latMarcado = 0;
  lngMarcado = 0;

  editar: boolean = this.redirect.url.includes('editar');
  editarExisteMarcador = false;

  formulario: FormGroup;
  marcador: MarcadorMaps;
  arquivosImagens: Arquivo[] = []


  files: any[] = [];
  urls = new Array<string>();

  informacaoDto: Informacao = new Informacao();
  formData: FormData = new FormData();

  constructor(private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private redirect: Router,
    private informacaoService: InformacaoService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.criarFormulario();


  }

  ngAfterViewInit(): void {

  }





  criarFormulario() {

    this.formulario = this.formBuilder.group({
      titulo: null,
      detalhe: null,
      endereco: null,
      regiao: null
    });

    if (this.editar) {
      console.log("Entrou no editar..")
      this.router.params.subscribe(params => {
        this.informacaoService.getById(params.id).subscribe({
          next: (v) => {
            this.informacaoDto = v;
            this.formulario.patchValue({
              id: v.id,
              titulo: v.titulo,
              detalhe: v.detalhe,
            });

            if (v.pessoas) {
              v.pessoas.forEach(pessoa => {
                this.pessoas.push({ id: pessoa.id, name: pessoa.nome });
              });
            }
            if (v.veiculos) {
              v.veiculos.forEach(veiculo => {
                this.veiculos.push({ id: veiculo.id, name: veiculo.descricao });
              });
            }

            if (v.marcadores[0] && v.marcadores[0].endereco) {
              this.editarExisteMarcador = true;
              this.formulario.patchValue({
                endereco: v.marcadores[0].endereco.descricao,
                regiao: v.marcadores[0].endereco.regiao
              });

              //causando problemas no mapa..
              this.atualizarMarker(this.informacaoDto.marcadores[0].latitude, this.informacaoDto.marcadores[0].longitude, 17, false);

            }


            if (this.informacaoDto.arquivos && this.informacaoDto.arquivos.length > 0) {
              this.informacaoDto.arquivos.forEach(element => {
                var imagem = element;

                let objectURL = 'data:image/jpeg;base64,' + imagem.arquivo;
                let arquivoImg = new Arquivo();
                arquivoImg.id = imagem.id;
                arquivoImg.url = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                this.arquivosImagens.push(arquivoImg);
              });
            }


          },

          error: (e) => {
            NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar a informação. ', 4)
          },
          complete: () => { console.log("completou o by id?") }
        });
      });
    } else {
      //operação normal de cadastrar
      this.getLocation();
    }
  }

  salvarNotifica() {

  }

  salvar() {

    let pessoasList: Pessoa[] = [];
    let VeiculoList: Veiculo[] = [];
    let endereco: Endereco = new Endereco();
    let marcadorMapa: MarcadorMaps = new MarcadorMaps();
    let marcaroSelecionadoEditar: MarcadorMaps;

    this.pessoas.forEach(element => {
      let pessoaDTO: Pessoa = new Pessoa();
      if (element.id) {
        pessoaDTO.id = element.id;
      }
      pessoaDTO.nome = element.name;
      pessoaDTO.dataAlteracao = new Date();
      pessoaDTO.dataInclusao = new Date();
      pessoasList.push(pessoaDTO);
    });

    this.veiculos.forEach(element => {
      let veiculoDTO: Veiculo = new Veiculo();
      if (element.id) {
        veiculoDTO.id = element.id;
      }
      veiculoDTO.descricao = element.name;
      veiculoDTO.dataAlteracao = new Date();
      veiculoDTO.dataInclusao = new Date();
      VeiculoList.push(veiculoDTO);
    });

    this.informacaoDto.pessoas = pessoasList;
    this.informacaoDto.veiculos = VeiculoList;
    this.informacaoDto.dataAlteracao = new Date();
    this.informacaoDto.dataInclusao = new Date();

    //aqui faz manter o mesmo marcador...
    if (this.editar) {
      marcaroSelecionadoEditar = this.informacaoDto.marcadores[this.informacaoDto.marcadores.length - 1]
    }


    this.router.params.subscribe(params => {
      if (this.redirect.url.includes("latitude")) {
        marcadorMapa.latitude = params['latitude'];
        marcadorMapa.longitude = params['longitude'];

      }


      if ((params['tipoInformacao'] !== undefined) || (this.editar)) {

        if (params['tipoInformacao'] === "carro" || (marcaroSelecionadoEditar.tipo == "carro")) {
          marcadorMapa.tipo = 'carro'
          marcadorMapa.tipoIcone = "'http://maps.google.com/mapfiles/kml/pal4/icon15.png'";
        } else if (params['tipoInformacao'] === "pessoa" || (marcaroSelecionadoEditar.tipo == "pessoa")) {
          marcadorMapa.tipo = 'pessoa'
          marcadorMapa.tipoIcone = "'http://maps.google.com/mapfiles/kml/pal2/icon14.png'";
        } else {

          marcadorMapa.tipo = 'informacao'
          marcadorMapa.tipoIcone = "'http://maps.google.com/mapfiles/kml/pal4/icon49.png'";
        }
      } else if (params['tipoInformacao'] === undefined) {
        marcadorMapa.open = 'true';
        marcadorMapa.tipo = 'informacao';
        marcadorMapa.tipoIcone = "'http://maps.google.com/mapfiles/kml/pal4/icon49.png'";
      }
    });



    if (this.markers.length > 0) {
      marcadorMapa.latitude = this.markers[this.markers.length - 1].lat;
      marcadorMapa.longitude = this.markers[this.markers.length - 1].lng;
      if (this.editar) {
        marcadorMapa.tipo = marcaroSelecionadoEditar.tipo;
        marcadorMapa.tipoIcone = marcaroSelecionadoEditar.tipoIcone;
        marcadorMapa.id = marcaroSelecionadoEditar.id; //mantém o mesmo marcador
        if (marcaroSelecionadoEditar.endereco !== null && marcaroSelecionadoEditar.endereco !== undefined) {
          endereco.id = marcaroSelecionadoEditar.endereco.id; //mantém o mesmo endereço.
        }
      }
    }

    endereco.descricao = this.formulario.get("endereco").value;
    endereco.regiao = this.formulario.get("regiao").value;
    marcadorMapa.endereco = endereco;

    this.informacaoDto.marcadores = [];
    this.informacaoDto.marcadores.push(marcadorMapa);



    this.informacaoDto.titulo = this.formulario.get("titulo").value;
    this.informacaoDto.detalhe = this.formulario.get("detalhe").value;


    //salvar arquivos...
    if (this.files) {
      for (let index = 0; index < this.files.length; index++) {
        const element = this.files[index];
        this.formData.append('image[' + index + ']', element);
      }
    }

    if (this.editar) {
      this.informacaoDto.pessoasRemovidas = this.chipRemovidosPessoas;
      this.informacaoDto.veiculosRemovido = this.chipRemovidosVeiculos;
    }

    //salvar a informacao

    this.processarSalvamento();

  }

  processarSalvamento() {
    this.informacaoService.save(this.informacaoDto, this.editar).subscribe({
      next: (v) => {

        if (this.files) {

          this.processarUpload(v);
        }

        NotificationUtil.showNotification('top', 'right', 'Informação salva com sucesso.', 2)
        this.redirect.navigate(['informacao/consultar']);
      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar salvar a informação. ', 4)
      },
      complete: () => { }
    });
  }

  processarUpload(informacao: Informacao) {
    this.informacaoService.uploadImagens(this.formData, informacao.id).subscribe({
      next: (v) => {
      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar salvar arquivo ', 4)
      }
    });
  }

  carregarFotos() {

  }

  marcadorClick($event) {
    this.markers = [];

    this.markers.push(
      {
        lat: $event.coords.lat,
        lng: $event.coords.lng,
        draggable: true
      }
    )


    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;

    this.carregarEndereco();
  }

  marcarLocalizacao() {
    this.getLocation();
  }

  clickedMarker() {

  }

  deletarImagem(arquivo: Arquivo, i: number) {
    const confirmAction = confirm('Gostaria de deletar esta imagem?');
    if (confirmAction) {
      this.informacaoService.deleteImagem(this.informacaoDto.id, arquivo.id).subscribe({
        next: (v) => {
          NotificationUtil.showNotification('top', 'right', 'Imagem deletado com sucesso.', 2);
          this.removerImagemDeletadaBanck(i);
        },
        error: (e) => {
          NotificationUtil.showNotification('top', 'right', 'Falha ao deletar a imagem', 4);
        },
        complete: () => { }
      })

    }

  }

  atualizarMarker(lat: any, lng: any, zoom: number, carregarEndereco: boolean) {
    this.markers = [];
    this.markers.push(
      {
        lat: lat,
        lng: lng,
        draggable: true
      }
    )

    //atualiza na tela a posição do mapa
    if (lat != 0) {
      this.lat = Number(lat);
      this.lng = Number(lng);
      this.zoom = zoom;
    }

    if (carregarEndereco) {
      this.carregarEndereco();
    }
  }


  isMarcadorPadrao: boolean = false;
  getLocation() {

    this.router.params.subscribe(params => {

      //aqui é se a pessoa clicar no mapa e colocar uma informação...
      if (!this.editar && params && params.latitude != 0) {

        this.atualizarMarker(params.latitude, params.longitude, 12, true);

      } else {

        //aqui é cadastar pelo botão de cadastrar

        //se for PC
        //mostrar o mapa de acordo com a região

        //se for mobile...

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.atualizarMarker(position.coords.latitude, position.coords.longitude, 17, true);
            this.isMarcadorPadrao = true;

          });
        }
      }
    });

  }


  carregarEndereco() {

    let geocoder = new google.maps.Geocoder();
    let latlng = {
      lat: Number(this.lat),
      lng: Number(this.lng),
    };


    if (this.markers.length > 0 && this.markers[this.markers.length - 1].lat != 0) {
      latlng.lat = Number(this.markers[this.markers.length - 1].lat);
      latlng.lng = Number(this.markers[this.markers.length - 1].lng);

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

    let arrayFiles: any[] = event.target.files;
    for (let index = 0; index < arrayFiles.length; index++) {
      const element = arrayFiles[index];

      const find = this.files.find(x => x.name === element.name);

      if (!find) {
        this.files.push(element);
      }
    }


    if (this.files) {
      this.urls = new Array<string>();

      for (let file of this.files) {
        /*if (file.size > 5120000) {

        }
        else {*/
          let reader = new FileReader();
          reader.onload = (e: any) => {
            this.urls.push(e.target.result);
          }
          reader.readAsDataURL(file);

        //}

      }
    }

  }

  removerImagem(i: number) {
    if (this.urls) {
      this.urls.splice(i, 1);
    }
  }

  removerImagemDeletadaBanck(i: number) {
    if (this.arquivosImagens) {
      this.arquivosImagens.splice(i, 1);
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
      this.pessoas.push({ id: 0, name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }


  chipRemovidosPessoas: number[] = [];
  chipRemovidosVeiculos: number[] = [];
  remove(pessoas: Pessoas): void {
    const index = this.pessoas.indexOf(pessoas);
    if (this.editar) {
      this.chipRemovidosPessoas.push(this.pessoas[index].id);
    }
    if (index >= 0) {
      this.pessoas.splice(index, 1);
    }

  }



  addVeiculo(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.veiculos.push({ id: 0, name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeVeiculo(veiculo: Veiculos): void {
    const index = this.veiculos.indexOf(veiculo);

    if (this.editar) {
      this.chipRemovidosVeiculos.push(this.veiculos[index].id);
    }
    if (index >= 0) {
      this.veiculos.splice(index, 1);
    }

  }

}
