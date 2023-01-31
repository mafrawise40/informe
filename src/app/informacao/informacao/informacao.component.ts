import { PessoaService } from './../../services/pessoa.service';
import { MarcadorService } from './../../services/marcador.service';
import { MobileCheckUtils } from './../../util/MobileCheckUtil';
import { element } from 'protractor';
import { NotificationUtil } from './../../util/NotificationUtil';
import { InformacaoService } from './../../services/informacao.service';
import { Informacao, Pessoa, Veiculo, Endereco, Arquivo, TipoFileDTO, TipoUrlFileDTO, InformacaoPessoa } from './../../models/models.dto';
import { AfterViewInit, Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, I, X } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarcadorMaps } from 'app/models/models.dto';
import { AgmMap } from '@agm/core';
import { google } from "google-maps";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { delay, map, Observable, startWith, take } from 'rxjs';
import { NgxImageCompressService } from "ngx-image-compress";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DialogoComponent } from 'app/dialogo/dialogo.component';
import { DialogoEditarTituloImagemComponent } from 'app/dialogo/dialogo-editar-titulo-imagem/dialogo-editar-titulo-imagem.component';
import { ArquivoService } from 'app/services/arquivo.service';
import { DOCUMENT } from '@angular/common';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';


declare var google: google;


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

  @ViewChild(MatPaginator) paginatorPessoas: MatPaginator;
  @ViewChild(MatPaginator) paginatorVeiculos: MatPaginator;
  @ViewChild(MatPaginator) paginatorEnderecos: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  markers: Marker[] = [];

  lat: number = -15.897029963258108; //inicial
  lng: number = -47.78420998141388;
  zoom: number = 17;
  regiao: string = "";
  latMarcado = 0;
  lngMarcado = 0;

  linhasTextArea: number = 15;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  editar: boolean = this.redirect.url.includes('editar');
  editarExisteMarcador = false;

  formulario: FormGroup;

  marcador: MarcadorMaps;
  arquivosImagens: Arquivo[] = []
  arquivosImagensLazy: string[] = []

  novasFotosFormControl: FormControl[] = [];


  informacaoDto: Informacao = new Informacao();
  formData: FormData = new FormData();


  displayedColumns: string[] = ['Nome', 'Envolvimento', 'CPF', 'Pai', 'Mãe', 'Ações'];
  dataSource: MatTableDataSource<InformacaoPessoa> = new MatTableDataSource<InformacaoPessoa>();
  pessoasLista: Pessoa[] = [];
  informacaoPessoaLista: InformacaoPessoa[] = [];
  pessoasRemovidas: number[] = []


  //veiculos
  displayedColumnsVeiculos: string[] = ['Placa', 'Descrição', 'Ações'];
  dataSourceVeiculo: MatTableDataSource<Veiculo> = new MatTableDataSource<Veiculo>();
  veiculosLista: Veiculo[] = [];
  filteredOptionsVeiculos: Observable<string[]>;
  veiculosRemovidos: number[] = []

  //enderecos
  displayedColumnsEnderecos: string[] = ['Informação', 'Endereço', 'Região', 'Latitude', 'Longitude', 'Ações'];
  dataSourceEnderecos: MatTableDataSource<MarcadorMaps> = new MatTableDataSource<MarcadorMaps>();
  enderecosLista: MarcadorMaps[] = [];

  idPessoa: number;
  options: Pessoa[] = [];
  filteredOptionsPessoas: Observable<Pessoa[]>;
  filteredOptions: Observable<Pessoa[]>;

  filteredOptionsEnderecos: Observable<string[]>;


  constructor(private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private redirect: Router,
    private informacaoService: InformacaoService,
    private arquivoService: ArquivoService,
    private imageCompress: NgxImageCompressService,
    private marcadorService: MarcadorService,
    private dialog: MatDialog,
    private pessoaService: PessoaService,
    @Inject(DOCUMENT) document: Document,
    private _ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.criarFormulario();

    this.filteredOptionsPessoas = this.formulario.get("pessoas").valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );




  }



  carregarValorNoForm(element: Pessoa) {
    this.formulario.get("pessoas").patchValue({
      pai: element.pai,
      mae: element.mae,
      cpf: element.cpf,
      nome: element.nome,
      apelido: element.apelido,
      nascimento: element.nascimento,
    });
    this.idPessoa = element.id;
  }

  private _filter(value: any): Pessoa[] {
    console.log(value)

    if ((value !== "" && value !== null && value !== undefined)
      &&
      ((value.nome !== "" && value.nome !== null && value.nome !== undefined) ||
        (value.cpf !== "" && value.cpf !== null && value.cpf !== undefined) ||
        (value.pai !== "" && value.pai !== null && value.pai !== undefined) ||
        (value.mae !== "" && value.mae !== null && value.mae !== undefined) ||
        (value.apelido !== "" && value.apelido !== null && value.apelido !== undefined)
      )
    ) {
      const filterValue: string = value.nome as string;
      const filterValueCpf: string = value.cpf as string;
      const filterValuePai: string = value.pai as string;
      const filterValueMae: string = value.mae as string;
      const filterValueApelido: string = value.apelido as string;

      let dto: Pessoa = {
        id: null,
        nome: filterValue,
        rg: null,
        cpf: filterValueCpf,
        mae: filterValueMae,
        pai: filterValuePai,
        suspeita: null,
        situacao: null,
        regiao: null,
        observacao: null,
        endereco: null,
        apelido: filterValueApelido,
        linkGenesis: null,
        detalhe: null,
        informacaoPessoas: null,
        nascimento: null,
        arquivos: null,
      }
      this.pessoaService.getByParametros(dto).subscribe({
        next: (v) => {

          this.options = v;
          return this.options;

        },
        error: (e) => {
          NotificationUtil.showNotification('top', 'right', 'Erro ao tentar buscar pessoa. ', 4)
        },
        complete: () => {
          return this.options;
        }
      })

      return this.options;

    }
  }

  ngAfterViewInit(): void {

  }


  criarFormulario() {

    this.formulario = this.formBuilder.group({
      titulo: null,
      detalhe: null,
      endereco: null,
      regiao: null,
      pessoas: this.formBuilder.group({
        nome: [null, Validators.required],
        pai: null,
        mae: null,
        cpf: null,
        apelido: null,
        envolvimento: null,
        nascimento: null,
      }),
      veiculos: this.formBuilder.group({
        placa: [null, Validators.required],
        descricao: [null, Validators.required]
      }),
      arquivos: this.formBuilder.array([]),
    });

    if (this.editar) {
      this.router.params.subscribe(params => {
        this.informacaoService.getById(params.id).subscribe({
          next: (v) => {
          
            this.linhasTextArea = Math.round(v.detalhe.length/150);
            this.linhasTextArea = this.linhasTextArea + 2;

            this.informacaoDto = v;
            this.formulario.patchValue({
              id: v.id,
              titulo: v.titulo,
              detalhe: v.detalhe,
            });

            if (v.informePessoas) {
              v.informePessoas.forEach(element => {
                this.pessoasLista.push(element.pessoa);
              });

              this.informacaoPessoaLista = v.informePessoas;
              this.dataSource = new MatTableDataSource<InformacaoPessoa>(this.informacaoPessoaLista);
              this.dataSource.paginator = this.paginatorPessoas;
              this.dataSource.paginator._intl.itemsPerPageLabel = 'Exibir';
            }
            if (v.veiculos) {
              this.veiculosLista = v.veiculos;
              this.dataSourceVeiculo = new MatTableDataSource<Veiculo>(this.veiculosLista);
              this.dataSourceVeiculo.paginator = this.paginatorVeiculos;
              this.dataSourceVeiculo.paginator._intl.itemsPerPageLabel = 'Exibir';
            }

            if (v.marcadores) {
              this.enderecosLista = v.marcadores;
              this.dataSourceEnderecos = new MatTableDataSource<MarcadorMaps>(this.enderecosLista);
              this.dataSourceEnderecos.paginator = this.paginatorEnderecos;
              this.dataSourceEnderecos.paginator._intl.itemsPerPageLabel = 'Exibir';
              this.editarExisteMarcador = true;
              this.formulario.patchValue({
                endereco: v.marcadores[v.marcadores.length - 1].endereco?.descricao,
                regiao: v.marcadores[v.marcadores.length - 1].endereco?.regiao
              });

              //causando problemas no mapa..
              this.atualizarMarker(this.informacaoDto.marcadores[v.marcadores.length - 1].latitude, this.informacaoDto.marcadores[v.marcadores.length - 1].longitude, 17, false);
            }




            if (this.informacaoDto.arquivos && this.informacaoDto.arquivos.length > 0) {


              this.informacaoDto.arquivos.forEach(element => {
                var imagem = element;

                let objectURL = 'data:image/jpeg;base64,' + imagem.arquivo;
                let arquivoImg = new Arquivo();

                if (this.imageCompress.byteCount(objectURL) > 245329) {
                  this.imageCompress //faz o compressão da imagem.
                    .compressFile(objectURL, 0, 50, 50) // 50% ratio, 50% quality
                    .then(
                      (compressedImage) => {
                        arquivoImg.url = compressedImage;
                        /*console.log("Foto convertida: " + imagem.descricao);
                        console.log("Antes: " + this.imageCompress.byteCount(objectURL));
                        console.log("Depois: " + this.imageCompress.byteCount(compressedImage));*/
                        this.arquivosImagensLazy.push(compressedImage);
                      }
                    );
                } else {
                  arquivoImg.url = objectURL;
                }


                arquivoImg.id = imagem.id;
                arquivoImg.descricao = imagem.descricao;
                arquivoImg.titulo = imagem.titulo;
                //arquivoImg.url = this.sanitizer.bypassSecurityTrustUrl(objectURL);

                this.arquivosImagens.push(arquivoImg);


              });

            }


          },

          error: (e) => {
            NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar a informação. ', 4)
          },
          complete: () => { /* console.log("completou o by id?") 
          console.log("Duração... ");
          let elapsed = new Date().getTime() - start;
          console.log(elapsed); */
          }
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

    this.pessoasLista.forEach(element => {
      let pessoaDTO: Pessoa = element
      if (element.id) {
        pessoaDTO.id = element.id;
      }

      pessoaDTO.dataAlteracao = new Date();
      pessoaDTO.dataInclusao = new Date();
      pessoasList.push(pessoaDTO);
    });

    this.veiculosLista.forEach(element => {
      let veiculoDTO: Veiculo = element;
      if (element.id) {
        veiculoDTO.id = element.id;
      }
      veiculoDTO.dataAlteracao = new Date();
      veiculoDTO.dataInclusao = new Date();
      VeiculoList.push(veiculoDTO);
    });



    this.informacaoDto.pessoas = pessoasList;
    this.informacaoDto.informePessoas = this.informacaoPessoaLista;
    this.informacaoDto.veiculos = VeiculoList;
    this.informacaoDto.dataAlteracao = new Date();
    this.informacaoDto.dataInclusao = new Date();


    this.informacaoDto.marcadores = this.enderecosLista;

    this.informacaoDto.titulo = this.formulario.get("titulo").value;
    this.informacaoDto.detalhe = this.formulario.get("detalhe").value;


    //salvar arquivos...
    if (this.arquivos.length > 0) {


      for (let index = 0; index < this.arquivos.length; index++) {
        const element = this.arquivos.value[index].tipoFileDto;

        this.formData.append('image[' + index + ']', element.inteiro);

        if (this.arquivos.value[index].arquivoTitulo) {
          this.formData.append('image[' + index + ']', this.arquivos.value[index].arquivoTitulo);
        }
        this.formData.append('image[' + index + ']', element.inteiro);
        if (element.comprimido) {
          this.formData.append('image[' + index + ']', element.comprimido);
        }
      }

    }

    //salvar a informacao
    this.processarSalvamento();

  }

  processarSalvamento() {
    this.informacaoService.save(this.informacaoDto, this.editar).subscribe({
      next: (v) => {

        if (this.arquivos.length > 0) {

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

  exibirMarcacaoNoMpapa(element: MarcadorMaps) {
    this.atualizarMarker(element.latitude, element.longitude, 12, true);
  }

  salvarMarcacao() {
    let textoMarcacao = "";
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '40%',
      data: {
        esconder: true,
        titulo: 'Deseja realmente cancelar a operação?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log();
        let dtoEndereco: Endereco = new Endereco();
        let dtoMarcador: MarcadorMaps = new MarcadorMaps();

        if (this.lat !== 0 && this.lat !== null && this.lat !== undefined) {

          dtoMarcador.latitude = this.lat;
          dtoMarcador.longitude = this.lng;
          dtoMarcador.open = 'true';
          dtoMarcador.tipo = 'informacao';
          dtoMarcador.tipoIcone = "'http://maps.google.com/mapfiles/kml/pal4/icon49.png'";

          dtoEndereco.descricao = this.formulario.get("endereco").value;
          dtoEndereco.regiao = this.formulario.get("regiao").value;
          dtoEndereco.observacao = result;
          dtoMarcador.endereco = dtoEndereco;

          this.enderecosLista.push(dtoMarcador);
          this.dataSourceEnderecos = new MatTableDataSource<MarcadorMaps>(this.enderecosLista);
          this.dataSourceEnderecos.paginator = this.paginatorEnderecos;
          this.dataSourceEnderecos.paginator._intl.itemsPerPageLabel = 'Exibir';

        }
      }
    });




  }

  removerEndereco(element: MarcadorMaps, idx: number) {
    const confirmAction = confirm('Gostaria de deletar este endereço?');
    let ok: boolean = false;

    if (confirmAction) {

      ok = true;

      if (element.id) {
        this.marcadorService.delete(element.id).subscribe((res) => {
          NotificationUtil.showNotification('top', 'right', 'Endereço deletado com sucesso.', 2);
        }),
          (erro) => {
            ok = false;
            NotificationUtil.showNotification('top', 'right', 'Falha ao deletar o endereço', 4);
          }
      }
      console.log(ok);

      if (ok === true) {
        this.enderecosLista.splice(idx, 1);
        this.dataSourceEnderecos = new MatTableDataSource<MarcadorMaps>(this.enderecosLista);
        this.dataSourceEnderecos.paginator = this.paginatorEnderecos;
        this.dataSourceEnderecos.paginator._intl.itemsPerPageLabel = 'Exibir';
      }
    }
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

  editarImagem(arquivo: Arquivo, i: number) {


    let textoMarcacao = "";
    const dialogRef = this.dialog.open(DialogoEditarTituloImagemComponent, {
      width: '40%',
      data: {
        inputText: arquivo.titulo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        arquivo.titulo = result;
        this.arquivoService.save(arquivo, true).subscribe({
          next: (res) => {
            NotificationUtil.showNotification('top', 'right', 'Informação alterada.', 2);
            document.getElementById("arquivoTitulo" + i).innerText = result;

            this.arquivosImagens[i] = arquivo;
            this.informacaoDto.arquivos[i].titulo = result;
          },
          error: (error) => {
            NotificationUtil.showNotification('top', 'right', 'Falha ao alterar o titulo da imagem ' + error, 4);
          }

        })



      }
    });

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

          }, erro => {
            console.log(erro);
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

      let arrayArquivo: any = this.arquivos.value;

      const find = arrayArquivo.find(x => x.tipoFileDto.inteiro.name === element.name);

      let incluirArquivo: TipoFileDTO = {
        inteiro: element,
        comprimido: null,
        url: null,
      };


      if (!find) {

        this.addArquivo(incluirArquivo);
      }
    }

    if (this.arquivos.length > 0) {
      let arrayForm: any[] = [];
      arrayForm = this.arquivos.value;

      for (let index = 0; index < this.arquivos.length; index++) {

        let reader = new FileReader();
        reader.onload = (e: any) => { //seleciona a imagem que está sendo carregada

          this.arquivos.value[index].tipoFileDto.url = e.target.result;
          if (this.arquivos.value[index].tipoFileDto.size > 245329) { //faz o arquivo for maior que 1MB
            this.imageCompress //faz o compressão da imagem.
              .compressFile(e.target.result, 0, 50, 50) // 50% ratio, 50% quality
              .then(
                (compressedImage) => {
                  this.arquivos.value[index].tipoFileDto.comprimido = compressedImage;
                }
              );
          }
        }
        reader.readAsDataURL(this.arquivos.value[index].tipoFileDto.inteiro);
      }
    }

  }

  removerImagem(i: number) {
    if (this.arquivos.length > 0) {
      this.arquivos.removeAt(i);
    }
  }

  removerImagemDeletadaBanck(i: number) {
    if (this.arquivosImagens) {
      this.arquivosImagens.splice(i, 1);
      this.informacaoDto.arquivos.splice(i, 1);
    }
  }

  adicionarPessoa() {

    let informacaoPessoaDto: InformacaoPessoa = {
      id: null,
      pessoa: null,
      envolvimento: null,
    }

    if (this.formulario.get("pessoas").get("nome").valid) {

      let novaPessoa = this.formulario.get("pessoas").value as Pessoa;
      if (this.idPessoa) {
        novaPessoa.id = this.idPessoa;
      }

      informacaoPessoaDto.pessoa = novaPessoa;
      informacaoPessoaDto.envolvimento = this.formulario.get("pessoas").get("envolvimento").value;

      this.informacaoPessoaLista.push(informacaoPessoaDto);
      this.pessoasLista.push(novaPessoa);
      this.dataSource = new MatTableDataSource<InformacaoPessoa>(this.informacaoPessoaLista);
      this.dataSource.paginator = this.paginatorPessoas;
      this.dataSource.paginator._intl.itemsPerPageLabel = 'Exibir';
      this.formulario.get("pessoas").reset();
      this.idPessoa = null;
    } else {
      NotificationUtil.showNotification('top', 'right', 'O nome da pessoa é obrigatório', 4);
    }

  }

  removerPessoa(pessoa: Pessoa, idx: number) {
    this.pessoasRemovidas.push(pessoa.id);
    this.informacaoDto.pessoasRemovidas = this.pessoasRemovidas;

    this.pessoasLista.splice(idx, 1);
    this.informacaoPessoaLista.splice(idx, 1);
    this.dataSource = new MatTableDataSource<InformacaoPessoa>(this.informacaoPessoaLista);
    this.dataSource.paginator = this.paginatorPessoas;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Exibir';

    this.idPessoa = null;


  }

  adicionarVeiculo() {
    if (this.formulario.get("veiculos").get("placa").valid ||
      this.formulario.get("veiculos").get("descricao").valid) {

      let novoVeiculo = this.formulario.get("veiculos").value as Veiculo;
      this.veiculosLista.push(novoVeiculo);
      this.dataSourceVeiculo = new MatTableDataSource<Veiculo>(this.veiculosLista);
      this.dataSourceVeiculo.paginator = this.paginatorVeiculos;
      this.dataSourceVeiculo.paginator._intl.itemsPerPageLabel = 'Exibir';
      this.formulario.get("veiculos").reset();
    } else {
      NotificationUtil.showNotification('top', 'right', 'Pelo menos um campo deve ser preenchido.', 4);
    }

  }

  removerVeiculo(veiculo: Veiculo, idx: number) {
    this.veiculosRemovidos.push(veiculo.id);
    this.informacaoDto.veiculosRemovido = this.veiculosRemovidos;

    this.veiculosLista.splice(idx, 1);
    this.dataSourceVeiculo = new MatTableDataSource<Veiculo>(this.veiculosLista);
    this.dataSourceVeiculo.paginator = this.paginatorPessoas;
    this.dataSourceVeiculo.paginator._intl.itemsPerPageLabel = 'Exibir';
  }


  //criar campo de imagens com titulos dinamicos
  criarArquivoFormGroup(file: TipoFileDTO): FormGroup {
    return this.formBuilder.group({
      arquivoTitulo: [null],
      tipoFileDto: [file],
    })
  }

  addArquivo(file: TipoFileDTO) {
    this.arquivos.push(this.criarArquivoFormGroup(file));
  }

  get arquivos(): FormArray {
    return <FormArray>this.formulario.get('arquivos');
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => {this.autosize.resizeToFitContent(true)
    });

  }

}
