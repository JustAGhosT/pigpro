import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cheeseRecipes } from '@/lib/dairy-data';
import { CheeseRecipe } from '@/lib/dairy-types';
import { RecipeDetailDialog } from './RecipeDetailDialog';

export const RecipeLibrary: React.FC = () => {
  const [recipes, setRecipes] = useState<CheeseRecipe[]>(cheeseRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<CheeseRecipe | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleRecipeClick = (recipe: CheeseRecipe) => {
    setSelectedRecipe(recipe);
    setIsDetailOpen(true);
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.cheese_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cheese Recipe Library</h2>
          <Input
            placeholder="Search recipes..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map(recipe => (
            <Card key={recipe.id} onClick={() => handleRecipeClick(recipe)} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{recipe.cheese_type}</CardTitle>
                <CardDescription>A classic {recipe.species} cheese</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Ingredients:</p>
                <ul className="list-disc list-inside text-sm">
                  {recipe.ingredients.slice(0, 3).map((ing, i) => <li key={i}>{ing}</li>)}
                  {recipe.ingredients.length > 3 && <li>...</li>}
                </ul>
                <p className="mt-4 font-semibold">Aging Time:</p>
                <p className="text-sm">{recipe.aging_time} days</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <RecipeDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        recipe={selectedRecipe}
      />
    </>
  );
};
