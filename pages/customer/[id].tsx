import React from "react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { Customer } from "../../types.app";
import * as dateFns from "date-fns";

interface Props {
  customer: Customer;
}

const sortMap = {
  last_name: 1,
  first_name: 2,
  email: 3,
};

const typeMap = {
  email: "email",
  phone: "tel",
};

export default function customer(props: Props) {
  const router = useRouter();
  const { id } = router.query;

  const [attrs, setAttrs] = React.useState(props.customer.attributes);

  const isEdit = "edit" in router.query;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-4 py-6">
        <section className="flex items-center justify-between">
          <div className="space-x-2">
            <h1 className="text-4xl capitalize inline-block">
              {props.customer.attributes.first_name}{" "}
              {props.customer.attributes.last_name}
            </h1>
            <span className="lowercase text-gray-400">
              {props.customer.attributes.email}
            </span>
            <div
              className="text-gray-400 text-xs"
              style={{ marginLeft: 0, marginTop: 4 }}
            >
              Last Updated:{" "}
              {dateFns.format(
                dateFns.fromUnixTime(props.customer.last_updated),
                "P p"
              )}{" "}
            </div>
          </div>
          {!isEdit && (
            <button
              type="button"
              className="flex items-center space-x-2"
              onClick={() => router.push(`/customer/${props.customer.id}?edit`)}
            >
              <span>Edit</span>
              <svg
                width={24}
                height={24}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
        </section>
        <div className="grid gap-4 grid-cols-2 grid-rows-1">
          <div className="space-y-2">
            <h2 className="text-2xl">Details</h2>
            <form
              id="save-changes"
              className="space-y-10"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const data = new FormData(form);
                const entries = [...data.entries()].reduce(
                  (acc, [key, value]) => {
                    return {
                      ...acc,
                      [key]: value,
                    };
                  },
                  {}
                );

                const resp = await fetch(
                  `http://localhost:1323/customers/${id}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ customer: { attributes: entries } }),
                  }
                );

                if (resp.status === 200) {
                  router.push("/");
                }
              }}
            >
              {Object.entries(attrs)
                .filter(([key, _value]) => key !== "created_at")
                .sort((a, b) => {
                  const [keyA] = a;
                  const [keyB] = b;
                  const sortMapA = sortMap[keyA] ?? 0;
                  const sortMapB = sortMap[keyB] ?? 0;

                  if (sortMapA > sortMapB) return -1;
                  if (sortMapA < sortMapB) return 1;
                  if (sortMapA === sortMapB) return 0;
                })
                .map(([key, value]) => {
                  return (
                    <div key={key} className="space-y-2">
                      <label className="uppercase text-xs text-gray-400 block">
                        {key.split("_").join(" ")}
                      </label>
                      <span className="space-x-2">
                        <input
                          className="text-xl border-b-2 border-gray-200 w-96"
                          defaultValue={value}
                          name={key}
                          type={!typeMap[key] ? "text" : typeMap[key]}
                          readOnly={!isEdit}
                        />
                        {isEdit && key !== "email" && (
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() => {
                              const nextAttrs = attrs;
                              delete nextAttrs[key];

                              setAttrs({ ...nextAttrs });
                            }}
                          >
                            <svg
                              width={24}
                              height={24}
                              className="inline"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </span>
                    </div>
                  );
                })}
            </form>
          </div>

          {isEdit && (
            <div className="space-y-2">
              <h2 className="text-2xl">Add Details</h2>
              <form
                className="space-y-10"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form);

                  const key = data
                    .get("key")
                    .toString()
                    .toLocaleLowerCase()
                    .split(" ")
                    .join("_");
                  const value = data.get("value").toString();

                  const nextAttrs = {
                    ...attrs,
                    [key]: value,
                  };

                  setAttrs(nextAttrs);

                  form.reset();
                }}
              >
                <div className="space-y-2">
                  <label className="uppercase text-xs text-gray-400 block">
                    Key
                  </label>
                  <input
                    required={true}
                    name="key"
                    className="text-xl border-b-2 border-gray-200 w-96"
                  />
                </div>

                <div className="space-y-2">
                  <label className="uppercase text-xs text-gray-400 block">
                    Value
                  </label>
                  <input
                    required={true}
                    name="value"
                    className="text-xl border-b-2 border-gray-200 w-96"
                  />
                </div>

                <button
                  type="submit"
                  className="border-2 border-blue-500 py-2 px-6 rounded text-blue-500"
                >
                  Add
                </button>
              </form>
            </div>
          )}
        </div>

        {isEdit && (
          <button
            form="save-changes"
            className="bg-blue-500 py-2 px-6 rounded text-white"
          >
            Save Changes
          </button>
        )}
      </div>
    </Layout>
  );
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
