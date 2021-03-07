export interface Customer {
  id: number;
  last_updated: number;
  // Should type this better if there are
  // attrs that are required
  attributes: {
    [key: string]: string;
  };
}

export type Customers = Array<Customer>;
