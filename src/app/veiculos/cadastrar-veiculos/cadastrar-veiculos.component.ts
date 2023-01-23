import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Arquivo, InformacaoPessoa, TipoFileDTO, Veiculo } from 'app/models/models.dto';
import { VeiculoService } from 'app/services/veiculo.service';
import { NotificationUtil } from 'app/util/NotificationUtil';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-cadastrar-veiculos',
  templateUrl: './cadastrar-veiculos.component.html',
  styleUrls: ['./cadastrar-veiculos.component.scss']
})
export class CadastrarVeiculosComponent implements OnInit {

  arquivosImagens: Arquivo[] = [];
  displayedColumnsVinculo: string[] = ['Foto', 'Nome', 'Apelido', 'Envolvimento'];
  dataSourceVinculo: MatTableDataSource<InformacaoPessoa> = new MatTableDataSource<InformacaoPessoa>();
  listVinculos: InformacaoPessoa[] = [];


  formulario: FormGroup;
  formData: FormData = new FormData();
  veiculo: Veiculo;

  editar: boolean = this.redirect.url.includes('editar');

  constructor(private formBuilder: FormBuilder,
    private veiculoService: VeiculoService,
    private redirect: Router,
    private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.carregarFormulario()
  }

  carregarFormulario() {



    this.formulario = this.formBuilder.group({
      id: null,
      placa: [null, Validators.required],
      descricao: null,
      arquivos: this.formBuilder.array([]),
      proprietario: null,
      endereco: null,
      informacoes: null,
      caraterGeral: null,
      desfechoCaraterGeral: null,
    });

    if ( this.editar) {
      
      this.router.params.subscribe(params => {
        this.veiculoService.getById(params.id).subscribe({
          next: (v) => {
            
            this.veiculo = v;
            console.log(this.veiculo)
            this.formulario.patchValue({
              id: v.id,
              placa: v.placa,
              descricao: v.descricao,
              proprietario: v.proprietario,
              endereco: v.endereco,
              informacoes: v.informacoes,
              caraterGeral: v.caraterGeral,
              desfechoCaraterGeral: v.desfechoCaraterGeral,
            });


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

    let dto = this.formulario.value as Veiculo;
    console.log(dto)
    this.veiculoService.save(dto, this.editar).subscribe({
      next: (v) => {

        if (this.arquivos.length > 0) {

         // this.processarUpload(v);
        }

        NotificationUtil.showNotification('top', 'right', 'Veículo salvo com sucesso.', 2)
        this.redirect.navigate(['veiculo/consultar']);
      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar salvar o veículo. ', 4)
        NotificationUtil.showNotification('top', 'right', e, 4)
      },
      complete: () => { }
    });

  }

  detectFiles($event) {


    
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

}

 
