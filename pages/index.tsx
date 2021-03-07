import { Layout } from "../components/Layout";
import Link from "next/link";
import { Customers } from "../utils/types.app";
import { formatUnixTimeToLocale } from "../utils/helpers.app";

interface Props {
  customers: Customers;
}

export default function Home(props: Props) {
  return (
    <Layout>
      <div className="max-w-4xl py-6 mx-auto space-y-4">
        <h1 className="text-4xl">Customers</h1>
        <table className="w-full table-fixed ">
          <thead className="border-t-2 border-gray-200">
            <tr>
              <th className="p-4 text-xl text-left">Name</th>
              <th className="p-4 text-xl text-left">Email</th>
              <th className="p-4 text-xl text-left">Company</th>
              <th className="p-4 text-xl text-right">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {props.customers.map((customer, idx) => {
              return (
                <tr
                  key={customer.id}
                  className={idx % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="p-4 capitalize">
                    <Link passHref href={`/customer/${customer.id}`}>
                      <a className="text-blue-500 underline">
                        {customer.attributes?.first_name ?? "Unknown"}{" "}
                        {customer.attributes?.last_name ?? "Unknown"}
                      </a>
                    </Link>
                  </td>

                  <td
                    className="p-4 overflow-hidden lowercase overflow-ellipsis"
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
                  <td className="p-4 text-right">
                    {formatUnixTimeToLocale(customer.last_updated)}
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
