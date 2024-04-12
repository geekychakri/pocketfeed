import React, { useEffect, useState } from "react";

type IState = {
  whenOnline?: React.ReactNode;
  whenOffline?: React.ReactNode;
  startOnline?: boolean;
};

const defaultState: IState = {
  whenOnline: "online",
  whenOffline: "offline",
  startOnline: true,
};

function useNavigatorOnline(state: IState = {}) {
  const { whenOnline, whenOffline, startOnline } = {
    ...defaultState,
    ...state,
  };

  const [value, setValue] = useState(startOnline);

  useEffect(() => {
    if (window.navigator.onLine !== value) {
      setValue(window.navigator.onLine);
      return;
    }

    function handleOnlineStatus() {
      setValue(window.navigator.onLine);
    }

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, [value, setValue]);

  const isOnline = value === true;
  const isOffline = value === false;
  const status = isOnline ? whenOnline : whenOffline;

  return { status, isOnline, isOffline };
}

export { useNavigatorOnline };
