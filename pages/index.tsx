import { Layout } from "../components/Layout";
import Link from "next/link";
import { Customers } from "../types.app";
import * as dateFns from "date-fns";

interface Props {
  customers: Customers;
}

export default function Home(props: Props) {
  console.log({ props });
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-4 py-6">
        <h1 className="text-4xl">Customers</h1>
        <table className="table-fixed w-full ">
          <thead className="border-t-2 border-gray-200">
            <tr>
              <th className="text-left p-4 text-xl">Name</th>
              <th className="text-left p-4 text-xl">Email</th>
              <th className="text-left p-4 text-xl">Company</th>
              <th className="text-right p-4 text-xl">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {props.customers.map((customer, idx) => {
              return (
                <tr
                  key={customer.id}
                  className={idx % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="capitalize p-4">
                    <Link passHref href={`/customer/${customer.id}`}>
                      <a className="underline text-blue-500">
                        {customer.attributes?.first_name ?? "Unknown"}{" "}
                        {customer.attributes?.last_name ?? "Unknown"}
                      </a>
                    </Link>
                  </td>

                  <td
                    className="lowercase p-4 overflow-ellipsis overflow-hidden"
                    title={customer.attributes.email.toLocaleLowerCase()}
                  >
                    {customer.attributes.email ?? "Unknown"}
                  </td>
                  <td
                    className={`capitalize p-4 ${
                      !customer.attributes.company ? "italic text-gray-400" : ""
                    }`}
                  >
                    {customer.attributes.company ?? "Unknown"}
                  </td>
                  <td className="text-right p-4">
                    {dateFns.format(
                      dateFns.fromUnixTime(customer.last_updated),
                      "PP, p"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
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
