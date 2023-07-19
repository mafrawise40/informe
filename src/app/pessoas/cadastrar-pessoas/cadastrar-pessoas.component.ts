import { ArquivoPessoaService } from './../../services/arquivo-pessoa.service';
import { ArquivoPessoa } from './../../models/models.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { PessoaService } from './../../services/pessoa.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InformacaoPessoa, Pessoa, TipoFileDTO } from 'app/models/models.dto';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NotificationUtil } from 'app/util/NotificationUtil';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DialogoEditarTituloImagemComponent } from 'app/dialogo/dialogo-editar-titulo-imagem/dialogo-editar-titulo-imagem.component';

@Component({
  selector: 'app-cadastrar-pessoas',
  templateUrl: './cadastrar-pessoas.component.html',
  styleUrls: ['./cadastrar-pessoas.component.scss']
})
export class CadastrarPessoasComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumnsVinculo: string[] = ['Foto', 'Nome', 'Apelido', 'Envolvimento'];
  dataSourceVinculo: MatTableDataSource<InformacaoPessoa> = new MatTableDataSource<InformacaoPessoa>();
  listVinculos: InformacaoPessoa[] = [];

  formulario: FormGroup;
  formData: FormData = new FormData();
  editar: boolean = this.redirect.url.includes('editar');
  pessoa: Pessoa
  arquivosImagens: ArquivoPessoa[] = []

  constructor(private formBuilder: FormBuilder,
    private imageCompress: NgxImageCompressService,
    private pessoaService: PessoaService,
    private arquivoPessoaService: ArquivoPessoaService,
    private redirect: Router,
    private router: ActivatedRoute,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.criarFormulario();
  }

  criarFormulario() {

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      apelido: null,
      pai: null,
      mae: null,
      cpf: null,
      arquivos: this.formBuilder.array([]),
      detalhe: null,
      linkGenesis: null,
      nascimento: null,
    });

    if (this.editar) {
      this.router.params.subscribe(params => {
        this.pessoaService.getById(params.id).subscribe({
          next: (v) => {
            this.pessoa = v;
            this.formulario.patchValue({
              nome: v.nome,
              apelido: v.apelido,
              pai: v.pai,
              mae: v.mae,
              cpf: v.cpf,
              detalhe: v.detalhe,
              linkGenesis: v.linkGenesis,
              nascimento: v.nascimento,
            });

            //carregando vinculos
            this.pessoaService.getVinculosPessoa(this.pessoa.id).subscribe({
              next: (vinculos) => {
                if (vinculos !== null && vinculos !== undefined) {
                  this.listVinculos = vinculos;
                  this.listVinculos.splice(this.listVinculos.findIndex(vinculo => vinculo.pessoa.id === this.pessoa.id), 1);
                  this.dataSourceVinculo = new MatTableDataSource<InformacaoPessoa>(this.listVinculos);
                  this.dataSourceVinculo.paginator = this.paginator;
                  this.dataSourceVinculo.paginator._intl.itemsPerPageLabel = 'Exibir';
                }
              }, error: (e) => {
                NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar a informação. ', 4)
              },
              complete: () => {
              }
            });


            //carregando imagens
            if (this.pessoa.arquivos && this.pessoa.arquivos.length > 0) {


              this.pessoa.arquivos.forEach(element => {
                var imagem = element;

                let objectURL = 'data:image/jpeg;base64,' + imagem.arquivo;
                let arquivoImg = new ArquivoPessoa();

                /*if (this.imageCompress.byteCount(objectURL) > 245329) {
                  this.imageCompress //faz o compressão da imagem.
                    .compressFile(objectURL, 0, 50, 50) // 50% ratio, 50% quality
                    .then(
                      (compressedImage) => {
                        arquivoImg.url = compressedImage;
                        /*console.log("Foto convertida: " + imagem.descricao);
                        console.log("Antes: " + this.imageCompress.byteCount(objectURL));
                        console.log("Depois: " + this.imageCompress.byteCount(compressedImage));*/
                //this.arquivosImagensLazy.push(compressedImage);
                /*  }
                );
            } else {
              arquivoImg.url = objectURL;
            }*/

                arquivoImg.url = objectURL;
                arquivoImg.id = imagem.id;
                arquivoImg.descricao = imagem.descricao;
                arquivoImg.titulo = imagem.titulo;
                //arquivoImg.url = this.sanitizer.bypassSecurityTrustUrl(objectURL);

                this.arquivosImagens.push(arquivoImg);


              });

            }

          }
          , error: (e) => {
            NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar a informação. ', 4)
          },
          complete: () => {
          }
        });
      });
    }


  }


  salvar() {

    let dtoPessoa: Pessoa = this.formulario.value as Pessoa;

    if (this.formulario.valid) { //se o formulário for válido

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


      if (this.editar) {
        let idPessoa = this.pessoa.id;
        this.pessoa = this.formulario.value as Pessoa;
        this.pessoa.id = idPessoa;
        this.processarSalvamento(dtoPessoa, true);
      } else {

        //salvar arquivos...


        this.processarSalvamento(dtoPessoa, false);
      }

    } else {
      NotificationUtil.showNotification('top', 'right', 'Campos obrigatórios não preenchidos.', 4)

    }


  }

  processarSalvamento(dto: Pessoa, isEditar: boolean) {

 
   this.pessoaService.save(dto, isEditar).subscribe({
      next: (v) => {

        if (this.arquivos.length > 0) {

          this.processarUpload(v);
        }

        NotificationUtil.showNotification('top', 'right', 'Pessoa salva com sucesso.', 2)
        this.redirect.navigate(['pessoa/consultar']);
      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar salvar pessoa. ', 4)
        NotificationUtil.showNotification('top', 'right', e, 4)
      },
      complete: () => { }
    });
  }

  processarUpload(pessoa: Pessoa) {
    this.pessoaService.uploadImagens(this.formData, pessoa.id).subscribe({
      next: (v) => {
      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar salvar arquivo ', 4)
      }
    });
  }



  removerImagem(i: number) {
    if (this.arquivos.length > 0) {
      this.arquivos.removeAt(i);
    }
  }

  /*removerImagemDeletadaBanck(i: number) {
    if (this.arquivosImagens) {
      this.arquivosImagens.splice(i, 1);
      this.informacaoDto.arquivos.splice(i, 1);
    }
  }*/

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


  deletarImagem(arquivo: ArquivoPessoa, i: number) {
    const confirmAction = confirm('Gostaria de deletar esta imagem?');
    if (confirmAction) {

      this.pessoaService.deleteImagem(this.pessoa.id, arquivo.id).subscribe({
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

  editarImagem(arquivo: ArquivoPessoa, i: number) {


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
        this.arquivoPessoaService.save(arquivo, true).subscribe({
          next: (res) => {
            NotificationUtil.showNotification('top', 'right', 'Informação alterada.', 2);
            document.getElementById("arquivoTitulo" + i).innerText = result;

            this.arquivosImagens[i] = arquivo;
            this.pessoa.arquivos[i].titulo = result;
          },
          error: (error) => {
            NotificationUtil.showNotification('top', 'right', 'Falha ao alterar o titulo da imagem ' + error, 4);
          }

        })



      }
    });

  }


  removerImagemDeletadaBanck(i: number) {
    if (this.arquivosImagens) {
      this.arquivosImagens.splice(i, 1);
      this.pessoa.arquivos.splice(i, 1);
    }
  }

}
