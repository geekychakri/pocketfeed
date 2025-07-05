import RouteBack from "@/components/RouteBack/RouteBack";
import { getXataClient } from "@/xata";
import { auth, currentUser } from "@clerk/nextjs/server";

const xata = getXataClient();

export default async function ImportHistory() {
  const userId = (await auth()).userId || "";
  const records = await xata.db["opml-files"]
    .filter({
      userId: userId,
    })
    .sort("xata.createdAt", "desc")
    .getAll();
  console.log({ records });

  return (
    <div className="mx-auto w-full max-w-[750px] py-20">
      <div className="relative mb-5 flex items-center">
        <RouteBack className="absolute -left-9" />
        <h1 className="text-lg font-medium">Import History</h1>
      </div>
      <div className="flex flex-col">
        {records.map((record) => {
          return (
            <div
              key={record.id}
              className="flex justify-between gap-2 py-[10px] not-last:shadow-[0_1px_0_0_var(--border-non-interactive)]"
            >
              <p>{record.filename}</p>
              <time
                dateTime={record.xata.createdAt
                  .toLocaleDateString()
                  .split("/")
                  .reverse()
                  .join("-")}
                className="text-text-secondary"
              >
                {record.xata.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          );
        })}
      </div>
    </div>
  );
}
