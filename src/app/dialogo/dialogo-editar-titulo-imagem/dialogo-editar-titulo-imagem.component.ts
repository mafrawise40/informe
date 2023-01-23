import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialogo-editar-titulo-imagem',
  templateUrl: './dialogo-editar-titulo-imagem.component.html',
  styleUrls: ['./dialogo-editar-titulo-imagem.component.scss']
})
export class DialogoEditarTituloImagemComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogoEditarTituloImagemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.textoInformacao = data.inputText;
    }

  textoInformacao: string = "";

  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  onSimClick(): void {
    this.dialogRef.close(this.textoInformacao);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
