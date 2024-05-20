export default async function Test() {
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  const randomValue = Math.random();

  if (randomValue > 0.5) {
    console.log("Throwing an error");
    throw new Error("BOOM");
  } else {
    console.log("NO ERROR, ALL GOOD");
  }

  return <div>NO ERROR, ALL GOOD</div>;
}
