export default async (_req, res) => {
  // Should handle the error
  const data = await fetch("http://localhost:1323/customers");
  const customers = await data.json();
  return res.json(customers.customers);
};
