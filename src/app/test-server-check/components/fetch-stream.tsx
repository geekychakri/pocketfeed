"use client";

export default function FetchStream() {
  const fetchIt = async () => {
    //   await connection();
    // const controller = new AbortController();
    // const maxBytes = 30 * 1024; // 30 KB
    // let receivedBytes = 0;
    // try {
    //   const res = await fetch(
    //     `https://api.allorigins.win/get?url=${encodeURIComponent("https://www.sarasoueidan.com/blog/index.xml")}`,
    //     {
    //       signal: controller.signal,
    //       cache: "no-store",
    //     },
    //   );
    //   const reader = res.body.getReader();
    //   while (true) {
    //     const { done, value } = await reader.read();
    //     if (done) break;
    //     receivedBytes += value.length; // count how many bytes received so far
    //     console.log(`Received ${value.length} bytes, total: ${receivedBytes}`);
    //     if (receivedBytes >= maxBytes) {
    //       console.log(`Reached ${maxBytes} bytes — aborting fetch.`);
    //       controller.abort(); // this stops the fetch
    //       break;
    //     }
    //   }
    // } catch (err) {
    //   console.log({ Error: err });
    //   if (err.name === "AbortError") {
    //     console.log("Fetch aborted");
    //   }
    // }
  };

  return <button onClick={fetchIt}>Fetch Stream</button>;
}
