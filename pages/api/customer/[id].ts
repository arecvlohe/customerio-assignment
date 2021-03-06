export default async (req, res) => {
  const { id } = req.query;

  const data = await fetch(`http://localhost:1323/customers/${id}`);
  const customer = await data.json();
  return res.json(customer.customer);
};
