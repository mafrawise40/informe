import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-veiculo-desfecho',
  templateUrl: './dialogo-veiculo-desfecho.component.html',
  styleUrls: ['./dialogo-veiculo-desfecho.component.scss']
})
export class DialogoVeiculoDesfechoComponent  {

  constructor(
    public dialogRef: MatDialogRef<DialogoVeiculoDesfechoComponent>,
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
