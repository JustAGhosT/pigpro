export const LIVESTOCK_DATA = {
  poultry: {
    label: 'Poultry',
    icon: 'feather',
    categories: {
      bantam: {
        label: 'Bantam Breeds',
        description: 'Miniature chickens, 1/4 to 1/2 size of standard breeds',
        avgWeight: '500-1000g',
        avgEggs: '150-200/year'
      },
      standard: {
        label: 'Standard Breeds',
        description: 'Traditional full-size heritage breeds',
        avgWeight: '2-4kg',
        avgEggs: '180-250/year'
      },
      commercial: {
        label: 'Commercial Layers',
        description: 'High-production hybrid breeds',
        avgWeight: '1.5-2.5kg',
        avgEggs: '280-320/year'
      },
      meat: {
        label: 'Meat Breeds',
        description: 'Fast-growing broiler breeds',
        avgWeight: '3-5kg',
        avgEggs: '100-150/year'
      },
      dual: {
        label: 'Dual Purpose',
        description: 'Good for both eggs and meat',
        avgWeight: '2.5-3.5kg',
        avgEggs: '200-250/year'
      },
      ornamental: {
        label: 'Ornamental',
        description: 'Fancy breeds for exhibition',
        avgWeight: '1-3kg',
        avgEggs: '50-150/year'
      }
    },
    breeds: {
      bantam: [
        {
          id: 'plymouth-rock-bantam',
          name: 'Plymouth Rock Bantam',
          category: 'bantam',
          subcategory: 'traditional',
          traits: {
            combType: 'single',
            eyeColor: 'reddish-bay',
            legColor: 'yellow',
            eggColor: 'light-brown',
            temperament: 'docile-friendly',
            size: 'medium-bantam',
            pattern: 'barred'
          },
          characteristics: {
            roosterWeight: '850-960g',
            henWeight: '740-850g',
            annualEggs: '180-200',
            coldHardiness: 'excellent',
            heatTolerance: 'moderate',
            diseaseResistance: 'good'
          },
          performance: {
            eggLayingConsistency: 85,
            growthRate: 75,
            feedConversion: 70,
            docility: 90,
            foraging: 75,
            hardiness: 85
          }
        },
        {
          id: 'serama',
          name: 'Serama',
          category: 'bantam',
          subcategory: 'true-bantam',
          traits: {
            combType: 'single',
            eyeColor: 'dark-brown',
            legColor: 'yellow',
            eggColor: 'cream',
            temperament: 'friendly-confident',
            size: 'micro-bantam',
            pattern: 'various'
          },
          characteristics: {
            roosterWeight: '300-500g',
            henWeight: '250-400g',
            annualEggs: '100-150',
            coldHardiness: 'poor',
            heatTolerance: 'excellent',
            diseaseResistance: 'fair'
          },
          performance: {
            eggLayingConsistency: 60,
            growthRate: 65,
            feedConversion: 80,
            docility: 95,
            foraging: 50,
            hardiness: 60
          }
        }
      ],
      standard: [
        {
          id: 'rhode-island-red',
          name: 'Rhode Island Red',
          category: 'standard',
          subcategory: 'heritage',
          traits: {
            combType: 'single',
            eyeColor: 'reddish-orange',
            legColor: 'yellow',
            eggColor: 'brown',
            temperament: 'hardy-assertive',
            size: 'large',
            pattern: 'solid-red'
          },
          characteristics: {
            roosterWeight: '3.8-4.1kg',
            henWeight: '2.9-3.2kg',
            annualEggs: '200-280',
            coldHardiness: 'excellent',
            heatTolerance: 'good',
            diseaseResistance: 'excellent'
          },
          performance: {
            eggLayingConsistency: 90,
            growthRate: 85,
            feedConversion: 85,
            docility: 70,
            foraging: 90,
            hardiness: 95
          }
        },
        {
          id: 'orpington',
          name: 'Buff Orpington',
          category: 'standard',
          subcategory: 'heritage',
          traits: {
            combType: 'single',
            eyeColor: 'reddish-bay',
            legColor: 'pink-white',
            eggColor: 'light-brown',
            temperament: 'docile-friendly',
            size: 'large',
            pattern: 'solid-buff'
          },
          characteristics: {
            roosterWeight: '4.5-5kg',
            henWeight: '3.2-3.6kg',
            annualEggs: '180-200',
            coldHardiness: 'excellent',
            heatTolerance: 'fair',
            diseaseResistance: 'good'
          },
          performance: {
            eggLayingConsistency: 75,
            growthRate: 80,
            feedConversion: 70,
            docility: 95,
            foraging: 70,
            hardiness: 85
          }
        }
      ],
      commercial: [
        {
          id: 'isa-brown',
          name: 'ISA Brown',
          category: 'commercial',
          subcategory: 'hybrid-layer',
          traits: {
            combType: 'single',
            eyeColor: 'orange',
            legColor: 'yellow',
            eggColor: 'brown',
            temperament: 'docile-productive',
            size: 'medium',
            pattern: 'red-brown'
          },
          characteristics: {
            roosterWeight: '2.2-2.5kg',
            henWeight: '1.8-2kg',
            annualEggs: '300-320',
            coldHardiness: 'good',
            heatTolerance: 'good',
            diseaseResistance: 'fair'
          },
          performance: {
            eggLayingConsistency: 98,
            growthRate: 90,
            feedConversion: 95,
            docility: 85,
            foraging: 60,
            hardiness: 70
          }
        }
      ],
      meat: [
        {
          id: 'cornish-cross',
          name: 'Cornish Cross',
          category: 'meat',
          subcategory: 'broiler',
          traits: {
            combType: 'pea',
            eyeColor: 'bay',
            legColor: 'yellow',
            eggColor: 'light-brown',
            temperament: 'sedentary',
            size: 'extra-large',
            pattern: 'white'
          },
          characteristics: {
            roosterWeight: '4.5-5.5kg',
            henWeight: '3.5-4.5kg',
            annualEggs: '100-120',
            coldHardiness: 'poor',
            heatTolerance: 'poor',
            diseaseResistance: 'poor'
          },
          performance: {
            eggLayingConsistency: 40,
            growthRate: 100,
            feedConversion: 90,
            docility: 90,
            foraging: 20,
            hardiness: 40
          }
        }
      ],
      dual: [],
      ornamental: []
    }
  },
  cattle: {
    label: 'Cattle',
    icon: 'award', // Placeholder icon
    categories: {
      dairy: {
        label: 'Dairy Breeds',
        description: 'Bred for high milk production.',
        avgMilkYield: '8,000-15,000 L/year'
      },
      beef: {
        label: 'Beef Breeds',
        description: 'Bred for meat quality and yield.',
        avgWeight: '700-1200kg'
      },
      dual: {
        label: 'Dual Purpose',
        description: 'Good for both milk and meat.',
        avgWeight: '600-1000kg',
        avgMilkYield: '4,000-6,000 L/year'
      }
    },
    breeds: {
      dairy: [
        {
          id: 'holstein-friesian',
          name: 'Holstein-Friesian',
          category: 'dairy',
          subcategory: 'specialized-dairy',
          traits: {
            coatColor: 'black-and-white or red-and-white',
            hornStatus: 'polled or horned',
            temperament: 'docile',
          },
          characteristics: {
            bullWeight: '1000-1100kg',
            cowWeight: '680-770kg',
            annualMilkYield: '10,000-12,000 L',
            climateAdaptability: 'moderate',
            diseaseResistance: 'fair'
          },
          performance: {
            milkProduction: 95,
            butterfatContent: 60,
            feedConversion: 85,
            calvingEase: 75,
            longevity: 70
          }
        }
      ],
      beef: [],
      dual: []
    }
  },
  goats: {
    label: 'Goats',
    icon: '🐐',
    categories: {},
    breeds: {}
  },
  sheep: {
    label: 'Sheep',
    icon: '🐑',
    categories: {},
    breeds: {}
  },
  pigs: {
    label: 'Pigs',
    icon: '🐷',
    categories: {},
    breeds: {}
  },
  rabbits: {
    label: 'Rabbits',
    icon: '🐰',
    categories: {},
    breeds: {}
  },
  fish: {
    label: 'Fish',
    icon: '🐟',
    categories: {},
    breeds: {}
  },
  insects: {
    label: 'Insects',
    icon: '🐛',
    categories: {},
    breeds: {}
  },
  arachnids: {
    label: 'Arachnids',
    icon: '🕷️',
    categories: {},
    breeds: {}
  }
};
