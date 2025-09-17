import { ImportOPML } from "@/lib/import-opml";

import { inngest } from "./client";

export const importOpmlJob = inngest.createFunction(
  { id: "import-opml" },
  { event: "import/opml" },
  async ({ event, step }) => {
    // await step.sleep("wait-a-moment", "25s");
    const { message } = await ImportOPML(
      event.data.fileName,
      event.data.fileData,
      event.data.username,
      event.data.userId,
    );
    return { message };
  },
);
