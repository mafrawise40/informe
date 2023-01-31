import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Arquivo, FiltroPainelDTO, Informacao, RelatorioInformacaoDTO } from 'app/models/models.dto';
import { InformacaoService } from 'app/services/informacao.service';
import { FileUtil } from 'app/util/FileUtil';
import { NotificationUtil } from 'app/util/NotificationUtil';

@Component({
  selector: 'app-relatorio-informacao',
  templateUrl: './relatorio-informacao.component.html',
  styleUrls: ['./relatorio-informacao.component.scss']
})
export class RelatorioInformacaoComponent implements OnInit, AfterViewInit {


  formulario: FormGroup;

  @ViewChild(MatPaginator) paginator02: MatPaginator;
  @ViewChild(MatPaginator) paginator03: MatPaginator;
  @ViewChild(MatPaginator) paginator04: MatPaginator;
  @ViewChild(MatPaginator) paginator05: MatPaginator;
  @ViewChild(MatPaginator) paginator06: MatPaginator;

  @ViewChild(MatSort) sort02: MatSort;
  @ViewChild(MatSort) sort03: MatSort;
  @ViewChild(MatSort) sort04: MatSort;
  @ViewChild(MatSort) sort05: MatSort;

  dataSourceInformacao02: MatTableDataSource<Informacao> = new MatTableDataSource<Informacao>();
  informacoes02: Informacao[] = [];


  initialSelection = [];
  allowMultiSelect = true;

  selection02: SelectionModel<Informacao> = new SelectionModel<Informacao>(this.allowMultiSelect, this.initialSelection);
  selection03: SelectionModel<Informacao> = new SelectionModel<Informacao>(this.allowMultiSelect, this.initialSelection);
  selection04: SelectionModel<Informacao> = new SelectionModel<Informacao>(this.allowMultiSelect, this.initialSelection);
  selection05: SelectionModel<Informacao> = new SelectionModel<Informacao>(this.allowMultiSelect, this.initialSelection);
  selection06: SelectionModel<Informacao> = new SelectionModel<Informacao>(this.allowMultiSelect, this.initialSelection);

  displayedColumns02: string[] = ['select', 'numero', 'informacao', 'opcoes'];
  displayedColumns03: string[] = this.displayedColumns02;
  displayedColumns04: string[] = this.displayedColumns02;
  displayedColumns05: string[] = this.displayedColumns02;
  displayedColumns06: string[] = this.displayedColumns02;


  dataSourceInformacao03: MatTableDataSource<Informacao> = new MatTableDataSource<Informacao>();
  dataSourceInformacao04: MatTableDataSource<Informacao> = new MatTableDataSource<Informacao>();
  dataSourceInformacao05: MatTableDataSource<Informacao> = new MatTableDataSource<Informacao>();
  dataSourceInformacao06: MatTableDataSource<Informacao> = new MatTableDataSource<Informacao>();


  tabelasInit: boolean = true;
  tabela02: boolean = this.tabelasInit;
  tabela03: boolean = this.tabelasInit;
  tabela04: boolean = this.tabelasInit;
  tabela05: boolean = this.tabelasInit;
  tabela06: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private informacaoService: InformacaoService) {

  }

  ngOnInit(): void {
    this.criarFormulario();

  }

  ngAfterViewInit(): void {

    this.carregarInformacao();


  }

  criarFormulario() {
    this.formulario = this.formBuilder.group({
      data: new Date().toISOString(),
      //informacao: null,
      upm: null,
      horario: null,
      viatura: null,
      odometroInicial: null,
      odometroFinal: null,
      ordemServico: null,
      assuncao: null,
      agentes: null,
      termino: null,
      pesquisaInformacao02: null,
    });

    let dto: RelatorioInformacaoDTO = this.formulario.value as RelatorioInformacaoDTO;
    this.formulario.patchValue({
      assuncao: this.getTextAssuncao(dto),
      termino: this.getTextTermino()
    })

  }


  carregarInformacao() {

    let hoje = new Date();

    let filtro: FiltroPainelDTO = {
      campoPesquisa: "",
      dataInicial: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 10),
      dataFinal: hoje,
      dataAlteracao: null,
      dataInclusao: null
    }

    this.informacaoService.getInformacaoRelatorio(filtro).subscribe({
      next: (v) => {

        this.informacoes02 = v;

        this.dataSourceInformacao02 = new MatTableDataSource<Informacao>(this.informacoes02);
        this.dataSourceInformacao02.paginator = this.paginator02;

        this.dataSourceInformacao03 = new MatTableDataSource<Informacao>(this.informacoes02);
        this.dataSourceInformacao03.paginator = this.paginator03;

        this.dataSourceInformacao04 = new MatTableDataSource<Informacao>(this.informacoes02);
        this.dataSourceInformacao04.paginator = this.paginator04;

        this.dataSourceInformacao05 = new MatTableDataSource<Informacao>(this.informacoes02);
        this.dataSourceInformacao05.paginator = this.paginator05;

        this.dataSourceInformacao05 = new MatTableDataSource<Informacao>(this.informacoes02);
        this.dataSourceInformacao05.paginator = this.paginator05;


        this.dataSourceInformacao06 = new MatTableDataSource<Informacao>(this.informacoes02);
        this.dataSourceInformacao06.paginator = this.paginator06;

        this.tabela02 = false;
        this.tabela03 = false;
        this.tabela04 = false;
        this.tabela05 = false;
        this.tabela06 = false;

      }
      , error: (e) => {
        NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar a informação. ', 4)
      },
      complete: () => {
      }
    });
  }

  atualizarAssuncao(event) {
    let dto: RelatorioInformacaoDTO = this.formulario.value as RelatorioInformacaoDTO;
    console.log(dto);
    this.formulario.patchValue({
      assuncao: this.getTextAssuncao(dto)
    })
  }



  habilitarDesabilitarTabela(numeroTabela: number, event) {

    if (numeroTabela == 2) {
      if (event.target.checked) {
        this.tabela02 = true;


      } else {
        this.tabela02 = false;
      }
    }

    if (numeroTabela == 3) {
      if (event.target.checked) {
        this.tabela03 = true;

      } else {
        this.tabela03 = false;
      }
    }

    if (numeroTabela == 4) {
      if (event.target.checked) {
        this.tabela04 = true;


      } else {
        this.tabela04 = false;
      }
    }

    if (numeroTabela == 5) {
      if (event.target.checked) {
        this.tabela05 = true;

      } else {
        this.tabela05 = false;
      }
    }

    if (numeroTabela == 6) {
      if (event.target.checked) {
        this.tabela06 = true;
      } else {
        this.tabela06 = false;
      }
    }

  }



  pesquisarInformacao(numeroTabela: number) {
    let campoPesquisar = this.formulario.get("pesquisaInformacao02");
    console.log(campoPesquisar.value);
    if (campoPesquisar.value !== null && campoPesquisar.value !== undefined && campoPesquisar.value != "") {
      let filtro: FiltroPainelDTO = {
        campoPesquisa: campoPesquisar.value,
        dataInicial: null,
        dataFinal: null,
        dataAlteracao: null,
        dataInclusao: null
      }
      this.informacaoService.getByParametros(filtro).subscribe({
        next: (v) => {

          this.informacoes02 = v;

          if (numeroTabela === 2) {
            this.dataSourceInformacao02 = new MatTableDataSource<Informacao>(this.informacoes02);
          }

          if (numeroTabela === 3) {
            this.dataSourceInformacao03 = new MatTableDataSource<Informacao>(this.informacoes02);
          }

          if (numeroTabela === 4) {
            this.dataSourceInformacao04 = new MatTableDataSource<Informacao>(this.informacoes02);
          }

          if (numeroTabela === 5) {
            this.dataSourceInformacao05 = new MatTableDataSource<Informacao>(this.informacoes02);
          }

          if (numeroTabela === 6) {
            this.dataSourceInformacao06 = new MatTableDataSource<Informacao>(this.informacoes02);
          }





        }
        , error: (e) => {
          NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar a informação. ', 4)
        },
        complete: () => {
        }
      });
    }
  }

  /** SELECT BOX NA TABELA */


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(qualRelatorio: number) {

    let numSelected;
    let numRows;

    if (qualRelatorio == 2) {
      numSelected = this.selection02.selected.length;
      numRows = this.dataSourceInformacao02.data.length;
    }

    if (qualRelatorio == 3) {
      numSelected = this.selection03.selected.length;
      numRows = this.dataSourceInformacao03.data.length;
    }

    if (qualRelatorio == 4) {
      numSelected = this.selection04.selected.length;
      numRows = this.dataSourceInformacao04.data.length;
    }

    if (qualRelatorio == 5) {
      numSelected = this.selection05.selected.length;
      numRows = this.dataSourceInformacao05.data.length;
    }

    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(qualRelatorio: number) {
    if (qualRelatorio == 2) {
      this.isAllSelected(qualRelatorio) ?
        this.selection02.clear() :
        this.dataSourceInformacao02.data.forEach(row => this.selection02.select(row));
    }
    if (qualRelatorio == 3) {
      this.isAllSelected(qualRelatorio) ?
        this.selection03.clear() :
        this.dataSourceInformacao03.data.forEach(row => this.selection03.select(row));
    }
    if (qualRelatorio == 4) {
      this.isAllSelected(qualRelatorio) ?
        this.selection04.clear() :
        this.dataSourceInformacao04.data.forEach(row => this.selection04.select(row));
    }
    if (qualRelatorio == 5) {
      this.isAllSelected(qualRelatorio) ?
        this.selection05.clear() :
        this.dataSourceInformacao05.data.forEach(row => this.selection05.select(row));
    }

  }


  /**FIM SELECT BOX NA TABELA */


  // **********************  GERAÇÃO PDF ********************************

  gerar() {

    console.log(this.selection02.selected);
    console.log(this.selection03.selected);


    let dto: RelatorioInformacaoDTO = this.formulario.value as RelatorioInformacaoDTO;
    let informacao: Informacao;

    console.log(dto);
    this.criarRelatorio(dto, informacao, this.selection02.selected, this.selection03.selected, this.selection04.selected, this.selection05.selected, this.selection06.selected);
    /*
        this.selection03.selected.forEach(info => {
          this.informacaoService.getById(info.id).subscribe({
            next: (v) => {
    
              informacao = v;
    
              this.criarRelatorio(dto, informacao);
    
    
            }
            , error: (e) => {
              NotificationUtil.showNotification('top', 'right', 'Erro ao tentar consultar a informação. ', 4)
            },
            complete: () => {
            }
          });
        })*/
  }

  criarRelatorio(dto: RelatorioInformacaoDTO, informacaoDTO: Informacao, lista02: Informacao[], lista03: Informacao[], lista04: Informacao[], lista05: Informacao[], lista06: Informacao[]) {

    //console.log(informacaoDTO);

    let relatorio = {
      //pageOrientation: 'landscape',
      pageMargins: [40, 55, 40, 60],
      pageSize: 'A4',
      header: FileUtil.getPdfHeader,
      /* footer: (currentPage: number, pageCount: number) => {
         return FileUtil.getPdfFooter(currentPage, pageCount, "usuario logado");
       },*/
      content: [
        { text: '\n', fontSize: 10 },
        { text: FileUtil.TITLE_HEADER_PDF, style: 'header' },
        { text: '\n', fontSize: 8 },
        { text: 'RELATÓRIO DE SERVIÇO ORDINÁRIO VELADO', style: 'subheader1' },

        { text: '\n' },
        this.buildTableheader(dto, informacaoDTO),
        { text: '\n' },
        this.buildContentBody(dto, informacaoDTO, lista02, lista03, lista04, lista05, lista06),
        { text: '\n' },
        { text: FileUtil.FOOT_TEXT_PDF, style: 'textFoot' },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: false,
          alignment: 'center'
        },
        subheader1: {
          fontSize: 14,
          bold: true,
          alignment: 'center'
        },
        subheader2: {
          fontSize: 14,
          bold: true,
          alignment: 'center'
        },
        footer: {
          fontSize: 8,
          bold: false,
          italic: true,
          alignment: 'center'
        },
        tableHeaderFilter: {
          color: 'black',
          bold: true,
        },
        tableHeaderContent: {
          color: 'black',
          bold: false,
          alignment: 'center'
        },
        tableBodyAssuncaoContent: {
          color: 'black',
          bold: false,
          alignment: 'justify',
          fontSize: 10,
        },
        tableBodyTextSemAlteracao: {
          color: 'black',
          bold: false,
          alignment: 'center',
          fontSize: 10,
        },
        tableBodyOcorrenciaApoiada: {
          color: 'black',
          bold: false,
          alignment: 'justify',
          fontSize: 10,
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black'
        },
        tableContent: {
          bold: false,
          fontSize: 9,
          color: 'black'
        },
        resultContent: {
          color: 'blue',
          fontSize: 11,
        },
        textFoot: {
          bold: false,
          fontSize: 8,
          color: 'black',
          alignment: 'center',
        }
      },
      defaultStyle: {

      }
    }

    let pdfMake = require('pdfmake/build/pdfmake.js');
    let pdfFonts = require('pdfmake/build/vfs_fonts.js');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const pdfDocGenerator = pdfMake.createPdf(relatorio);

    pdfDocGenerator.download("relatorio_inteligicia_" + Date.now() + ".pdf");

  }

  buildTableheader(dto: RelatorioInformacaoDTO, informacaoDTO: Informacao) {
    let table: any = {
      headerRows: 0,
      widths: ['auto', '*'],
      body: [
        [{ text: 'DATA', style: 'tableHeaderFilter' }, { text: new Date(dto.data).getDate() + "/" + (new Date(dto.data).getMonth() + 1) + "/" + new Date(dto.data).getFullYear(), style: 'tableHeaderContent' }],
        [{ text: 'HORÁRIO', style: 'tableHeaderFilter' }, { text: dto.horario, style: 'tableHeaderContent' }],
        [{ text: 'AGENTES', style: 'tableHeaderFilter' }, { text: dto.agentes, style: 'tableHeaderContent' }],
        [{ text: 'UPM APOIADORA', style: 'tableHeaderFilter' }, { text: dto.upm + "º BPM", style: 'tableHeaderContent' }],
        

      ],
    },
      layout: {

      }

      if ( dto.viatura ){
        let textViatura : string = dto.viatura;
      
        if ( dto.odometroInicial){
          textViatura += "    | Odômetro Inicial: " + dto.odometroInicial;
        }
        if ( dto.odometroFinal) {
          textViatura += "    | Odômetro Final: " + dto.odometroFinal;
        }
        table.body.push([{ text: 'VIATURA', style: 'tableHeaderFilter' }, { text: textViatura, style: 'tableHeaderContent' }])
      }


    return { table }

  }

  buildContentBody(dto: RelatorioInformacaoDTO, informacaoDTO: Informacao, lista02: Informacao[], lista03: Informacao[], lista04: Informacao[], lista05: Informacao[], lista06: Informacao[]) {



    let table: any = {
      headerRows: 0,
      widths: ['*'],
      body: [
        [{ text: '1. ASSUNÇÃO DO SERVIÇO:', style: 'tableHeaderFilter' }],
        [{
          text: this.getTextAssuncao(dto), style: 'tableBodyAssuncaoContent'
        }],

      ],
    };

    table.body.push([{ text: '2. OCORRÊNCIAS CONDUZIDAS PELA EQUIPE DE INTELIGÊNCIA:', style: 'tableHeaderFilter' }]);
    if (lista02.length > 0) {
      lista02.forEach(info => {
          table.body.push([this.getGerarOcorrencia(dto, info)])
        if (info.arquivos !== null && info.arquivos !== undefined && info.arquivos.length > 0) {
          table.body.push([this.getImagens(dto, info)])
        }
        table.body.push(['\n'])
      });
    } else {
      table.body.push([this.getSemAlteracao()])
      table.body.push(['\n'])
    }


    table.body.push([{ text: '3. OCORRÊNCIAS APOIADAS PELA EQUIPE DE INTELIGÊNCIA:', style: 'tableHeaderFilter' }]);
    if (lista03.length > 0) {
      lista03.forEach(info => {
        table.body.push([this.getGerarOcorrencia(dto, info)])
        if (info.arquivos !== null && info.arquivos !== undefined && info.arquivos.length > 0) {
          table.body.push([this.getImagens(dto, info)])
        }
        table.body.push(['\n'])
      });
    } else {
      table.body.push([this.getSemAlteracao()])
      table.body.push(['\n'])
    }

    table.body.push([{ text: '4. OCORRÊNCIAS DE VULTO:', style: 'tableHeaderFilter' }]);
    if (lista04.length > 0) {
      lista04.forEach(info => {
        table.body.push([this.getGerarOcorrencia(dto, info)])
        if (info.arquivos !== null && info.arquivos !== undefined && info.arquivos.length > 0) {
          table.body.push([this.getImagens(dto, info)])
        }
        table.body.push(['\n'])
      });
    } else {
      table.body.push([this.getSemAlteracao()])
      table.body.push(['\n'])
    }

    table.body.push([{ text: '5. OCORRÊNCIAS ENVOLVENDO POLICIAIS MILITARES DA ATIVA, RESERVA/REFORMADOS OU DE OUTROS ESTADOS:', style: 'tableHeaderFilter' }]);
    if (lista05.length > 0) {
      lista05.forEach(info => {
        table.body.push([this.getGerarOcorrencia(dto, info)])
        if (info.arquivos !== null && info.arquivos !== undefined && info.arquivos.length > 0) {
          table.body.push([this.getImagens(dto, info)])
        }
        table.body.push(['\n'])
      });
    } else {
      table.body.push([this.getSemAlteracao()])
      table.body.push(['\n'])
    }



    table.body.push([{ text: '6. OBSERVAÇÕES GERAIS:', style: 'tableHeaderFilter' }])
    if (lista06.length > 0) {
      console.log(lista06);
      lista06.forEach(info => {
        table.body.push([this.getGerarOcorrencia(dto, info)])
        if (info.arquivos !== null && info.arquivos !== undefined && info.arquivos.length > 0) {
          table.body.push([this.getImagens(dto, info)])
        }
      });
    } else {
      table.body.push([this.getSemAlteracao()])
      table.body.push(['\n'])
    }



    table.body.push([{ text: '7. TÉRMINO DO SERVIÇO:', style: 'tableHeaderFilter' }])
    table.body.push([this.getTerminoServico(dto)])

    return { table }

  }

  getTextAssuncao(dto: RelatorioInformacaoDTO) {

    let numeroOperacionalUP: any = "X";

    if (dto.upm === undefined || dto.upm === null || isNaN(dto.upm)) {
      dto.upm = "XX";
    } else {
      numeroOperacionalUP = Number.parseInt(dto.upm) + 20;
    }

    if (dto.ordemServico === undefined || dto.ordemServico === null) {
      dto.ordemServico = "XXXXXXXXXXXXXXXXXXXX"
    }

    return `\n` +
      `  Esta equipe de Águia ${numeroOperacionalUP} entrou no ar na área de responsabilidade do ${dto.upm}o BPM, para realizar ` +
      `policiamento velado e apoiar os demais prefixos ostensivos, em cumprimento a Ordem de Serviço de ` +
      `número ${dto.ordemServico} (policiamento preventivo velado para coletar informações que subsidiem o ` +
      `policiamento ostensivo).
      \n`;

  }

  getTextTermino() {
    return `\n` +
      `  Foi dado término de serviço no horário regulamentado às 03h00min e sem alterações. `;
  }


  /*TODO: SINALIZAR A INFORMAÇÃO QUE FOI CONDUZIA PELO ÁGUIA  */
  getOcorrenciaConduzidaEquipe(dto: RelatorioInformacaoDTO, informacaoDTO: Informacao) {

    if (!true) {
      return {
        text: `\n Ocorrência conduzida pelo águia...`, style: 'tableBodyAssuncaoContent'
      }
    } else {
      return { text: `\n “SEM ALTERAÇÃO”`, style: 'tableBodyTextSemAlteracao' }
    }

  }

  getGerarOcorrencia(dto: RelatorioInformacaoDTO, informacaoDTO: Informacao) {

    if (informacaoDTO) {

      var texto: any[] = [];
      texto.push(`\n`);
      texto.push({ text: `  ` + informacaoDTO.titulo, bold: true });
      texto.push(`\n`);
      texto.push(`\n`);
      texto.push(`  ` + informacaoDTO.detalhe);
      texto.push(`\n\n`);

      if (informacaoDTO.marcadores) {
        informacaoDTO.marcadores.forEach(marc => {
          texto.push({ text: `Endereço(s): `, bold: true });
          texto.push(`\n\n`);
          texto.push(marc.endereco.descricao);
          texto.push(`\n`);
          if (marc?.latitude && marc?.longitude) {
            texto.push(`Localização: `);
            texto.push({ text: `Abrir no google maps (Lat: ${marc?.latitude} , Long: ${marc?.longitude}) `, color: 'blue', link: `https://www.google.com/maps/search/?api=1&query=${marc?.latitude}%2C${marc?.longitude}` });
            texto.push(`\n`);
            texto.push(marc.endereco.observacao);
            texto.push(`\n`);
            texto.push(`\n`);
          }
        });
      }

      texto.push(`\n\n`);


      if (informacaoDTO.informePessoas) {
        texto.push({ text: `Principais Envolvidos: `, bold: true });
        texto.push(`\n\n`);

        informacaoDTO.informePessoas.forEach(infPessoa => {
          texto.push({ text: infPessoa.pessoa.nome, bold: true });
          if (infPessoa.pessoa.arquivos) {
            infPessoa.pessoa.arquivos.forEach(fotos => {
              if (fotos.arquivo) {
                texto.push([{ image: `data:image/jpeg;base64,${fotos.arquivo}`, fit: [50, 50], width: 50, heigth: 50 }]);
              }
            });

          }

          if (infPessoa.pessoa.nascimento) {
            texto.push(` nascido(a) em ` + infPessoa.pessoa.nascimento);
          }

          if (infPessoa.pessoa.apelido) {
            texto.push(`\n`);
            texto.push(`Apelido: ` + infPessoa.pessoa.apelido);
          }

          if (infPessoa.pessoa.cpf) {
            texto.push(`\n`);
            texto.push(` CPF: ` + infPessoa.pessoa.cpf);
          }

          if (infPessoa.pessoa.mae) {
            texto.push(`\n`);
            texto.push(` Mãe: ` + infPessoa.pessoa.mae);
          }

          if (infPessoa.pessoa.pai) {
            texto.push(`\n`);
            texto.push(` Pai: ` + infPessoa.pessoa.pai);
          }

          if (infPessoa.envolvimento) {
            texto.push(`\n`);
            texto.push(`Informação adicional: ` + infPessoa.envolvimento);
          }
          if (infPessoa.pessoa.linkGenesis) {
            texto.push(`\n`);
            texto.push({ text: `Registro no Genesis `, color: 'blue', link: infPessoa.pessoa.linkGenesis });
          }
          texto.push(`\n`);
          texto.push(`\n`);

        })
      }

      return {
        text: texto, style: 'tableBodyOcorrenciaApoiada'
      }
    } else {
      this.getSemAlteracao();
    }
  }

  getSemAlteracao() {
    return { text: `“SEM ALTERAÇÃO”`, style: 'tableBodyOcorrenciaApoiada' }
  }

  getImagens(dto: RelatorioInformacaoDTO, informacaoDTO: Informacao) {

    let conteudo: any[] = [];
    let largura = 150;
    let altura = 200;

    //fotos da informação
    if (informacaoDTO.arquivos !== undefined && informacaoDTO.arquivos !== null && informacaoDTO.arquivos.length > 0) {

      let sairLoop: boolean = false;
      /* TENTANDO COLOCAR as imagens em 3 em 3 colunas */
      for (let index = 0; index < informacaoDTO.arquivos.length; index++) {

        let objt01: Arquivo = null;
        let objt02: Arquivo = null;
        let objt03: Arquivo = null;

        if (informacaoDTO.arquivos[index]) {
          objt01 = informacaoDTO.arquivos[index];
          if (!objt01.titulo) {
            objt01.titulo = " ";
          }
        } else {
          sairLoop = true;
        }

        if (informacaoDTO.arquivos[index + 1]) {
          objt02 = informacaoDTO.arquivos[index + 1];
          if (!objt02.titulo) {
            objt02.titulo = " ";
          }
        } else {
          sairLoop = true;
        }

        if (informacaoDTO.arquivos[index + 2]) {
          objt03 = informacaoDTO.arquivos[index + 2];
          index = index + 2;
          if (!objt03.titulo) {
            objt03.titulo = " ";
          }

        } else {
          sairLoop = true;
        }


        if (objt01 != null && objt02 == null && objt03 == null) {
          conteudo.push([[{ image: `data:image/jpeg;base64,${objt01.arquivo}`, fit: [largura, altura], largura, altura }, { text: objt01.titulo, fontSize: 8 }],
          {},
          {}
          ]);

          objt01 = null;
          objt02 = null;
          objt03 = null;
        } else if (objt01 != null && objt02 != null && objt03 == null) {
          conteudo.push([[{ image: `data:image/jpeg;base64,${objt01.arquivo}`, fit: [largura, altura], largura, altura }, { text: objt01.titulo, fontSize: 8 }],
          [{ image: `data:image/jpeg;base64,${objt02.arquivo}`, fit: [largura, altura], largura, altura }, { text: objt02.titulo, fontSize: 8 }],
          {}
          ]);

          objt01 = null;
          objt02 = null;
          objt03 = null;

        } else if (objt01 != null && objt02 != null && objt03 != null) {
          conteudo.push([[{ image: `data:image/jpeg;base64,${objt01.arquivo}`, fit: [largura, altura], largura, altura }, { text: objt01.titulo, fontSize: 8 }],
          [{ image: `data:image/jpeg;base64,${objt02.arquivo}`, fit: [largura, altura], largura, altura }, { text: objt02.titulo, fontSize: 8 }],
          [{ image: `data:image/jpeg;base64,${objt03.arquivo}`, fit: [largura, altura], largura, altura }, { text: objt03.titulo, fontSize: 8 }],
          ]);


          objt01 = null;
          objt02 = null;
          objt03 = null;
        }

        if (sairLoop) {
          break;
        }

      }

      let tabelaFotos: any = {
        table: {
          headerRows: 0,
          widths: ['*', '*', '*'],
          body: [
            conteudo
          ],
        },
        layout: {

        }
      }

      return tabelaFotos;
    }
  }

  getOcorrenciaDeVulto() {


    if (!true) {
      return {
        text: `\n Ocorrência de VULTO ...`, style: 'tableBodyAssuncaoContent'
      }
    } else {
      return { text: `\n “SEM ALTERAÇÃO”`, style: 'tableBodyTextSemAlteracao' }
    }
  }

  getOcorrenciaEnvolvendoPolicial() {
    if (!true) {
      return {
        text: `\n Ocorrência Envolvendo PM...`, style: 'tableBodyAssuncaoContent'
      }
    } else {
      return { text: `\n “SEM ALTERAÇÃO”`, style: 'tableBodyTextSemAlteracao' }
    }

  }

  getObservacoesGerais() {
    if (!true) {
      return {
        text: `\n OBS GERAL PM...`, style: 'tableBodyAssuncaoContent'
      }
    } else {
      return { text: `\n “SEM ALTERAÇÃO”`, style: 'tableBodyTextSemAlteracao' }
    }

  }

  getTerminoServico(dto: RelatorioInformacaoDTO) {
    if (dto.termino) {
      return {
        text: dto.termino, style: 'tableBodyAssuncaoContent'
      }
    } else {
      return { text: `\n “SEM ALTERAÇÃO”`, style: 'tableBodyTextSemAlteracao' }
    }
  }


}
