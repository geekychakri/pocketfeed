"use client";

import qs from "qs";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

export default function DBTest() {
  // const images = await xata.db.image.getAll();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // console.log(Object.fromEntries(formData.entries()));
    // // const results = qs.parse(Object.fromEntries(formData.entries()));
    // // console.log(results);
    // for (const [key, value] of formData) {
    //   console.log(`${key}: ${value}`);
    // }
    const keyValuePair = [
      ["username", "test"],
      ["username", "test1"],
    ];

    console.log(Object.fromEntries(keyValuePair));
  };

  return (
    <div>
      dBtest
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" name="text2" value="bar" />
        <input type="text" name="text2" value="baz" />

        {/* <label>First name</label>
        <input name="people[1][first_name]" />
        <label>Last name</label>
        <input name="people[1][last_name]" />
        <label>Email</label>
        <input name="people[1][email]" />
        Person 2:
        <label>First name</label>
        <input name="people[2][first_name]" />
        <label>Last name</label>
        <input name="people[2][last_name]" />
        <label>Email</label>
        <input name="people[2][email]" /> */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
