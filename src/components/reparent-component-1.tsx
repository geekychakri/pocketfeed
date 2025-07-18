"use client";

import * as portals from "react-reverse-portal";

const ComponentA = (props) => {
  return (
    <div>
      Component A
      <portals.OutPortal node={props.portalNode} />
    </div>
  );
};

export default ComponentA;
