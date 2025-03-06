export interface Tariff {
  id?: string;
  route: Route;
  additionalStops: Route[];
  price: number;
}

export interface Route {
  from: string;
  to: string;
}
