export default function Home() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-36 py-24">
      <header className="flex flex-col gap-14">
        <h1 className="text-7xl tracking-tight text-center font-medium">
          All of your favorite content in one place.
        </h1>
        <div className="self-center flex gap-7 font-medium">
          <button className="bg-primary text-white text-xl px-6 py-3 rounded-lg">
            Join for free
          </button>
          <button className="text-xl">Watch Demo</button>
        </div>
      </header>
      <main className="flex flex-col gap-36">
        <section className="grid grid-cols-5 grid-rows-5 gap-5">
          <div className="col-span-2 row-span-3 rounded-lg border p-4">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
          </div>
          <div className="col-span-3 row-span-6 col-start-3 rounded-lg border p-4">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur,
              cupiditate.
            </p>
          </div>
          <div className="col-span-2 row-span-3 row-start-4 rounded-lg border p-4">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit</p>
          </div>
        </section>
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl flex flex-col text-center">
            <span>Priced to make an impact on your time and attention,</span>
            <span>not on your wallet.</span>
          </h2>
          <div className="flex gap-4">
            <div className="flex-1 border rounded-lg p-3">Monthly</div>
            <div className="flex-1 border rounded-lg p-3">Annually</div>
          </div>
        </section>
      </main>
      <footer className="">Made with love by GeekyChakri</footer>
    </div>
  );
}
