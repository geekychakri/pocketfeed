import { createContext } from "react";

interface MobileNavContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SidebarContext = createContext<MobileNavContextType | undefined>(
  undefined,
);
