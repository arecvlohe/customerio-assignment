import * as dateFns from "date-fns";

// Should put some of these helpers under test

export const formatUnixTimeToLocale = (date: number): string => {
  return dateFns.format(dateFns.fromUnixTime(date), "PP, p");
};

const sortMap = {
  last_name: 1,
  first_name: 2,
  email: 3,
};

export const sortAttrs = (a: [string, unknown], b: [string, unknown]) => {
  // Attempting to give some sort of order to keys by having the
  // email, first name, last name at the top and all other keys
  // in any order below them
  const [keyA] = a;
  const [keyB] = b;
  const sortMapA = sortMap[keyA] ?? 0;
  const sortMapB = sortMap[keyB] ?? 0;

  if (sortMapA > sortMapB) return -1;
  if (sortMapA < sortMapB) return 1;
  if (sortMapA === sortMapB) return 0;
};

export const wordsToLowerSnakeCase = (words: FormDataEntryValue) => {
  return words.toString().toLocaleLowerCase().split(" ").join("_");
};

export const patchCustomer = (
  id: string | Array<string>,
  entries: { [key: string]: string }
) => {
  return fetch(`http://localhost:1323/customers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: { attributes: entries },
    }),
  });
};

export const formValuesToObject = (
  data: FormData,
  prevData: { [key: string]: string }
) => {
  // BE only deletes a value if it is set to an empty string
  // So setting each to an empty string and any new or updated
  // field will overwrite the empty string in the return below
  const setEachValueToEmptyString = (data) => {
    return Object.keys(data).reduce(
      (acc: { [key: string]: string }, curr: string) => {
        return {
          ...acc,
          [curr]: "",
        };
      },
      {}
    );
  };

  const nextData = [...data.entries()].reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value,
    };
  }, {});

  return {
    ...setEachValueToEmptyString(prevData),
    ...nextData,
  };
};
