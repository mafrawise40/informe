import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.scss']
})
export class DialogoComponent {

  textoInformacao: string = "";

  constructor(
    public dialogRef: MatDialogRef<DialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }



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
