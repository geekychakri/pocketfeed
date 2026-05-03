import pLimit from "p-limit";

const limit = pLimit(10);

const fetchData = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export default async function PLimit() {
  const input = [
    limit(() => fetchData("foo")),
    limit(() => fetchData("bar")),
    limit(() => fetchData("")),
  ];

  // Only one promise is run at once
  const result = await Promise.all(input);
  console.log(result);

  return <div></div>;
}
