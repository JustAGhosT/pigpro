import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Breed } from '../lib/types';

export const BreedDetailModal: React.FC<{ breed: Breed; onClose: () => void }> = ({ breed, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 sticky top-0 bg-white border-b z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{breed.name}</h2>
              <p className="text-gray-600">{breed.origin}</p>
            </div>
            <Button onClick={onClose} size="icon" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <img
            src={breed.imageUrl}
            alt={breed.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <p className="text-gray-700">{breed.description}</p>

          <Card>
            <CardHeader>
              <CardTitle>Health Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {breed.commonHealthConcerns && breed.commonHealthConcerns.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-1">Common Health Concerns</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {breed.commonHealthConcerns.map(concern => <li key={concern}>{concern}</li>)}
                  </ul>
                </div>
              )}
              {breed.compliance?.ndImmunisation && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">ND Immunisation Required</Badge>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-1">Maintenance Level</h4>
                <p className="text-sm text-gray-600 capitalize">{breed.intelligence.maintenanceLevel}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Adaptability Score</h4>
                <p className="text-sm text-gray-600">{breed.intelligence.adaptability}/100</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
