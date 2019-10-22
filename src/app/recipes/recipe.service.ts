import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('NameT',
  //   'DescT',
  //   'https://ifoodreal.com/wp-content/uploads/2018/09/healthy-freezer-meals-1-recipes-and-shopping-list.jpg',
  //   [
  //     new Ingredient('Meat', 1),
  //     new Ingredient('French fries', 20)
  //   ]),
  //   new Recipe('NameT2',
  //   'DescT2',
  //   'https://ifoodreal.com/wp-content/uploads/2018/09/healthy-freezer-meals-1-recipes-and-shopping-list.jpg',
  //   [
  //     new Ingredient('Meat', 2),
  //     new Ingredient('French fries', 10)
  //   ])
  // ];
  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    // Only copy
    return this.recipes.slice();
  }

  addIngredientsToSL(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
