import { Layout } from "../../components/Layout";
import { Customer } from "../../types.app";

interface Props {
  customer: Customer;
}

export default function customer(props: Props) {
  return <Layout>Customer: {props.customer.id}</Layout>;
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
