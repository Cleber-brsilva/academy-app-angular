import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatTableModule, 
         MatTable,
         MatTableDataSource
} from '@angular/material/table';

import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { CategoriesDataSource, CategoriesItem } from './categories-datasource';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {lastValueFrom} from 'rxjs'
import {Category} from './category.dto';
import {CategoryService} from './category.service'
import { CategoryFormComponent } from './form/form.component';
import {MatIconModule} from '@angular/material/icon'
import { LoadingBarComponent } from '../loading-bar.component';




@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styles: `
    .full-width-table {
      width: 100%;
    }   
  `,
  standalone: true,
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule, // Adds MatIconModule
    CategoryFormComponent,
    LoadingBarComponent]
})


export class CategoriesComponent implements AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<CategoriesItem>;

  /*dataSource = new CategoriesDataSource(); original*/
  dataSource = new MatTableDataSource<Category>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name','description','actions'];

  showForm: Boolean = false;

  showLoading: Boolean = false;

  category!: Category
  
  onNewCategoryClick() {
    this.category = {
      id: 0,
      name: '',
      description: ''
    }
    this.showForm = true
  }
  hideCategoryForm() {
    this.showForm = false;
    this.loadCategories()
    console.log("hideCategoryForm")
  } 

  onEditCategoryClick(category: Category) {  
    this.category = category;  
    this.showForm = true;
    console.log('edit category', category);    
  }

  async onDeleteCategoryClick(category:Category) {
    if (confirm(`Deletar "${category.name}" com id ${category.id} ?`)) {
      this.showLoading = true
      await lastValueFrom(this.categoryService.delete(category.id))
      this.loadCategories();
      this.showLoading = false
    }
  }
    

  async onSave(category: Category) {
    const saved = lastValueFrom(this.categoryService.save(category))
    console.log('Saved', saved)
    this.hideCategoryForm()
  }
    
  
  constructor(private categoryService: CategoryService) {}  

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    // this.table.dataSource = this.dataSource;
    this.loadCategories() // << Adds new method here....    
  }  

  async loadCategories(): Promise<void> {    
    this.showLoading = true;
    const categories = await lastValueFrom(this.categoryService.getAll())

    this.dataSource = new MatTableDataSource(categories)
    this.table.dataSource = this.dataSource
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.showLoading = false;
  }    
}
