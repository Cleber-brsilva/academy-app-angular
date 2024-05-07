import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule} from '@angular/material/input'
import { Category } from '../category.dto';



@Component({
  selector: 'category-form',
  standalone: true,
  imports: [MatButtonModule,
            MatInputModule,
            ReactiveFormsModule,
            MatCardModule],
  templateUrl: './form.component.html',
  styles: ``
})

export class CategoryFormComponent {
      
    //passar dados do componente pai para o componente filho
    @Input() set category(category: Category) {
      //console.log("Input set ",category);      
      this.categoryForm.setValue(category)
    }

    /*e passar dados do componente filho para o componente pai*/ 
    @Output() back = new EventEmitter(); 
    @Output() save = new EventEmitter<Category>(); //Neste código, criamos o evento save e atribuímos um tipo ao EventEmitter. 

    private fb = inject(FormBuilder)
      categoryForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required ,Validators.minLength(3)]],
      description: ['', Validators.required]
    })  

    //disparamos o evento e passamos a variável this.categoryForm.value, que é um objeto contendo os dados do formulário.
    onSubmit(){
      this.save.emit(this.categoryForm.value as Category);
      console.log('onSubmit botao save', this.categoryForm.value)
    }

    onBack(){
      this.back.emit();
      console.log("onBack botao voltar");      
    }

    



}
