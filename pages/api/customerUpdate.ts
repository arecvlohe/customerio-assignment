export default async (req, res) => {
  const { id, body, headers } = req.query;

  const resp = await fetch(`http://localhost:1323/customers/${id}`, {
    body,
    headers,
  });

  if (resp.status === 200) {
  }
};
