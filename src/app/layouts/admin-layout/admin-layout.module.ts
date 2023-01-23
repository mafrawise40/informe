
import { PainelComponent } from './../../painel/painel.component';
import { LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { AgmCoreModule } from '@agm/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import localePtBr from '@angular/common/locales/pt';
import { InformacaoComponent } from 'app/informacao/informacao/informacao.component';
import { DialogoComponent } from 'app/dialogo/dialogo.component';
import { MatIconModule } from '@angular/material/icon';
import { InformacaoConsultarComponent } from 'app/informacao-consultar/informacao-consultar.component';
import { NgxMaskModule } from 'ngx-mask';
import { DialogoEditarTituloImagemComponent } from 'app/dialogo/dialogo-editar-titulo-imagem/dialogo-editar-titulo-imagem.component';
import { ConsultarPessoasComponent } from 'app/pessoas/consultar-pessoas/consultar-pessoas.component';
import { CadastrarPessoasComponent } from 'app/pessoas/cadastrar-pessoas/cadastrar-pessoas.component';
import { ConsultarVeiculosComponent } from 'app/veiculos/consultar-veiculos/consultar-veiculos.component';
import { PainelCaraterGeralComponent } from 'app/veiculos/carater-geral/painel-carater-geral/painel-carater-geral.component';
import { CadastrarVeiculosComponent } from 'app/veiculos/cadastrar-veiculos/cadastrar-veiculos.component';
import { DialogoVeiculoDesfechoComponent } from 'app/dialogo/dialogo-veiculo-desfecho/dialogo-veiculo-desfecho.component';




registerLocaleData(localePtBr, 'pt-BR');

const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatDialogModule,
    NgxMaskModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDGlzRnmM71wtSqB2qXj8L7nCdOGqvszz0'
      // apiKey: 'AIzaSyAzNELPmrU-kTZ7G_QaNbbYYtESYeJRdqw'
    })


  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    PainelComponent,
    InformacaoComponent,
    InformacaoConsultarComponent,
    DialogoComponent,
    ConsultarPessoasComponent,
    CadastrarVeiculosComponent,
    ConsultarVeiculosComponent,
    PainelCaraterGeralComponent,
    DialogoEditarTituloImagemComponent,
    DialogoVeiculoDesfechoComponent,
    CadastrarPessoasComponent,
    
  ],
  providers: [
    // { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    MatDatepickerModule


  ]
})

export class AdminLayoutModule { }
