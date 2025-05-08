export default function Feedback() {
  return (
    <main className="flex flex-col gap-6 max-w-96 w-full mx-auto py-20">
      <div className="flex flex-col gap-4">
        <h1 className="font-medium text-xl">Hey, Geeky!</h1>
        <p className="leading-relaxed text-gray-500">
          We would love to get your feedback, ideas and feelings about Pocket
          Feed. This helps us improve the product and make it better for
          everyone. Let us know what you think!
        </p>
      </div>
      <div className="flex flex-col gap-5 *:self-start">
        <a href="#" className="custom-underline">
          Feature Requests
        </a>
        <a href="#" className="custom-underline">
          Changelog
        </a>
        <a href="#" className="custom-underline">
          Get in touch
        </a>
      </div>
    </main>
  );
}
