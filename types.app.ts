export interface Customer {
  id: number;
  last_updated: number;
  attributes: {
    [key: string]: string;
  };
}

export type Customers = Array<Customer>;
