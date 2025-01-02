"use client";
import { useUser } from "@clerk/clerk-react";
import { Instrument_Serif } from "next/font/google";

const InstrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  console.log(user?.username);

  return (
    <div className="flex flex-col items-center justify-center gap-32 py-20">
      <header className="flex flex-col gap-14">
        <div className="flex flex-col gap-4">
          <h1
            className={`flex gap-4 text-center text-8xl leading-none tracking-tight ${InstrumentSerif.className}`}
          >
            <span>
              Less <span>Chaos</span>.
            </span>
            {/* <span className={`text-[#f84f39] ${InstrumentSerif.className}`}>
            content
          </span> */}
            <span>
              More <span className="text-primary">Focus</span>.
            </span>
          </h1>
          <h2 className="text-center text-2xl text-gray-400">
            All of your favorite content in one place.
          </h2>
        </div>

        <div className="flex gap-7 self-center">
          <button className="w-56 rounded-md bg-[#181818] px-6 py-3 text-xl font-medium text-white">
            Join for free
          </button>
          {/* <button className="text-xl">Watch Demo</button> */}
        </div>
      </header>
      <main className="flex flex-col gap-36">
        <section className="grid grid-cols-5 grid-rows-5 gap-5">
          <div className="col-span-2 row-span-3 rounded-lg border p-4">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
          </div>
          <div className="col-span-3 col-start-3 row-span-6 rounded-lg border p-4">
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
          <h2 className="flex flex-col text-center text-2xl">
            <span>Priced to make an impact on your time and attention,</span>
            <span>not on your wallet.</span>
          </h2>
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border p-3">Monthly</div>
            <div className="flex-1 rounded-lg border p-3">Annually</div>
          </div>
        </section>
      </main>
      <footer className="">Made with love by GeekyChakri</footer>
    </div>
  );
}
