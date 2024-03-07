import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlaylistService } from 'src/app/services/playlist.service';
import { IonInput, ModalController, IonButton, IonTitle, ToastController } from "@ionic/angular/standalone";
import { MemberService } from 'src/app/services/member.service';
import { Playlist } from '../../model/playlist';
import { Member } from 'src/app/model/member';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
  standalone: true,
  imports: [IonTitle, IonButton, IonInput, FormsModule, ReactiveFormsModule],
})
export class CreateListComponent  implements OnInit {
  public form: FormGroup;
  member?: Member;

  constructor(private formBuilder: FormBuilder,private playlistService: PlaylistService, private memberService: MemberService, private modalController: ModalController, public toastController: ToastController) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4)] ]
      
    });
  }


  ngOnInit(): void {
    this.getMember();
  }

  public crearLista(): void {
    if (this.form.invalid || !this.member) {
      console.error('El formulario es inválido o no hay un miembro actual.');
      return;
    }
    const nombreLista = this.form.get('nombre')?.value;
    console.log(this.member)
    const nuevaLista: Playlist = {
      name: nombreLista,
      member: this.member,

    };
    console.log('Nueva lista:', nuevaLista);
    this.playlistService.postCreateList(nuevaLista).subscribe(
      (nuevaLista) => {
        this.modalController.dismiss();
        this.showToast('Lista creada con éxito', 'success', 2000);
      },
      (error) => {
        console.error('Error al crear la lista:', error);
        this.showToast('Error al crear la lista', 'danger', 2000);
      }
    );
  }

  getMember(): void {
    const currentMember = this.memberService.getCurrentMember();
    console.log(currentMember);
    if (currentMember) {
      this.member = currentMember;
      console.log('Member:', this.member);
    } else {
      console.error('No se pudo obtener la información del usuario.');
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
