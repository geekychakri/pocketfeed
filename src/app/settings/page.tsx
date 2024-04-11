import RouteBack from "@/components/RouteBack/RouteBack";
import FileUpload from "@/components/FileUpload";

export default function Settings() {
  return (
    <main className="flex flex-col gap-8 w-full max-w-[520px] mx-auto py-20">
      <h1 className="flex items-center gap-4 font-medium">
        <RouteBack />
        <span className="text-xl">Settings</span>
      </h1>
      <div className="flex items-center justify-between border rounded-md p-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-medium">Membership Status</h2>
          <span className="bg-[#eee] px-2 py-1 text-sm rounded-md self-start">
            Free
          </span>
        </div>
        <button className="bg-primary inline px-4 py-2 text-white rounded-md font-medium">
          Change
        </button>
      </div>
      <div>
        <FileUpload />
      </div>
      <form className="flex flex-col gap-6">
        <label htmlFor="username" className="flex flex-col gap-2">
          <span className="font-medium">Username</span>
          <input
            type="text"
            id="username"
            placeholder="john@doe.com"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
          />
        </label>
        <label htmlFor="email" className="flex flex-col gap-2">
          <span className="font-medium">Email address</span>
          <input
            type="email"
            id="email"
            placeholder="john@doe.com"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
          />
        </label>
        <label htmlFor="fullname" className="flex flex-col gap-2">
          <span className="font-medium">Full name</span>
          <input
            type="text"
            id="fullname"
            placeholder="Geeky Chakri"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
          />
        </label>
        <label htmlFor="website" className="flex flex-col gap-2">
          <span className="font-medium">Website</span>
          <input
            type="text"
            id="website"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
            placeholder="geekychakri.github.io"
          />
        </label>
        <label htmlFor="bio" className="flex flex-col gap-2">
          <span className="font-medium">Bio</span>
          <textarea
            id="bio"
            placeholder="I love reading blogs..."
            className="px-4 py-2 min-h-24 rounded-md border focus:border-primary scroll-pb-2 outline-none duration-100"
          />
        </label>
        <button className="bg-primary font-medium text-white px-4 py-2 rounded-md">
          Save
        </button>
      </form>
      <div className="flex flex-col gap-2">
        <h2 className="font-medium">Integrations</h2>
        <div className="border rounded-md p-8">
          <h3>Notion</h3>
        </div>
      </div>
      <div className="font-medium flex gap-4 [&>*]:flex-1 [&>*]:px-4 [&>*]:py-2 [&>*]:rounded-md [&>*]:text-[15px]">
        <button className="border">Logout</button>
        <button className="border">Reload app</button>
        <button className="text-[#ea4a46] bg-[rgba(234,74,70,0.2)] border-0">
          Delete account
        </button>
      </div>
    </main>
  );
}
