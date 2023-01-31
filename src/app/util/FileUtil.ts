
import * as moment from "moment";

export class FileUtil {

  static TITLE_HEADER_PDF = "GOVERNO DO DISTRITO FEDERAL \n" +
    "POLÍCIA MILITAR DO DISTRITO FEDERAL \n" +
    "5o COMANDO DE POLICIAMENTO REGIONAL \n" +
    "AGÊNCIA REGIONAL DE INTELIGÊNCIA \n";

  static FOOT_TEXT_PDF = "LEI no 12.527, de 18 de novembro de 2011, Art. 32. Constituem condutas ilícitas que ensejam responsabilidade do agente público ou militar:" +
    " II - utilizar indevidamente, bem como subtrair, destruir, inutilizar, desfigurar, alterar ou ocultar, total ou parcialmente, informação que se encontre sob sua guarda ou " +
    " a que tenha acesso ou conhecimento em razão do exercício das atribuições de cargo, emprego ou função pública; " +
    " IV - divulgar ou permitir a divulgação ou acessar ou permitir acesso indevido à informação sigilosa ou informação pessoal. " +
    " Decreto-Lei no 2.484/40, art. 325 - Revelar fato de que tem ciência em razão do cargo e que deva permanecer em segredo, ou facilitar-lhe a revelação:" +
    " Decreto Distrital no 35.382, DE 29 DE ABRIL DE 2014, art. 24 - Art. 24. O acesso, a divulgação e o tratamento de documento controlado somente poderão ser" +
    "concedidos à pessoa que tenha necessidade de conhecê-lo e que possua Credencial de Segurança no grau apropriado e na forma deste Decreto.";


  static getPdfHeader(currentPage: number): Array<any> {
    /* if (currentPage == 1) {
       return [{
         image: this.getLogoMJ(),
         alignment: "center",
         width: 150,
         height: 100,
       }];
     }*/

    return [
      { text: '\n\n' },
      { text: 'DOCUMENTO RESTRITO', style: "header" }
    ];
  }


  static getPdfFooter(currentPage: number, pageCount: number, userName: string): Array<any> {
    let body = [
      {
        text: "Página " + currentPage.toString() + " de " + pageCount,
        alignment: "center",
      },
    ];
    body.push({
      text: "Gerado em " + moment(moment(), moment.defaultFormatUtc).format("DD/MM/YYYY kk:mm:ss") + " por " + userName,
      alignment: "center",
    });

    return body;
  }





}