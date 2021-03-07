import React from "react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { Customer } from "../../utils/types.app";
import {
  formatUnixTimeToLocale,
  formValuesToObject,
  patchCustomer,
  sortAttrs,
  wordsToLowerSnakeCase,
} from "../../utils/helpers.app";
import { TrashCan } from "../../components/TrashCan";
import { Pencil } from "../../components/Pencil";

interface Props {
  customer: Customer;
}

const typeMap = {
  email: "email",
  phone: "tel",
};

export default function customer(props: Props) {
  const router = useRouter();
  const { id } = router.query;

  const [attrs, setAttrs] = React.useState(props.customer.attributes);

  const entriesArr = (attrs: { [key: string]: string }) => {
    return Object.entries(attrs)
      .filter(([key, _value]) => key !== "created_at")
      .sort(sortAttrs);
  };

  const isEdit = "edit" in router.query;

  const handleDeleteAttr = (key: string) => (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const nextAttrs = attrs;
    delete nextAttrs[key];

    setAttrs({ ...nextAttrs });
  };

  const handleAddAttr = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;

    // Use a type guard instead of casting
    if (form instanceof HTMLFormElement) {
      const data = new FormData(form);

      const key = wordsToLowerSnakeCase(data.get("key"));
      const value = data.get("value").toString();

      const nextAttrs = {
        ...attrs,
        [key]: value,
      };

      setAttrs(nextAttrs);

      form.reset();
    } else {
      // This is a no-op but unlikely that this will happen
    }
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;

    if (form instanceof HTMLFormElement) {
      const data = new FormData(form);
      const entries = formValuesToObject(data, props.customer.attributes);

      try {
        const resp = await patchCustomer(id, entries);

        // Should inform the user of a success
        if (resp.status === 200) {
          router.push("/");
        }
      } catch (e) {
        // Should inform the user of an error
        console.error(e);
      }
    } else {
      // This is a no-op but unlikely this will happen
    }
  };

  const pushToEditView = () =>
    router.push(`/customer/${props.customer.id}?edit`);

  const pushToHomePage = () => router.push("/");

  return (
    <Layout>
      <div className="max-w-4xl py-6 mx-auto space-y-4">
        <section className="flex items-center justify-between">
          <div className="space-x-2">
            <h1 className="inline-block text-4xl capitalize">
              {props.customer.attributes.first_name}{" "}
              {props.customer.attributes.last_name}
            </h1>
            <span className="text-gray-400 lowercase">
              {props.customer.attributes.email}
            </span>
            <div
              className="text-xs text-gray-400"
              style={{ marginLeft: 0, marginTop: 4 }}
            >
              Last Updated:{" "}
              {formatUnixTimeToLocale(props.customer.last_updated)}{" "}
            </div>
          </div>
          {!isEdit && (
            <button
              type="button"
              className="flex items-center space-x-2"
              onClick={pushToEditView}
            >
              <span>Edit</span>
              <Pencil />
            </button>
          )}
        </section>
        <div className="grid grid-cols-2 grid-rows-1 gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl">Details</h2>
            <form
              id="save-changes"
              className="space-y-10"
              onSubmit={handleSaveChanges}
            >
              {entriesArr(attrs).map(([key, value]) => {
                return (
                  <div key={key} className="space-y-2">
                    <label className="block text-xs text-gray-400 uppercase">
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
                        // Email can't be deleted on the API anyway so just
                        // removing the delete button for it here
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={handleDeleteAttr(key)}
                        >
                          <TrashCan />
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
              <form className="space-y-10" onSubmit={handleAddAttr}>
                <div className="space-y-2">
                  <label className="block text-xs text-gray-400 uppercase">
                    Key
                  </label>
                  <input
                    required={true}
                    name="key"
                    className="text-xl border-b-2 border-gray-200 w-96"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-gray-400 uppercase">
                    Value
                  </label>
                  <input
                    required={true}
                    name="value"
                    className="text-xl border-b-2 border-gray-200 w-96"
                  />
                </div>

                <button type="submit" className="py-2 text-blue-500 ">
                  Add
                </button>
              </form>
            </div>
          )}
        </div>

        {isEdit && (
          <div className="space-x-6">
            <button
              className="px-6 py-2 text-blue-500 border-2 border-blue-500 rounded"
              onClick={pushToHomePage}
            >
              Discard Changes
            </button>
            <button
              form="save-changes"
              className="px-6 py-2 text-white bg-blue-500 border-2 border-blue-500 rounded"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  // Should handle the error
  const data = await fetch(`http://localhost:3000/api/customer/${id}`);
  const customer = await data.json();

  return {
    props: {
      customer,
    },
  };
}
