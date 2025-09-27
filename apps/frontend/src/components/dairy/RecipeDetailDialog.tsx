import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { CheeseRecipe } from '@/lib/dairy-types';
import { Button } from '@/components/ui/button';

interface RecipeDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: CheeseRecipe | null;
}

export const RecipeDetailDialog: React.FC<RecipeDetailDialogProps> = ({ isOpen, onClose, recipe }) => {
  if (!recipe) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold">{recipe.cheese_type}</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mt-1">
            A classic {recipe.species} cheese recipe by {recipe.author}.
          </Dialog.Description>

          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Ingredients</h3>
              <ul className="list-disc list-inside mt-2">
                {recipe.ingredients.map((item, index) => <li key={`${recipe.id}-ingredient-${index}`}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Equipment Needed</h3>
              <ul className="list-disc list-inside mt-2">
                {recipe.equipment_needed.map((item, index) => <li key={`${recipe.id}-equipment-${index}`}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Instructions</h3>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                {recipe.steps.map((step, index) => <li key={`${recipe.id}-step-${index}`}>{step}</li>)}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Recommended Conditions</h3>
              <p>Temperature: {recipe.recommended_temp.min}°C - {recipe.recommended_temp.max}°C</p>
              <p>Humidity: {recipe.recommended_humidity.min}% - {recipe.recommended_humidity.max}%</p>
              <p>Aging Time: {recipe.aging_time} days</p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Dialog.Close asChild>
              <Button type="button" variant="outline">Close</Button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
