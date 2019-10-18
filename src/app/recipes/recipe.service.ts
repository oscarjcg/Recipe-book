import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('NameT',
    'DescT',
    'https://ifoodreal.com/wp-content/uploads/2018/09/healthy-freezer-meals-1-recipes-and-shopping-list.jpg',
    [
      new Ingredient('Meat', 1),
      new Ingredient('French fries', 20)
    ]),
    new Recipe('NameT2',
    'DescT2',
    'https://ifoodreal.com/wp-content/uploads/2018/09/healthy-freezer-meals-1-recipes-and-shopping-list.jpg',
    [
      new Ingredient('Meat', 2),
      new Ingredient('French fries', 10)
    ])
  ];

  constructor(private slService: ShoppingListService) {}
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
}
