import { ArquivoPessoa, InformacaoPessoa } from './../../models/models.dto';
import { PessoaService } from './../../services/pessoa.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pessoa } from 'app/models/models.dto';
import { NotificationUtil } from 'app/util/NotificationUtil';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-consultar-pessoas',
  templateUrl: './consultar-pessoas.component.html',
  styleUrls: ['./consultar-pessoas.component.scss']
})
export class ConsultarPessoasComponent implements OnInit {

  displayedColumns: string[] = ['foto', 'Nome', 'Apelido', 'CPF', 'Pai', 'Mãe', 'Link Genesis', 'Ações'];
  dataSource: MatTableDataSource<Pessoa> = new MatTableDataSource<Pessoa>();
  listPessoa: Pessoa[] = [];



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  palavraPesquisada: string = "";

  constructor(private router: Router,
    private pessoaService: PessoaService,
    private imageCompress: NgxImageCompressService,) { }

  ngOnInit(): void {
    this.carregarInformacoes();
  }

  public doFilter = (value: string) => {
    this.palavraPesquisada = value;
    localStorage.setItem('pesquisaPessoa', this.palavraPesquisada);
    this.dataSource.filter = this.palavraPesquisada;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Exibir';
  }


  public editar(element: Pessoa) {
    this.router.navigate(['pessoa/editar/', element.id]);
  }

  public deletar(element: Pessoa) {
    const confirmAction = confirm('Gostaria de deletar esta informação?');
    if (confirmAction) {

      this.pessoaService.delete(element.id).subscribe({
        next: (v) => {
          NotificationUtil.showNotification('top', 'right', 'Pessoa deletada com sucesso.', 2);
          this.removerElementoDoArray(element.id, this.listPessoa);
          this.dataSource = new MatTableDataSource<Pessoa>(this.listPessoa);
          this.dataSource.paginator = this.paginator;
          this.dataSource.paginator._intl.itemsPerPageLabel = 'Exibir';
        },
        error: (e) => {
          NotificationUtil.showNotification('top', 'right', 'Falha ao deletar a pessoa. ' + e.message, 4);
        },
        complete: () => { }
      })

    }

  }

  removerElementoDoArray(id: number, lista: any[]) {
    const elemento = lista.find(obj => obj.id === id);
    const index = lista.indexOf(elemento);
    lista.splice(index, 1);
  }

  processarImagens(pessoaLista: Pessoa[]) {

    pessoaLista.forEach(elementPessoa => {

      if (elementPessoa.arquivos && elementPessoa.arquivos.length > 0) {
        //ordernar
        elementPessoa.arquivos = elementPessoa.arquivos.sort((n2, n1) => { if (n1.id > n2.id) { return 1; } if (n1.id < n2.id) { return -1; } return 0; })
       

        var imagem = elementPessoa.arquivos[0];
        let objectURL = 'data:image/jpeg;base64,' + imagem.arquivo;
        let arquivoImg = new ArquivoPessoa();
        //if (this.imageCompress.byteCount(objectURL) > 245329) {
          this.imageCompress //faz o compressão da imagem.
            .compressFile(objectURL, 0, 50, 50) // 50% ratio, 50% quality
            .then(
              (compressedImage) => {
                arquivoImg.url = compressedImage;
                /*console.log("Foto convertida: " + imagem.descricao);
                console.log("Antes: " + this.imageCompress.byteCount(objectURL));
                console.log("Depois: " + this.imageCompress.byteCount(compressedImage));*/
                //this.arquivosImagensLazy.push(compressedImage);
              }
            );
       /* } else {
          arquivoImg.url = objectURL;
        }*/


        arquivoImg.id = imagem.id;
        arquivoImg.descricao = imagem.descricao;
        arquivoImg.titulo = imagem.titulo;
        //arquivoImg.url = this.sanitizer.bypassSecurityTrustUrl(objectURL);

        elementPessoa.arquivos = [];
        elementPessoa.arquivos.push(arquivoImg);

      }

    });

  }

  carregarInformacoes() {

    this.pessoaService.getAll().subscribe({
      next: (v) => {
        this.listPessoa = v;
        this.processarImagens(this.listPessoa);

        this.dataSource = new MatTableDataSource<Pessoa>(this.listPessoa);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator._intl.itemsPerPageLabel = 'Exibir';
      },
      error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar as Pessoas. ', 4)
      },
      complete: () => { }
    })

  }

  abrirSistemaGenesis(element: Pessoa) {
    window.open(element.linkGenesis, "_blank");
  }
}
