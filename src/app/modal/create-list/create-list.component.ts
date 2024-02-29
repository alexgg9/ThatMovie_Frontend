import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlaylistService } from 'src/app/services/playlist.service';


@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class CreateListComponent  implements OnInit {
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder,private playlistService: PlaylistService) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4)] ]
      
    });
  }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public crearLista(): void {
    if (this.form.invalid) {
      return;
    }

    const nombreLista = this.form.get('nombre')?.value;
    // Obtener otros valores del formulario según sea necesario

    // Crear el objeto de lista utilizando los valores del formulario
    const nuevaLista: any = {
      nombre: nombreLista,
      // Otros campos de la lista que se obtienen del formulario
    };

    // Llamar al método en el servicio para crear la lista
    this.playlistService.postCreateList(nuevaLista).subscribe((respuesta) => {
      // Manejar la respuesta del servicio, por ejemplo, mostrar un mensaje de éxito
      console.log('Lista creada correctamente:', respuesta);
    }, (error) => {
      // Manejar cualquier error que pueda ocurrir al llamar al servicio
      console.error('Error al crear la lista:', error);
    });
  }


}
