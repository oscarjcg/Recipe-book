import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class DataStorageService {

    BASE_URL = 'https://angular-menu-project.firebaseio.com/';
    constructor(private http: HttpClient, private recipeService: RecipeService) {

    }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        return this.http.put(this.BASE_URL + 'recipes.json', recipes)
            .subscribe((response) => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(this.BASE_URL + 'recipes.json')
        .pipe(map((recipes) => {
            return recipes.map(recipe => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            });
        }), tap(recipes => {
            this.recipeService.setRecipes(recipes);
        }));
    }
}
