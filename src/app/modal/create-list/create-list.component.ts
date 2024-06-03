import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlaylistService } from 'src/app/services/playlist.service';
import { ModalController, ToastController, IonicModule } from "@ionic/angular";
import { Member } from 'src/app/model/member';
import { playlist } from 'src/app/model/playlist';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, IonicModule],
})
export class CreateListComponent implements OnInit {
  public form: FormGroup;
  member?: Member;

  constructor(
    private formBuilder: FormBuilder,
    private playlistService: PlaylistService,
    private memberService: MemberService,
    private modalController: ModalController,
    public toastController: ToastController
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    this.getMemberFromLocalStorage();
  }

  public crearLista(): void {
    if (this.form.invalid || !this.member) {
      this.showToast('Por favor, completa el formulario correctamente y asegúrate de tener un miembro actual.', 'danger');
      return;
    }
    
    const nombreLista = this.form.get('nombre')?.value;
    if (!nombreLista) {
      this.showToast('El nombre de la lista es obligatorio.', 'danger');
      return;
    }
    
    
    const memberId = Number(localStorage.getItem('userId'));
  
    this.memberService.getMemberById(memberId).subscribe(
      (member) => {
        const list: playlist = {
          name: nombreLista,
          member: member 
        };
        
        console.log(list);
        this.playlistService.postCreateList(list).subscribe(
          (response) => {
            if (response) {
              this.dismissModalAndShowToast('Lista creada con éxito', 'success');
            } else {
              this.showToast('Error al crear la lista', 'danger');
            }
          },
          (error) => {
            this.showToast('Error al crear la lista', 'danger');
          }
        );
      },
      (error) => {
        this.showToast('Error al obtener el miembro', 'danger');
      }
    );
  }
  
  

  
  private async dismissModalAndShowToast(message: string, color: string): Promise<void> {
    await this.modalController.dismiss();
    this.showToast(message, color);
  }

  getMemberFromLocalStorage(): void {
    const storedMember = localStorage.getItem('userId');
    if (storedMember) {
      this.member = JSON.parse(storedMember);
      console.log('Member:', this.member);
    } else {
      console.error('No se pudo obtener la información del usuario desde el LocalStorage.');
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async showToast(msg: string, color: string = 'primary', duration: number = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      color: color
    });
    toast.present();
  }
}
