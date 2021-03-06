import Head from "next/head";
import { useRouter } from "next/router";
import { Customers } from "../types.app";

interface Props {
  customers: Customers;
}

export default function Home(props: Props) {
  const router = useRouter();
  return (
    <div>
      <table className="table-auto">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {props.customers.map((customer) => {
            return (
              <tr
                key={customer.id}
                onClick={() => router.push(`/customer/${customer.id}`)}
              >
                <td>{customer.id}</td>
                <td>{customer.attributes.email ?? "Unknown"}</td>
                <td>{customer.last_updated}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export async function getServerSideProps(_context) {
  const data = await fetch("http://localhost:3000/api/customers");
  const customers = await data.json();

  return {
    props: {
      customers,
    },
  };
}
