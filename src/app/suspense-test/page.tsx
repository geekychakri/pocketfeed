import { Suspense } from "react";

const test = true;

export default function SuspenseTest() {
  if (test) {
    return <div>Null</div>;
  }
  return (
    <div>
      <Suspense fallback="Loading...">
        <ParentComponent>
          <ChildComponent />
        </ParentComponent>
      </Suspense>
    </div>
  );
}

function ParentComponent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

async function ChildComponent() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await res.json();
  console.log({ data: data.splice(0, 5) });
  return <div>Child component</div>;
}
