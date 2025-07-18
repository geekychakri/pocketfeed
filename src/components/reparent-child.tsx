"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import * as portals from "react-reverse-portal";

import ComponentA from "./reparent-component-1";
import ComponentB from "./reparent-component-2";

const ReparentChild = () => {
  const pathname = usePathname();

  const [count, setCount] = useState(0);

  const [shouldRenderTable, setShouldRenderTable] = useState(false);

  useEffect(() => {
    setShouldRenderTable(true);
  }, []);

  const portalNode = useMemo(() => {
    if (!shouldRenderTable) {
      return null;
    }
    console.log("PORTAL NODE RENDERED");
    return portals.createHtmlPortalNode();
  }, [shouldRenderTable]);

  console.log({ portalNode });

  if (!portalNode) {
    return null;
  }

  return (
    <div>
      {portalNode && (
        <>
          <portals.InPortal node={portalNode}>
            <p>Count - {count}</p>
            <button onClick={() => setCount((c) => c + 1)}>Increase</button>
          </portals.InPortal>
        </>
      )}

      <p>Outer OutPortal:</p>

      {/* {portalNode && pathname === "/bookmarks" ? (
        <ReparentComponent1 portalNode={portalNode} />
      ) : (
        <ReparentComponent2 portalNode={portalNode} />
      )} */}

      {portalNode && pathname === "/bookmarks" ? (
        <ComponentB portalNode={portalNode} />
      ) : (
        <ComponentA portalNode={portalNode} />
      )}
    </div>
  );
};

// const ComponentA = (props) => {
//   return (
//     <div>
//       {/* ... Some more UI ... */}

//       {/* Show the content of the portal node here: */}
//       <portals.OutPortal node={props.portalNode} />
//     </div>
//   );
// };

// function ReparentComponent2(props) {
//   return <portals.OutPortal node={props.portalNode} />;
// }

export default ReparentChild;
