import { Customer } from "../../types.app";

interface Props {
  customer: Customer;
}

export default function customer(props: Props) {
  return <p>Customer: {props.customer.id}</p>;
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const data = await fetch(`http://localhost:3000/api/customer/${id}`);
  const customer = await data.json();

  return {
    props: {
      customer,
    },
  };
}
