import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlaylistService } from 'src/app/services/playlist.service';
import { IonInput } from "@ionic/angular/standalone";
import { MemberService } from 'src/app/services/member.service';
import { Playlist } from 'src/app/model/Playlist';
import { Member } from 'src/app/model/member';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
  standalone: true,
  imports: [IonInput, FormsModule, ReactiveFormsModule],
})
export class CreateListComponent  implements OnInit {
  public form: FormGroup;
  member?: Member;

  constructor(private formBuilder: FormBuilder,private playlistService: PlaylistService, private memberService: MemberService) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4)] ]
      
    });
  }


  ngOnInit(): void {
    this.getMember();
  }

  public crearLista(): void {
    if (this.form.invalid) {
      return;
    }
  
    const nombreLista = this.form.get('nombre')?.value;
  
    const nuevaLista: Playlist = {
      name: nombreLista,
      member: this.member
    };
  
    console.log(nuevaLista);
  
    this.playlistService.postCreateList(nuevaLista).subscribe(
      (response) => {
        console.log('Lista creada con éxito:', response);
        
      },
      (error) => {
        console.error('Error al crear la lista:', error);
        
      }
    );
  }

  getMember(): void {
    const currentMember = this.memberService.getCurrentMember();
    if (currentMember) {
      this.member = currentMember;
      console.log('Member:', this.member);
    } else {
      console.error('No se pudo obtener la información del usuario.');
    }
  }

}
