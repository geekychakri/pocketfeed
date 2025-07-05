import { testAction } from "@/app/actions";
import { useTestStore } from "@/store/test-store";
export default function TestChild() {
  console.log("CHILD RENDER");
  const { fish, setFish } = useTestStore();
  return (
    <div>
      Fish - {fish}
      <button onClick={setFish}>Set fish</button>
      {/* <button
        onClick={async () => {
          const msg = await testAction();
          console.log({ msg });
        }}
      >
        Action Button
      </button> */}
      <form
        action={async () => {
          const msg = await testAction();
          console.log({ msg });
        }}
      >
        <button type="submit">Action Form</button>
      </form>
    </div>
  );
}
