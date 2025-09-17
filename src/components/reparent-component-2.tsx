"use client";

import * as portals from "react-reverse-portal";

const ComponentB = (props: any) => {
  return (
    <div>
      Component B
      <portals.OutPortal node={props.portalNode} />
    </div>
  );
};
export default ComponentB;
