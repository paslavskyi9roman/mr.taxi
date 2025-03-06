export const mockTariffs = [
  {
    price: 60,
    route: { from: 'Amsterdam', to: 'Rotterdam' },
    additionalStops: [{ from: 'Rotterdam', to: 'The Hague' }]
  },
  {
    price: 80,
    route: { from: 'Utrecht', to: 'Eindhoven' },
    additionalStops: [
      { from: 'Eindhoven', to: 'Tilburg' },
      { from: 'Tilburg', to: 'Breda' }
    ]
  },
  {
    price: 55,
    route: { from: 'Groningen', to: 'Leeuwarden' },
    additionalStops: [{ from: 'Leeuwarden', to: 'Heerenveen' }]
  },
  {
    price: 70,
    route: { from: 'Maastricht', to: 'Venlo' },
    additionalStops: [{ from: 'Venlo', to: 'Roermond' }]
  },
  {
    price: 65,
    route: { from: 'Arnhem', to: 'Nijmegen' },
    additionalStops: [{ from: 'Nijmegen', to: 'Den Bosch' }]
  },
  {
    price: 90,
    route: { from: 'Zwolle', to: 'Enschede' },
    additionalStops: [
      { from: 'Enschede', to: 'Hengelo' },
      { from: 'Hengelo', to: 'Almelo' }
    ]
  }
];
