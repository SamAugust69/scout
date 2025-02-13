import React, {
  cloneElement,
  createContext,
  HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

// design/naming scheme heavily inspired by shad/cn
// https://ui.shadcn.com/docs/components/dropdown-menu

// code original to this project

const DropdownContext = createContext<
  | {
      isOpen: boolean;
      toggleOpen: () => void;
    }
  | undefined
>(undefined);

interface DropdownInterface {
  children: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
}

const Dropdown = ({
  children,
  onOpen,
  onClose,
  className,
}: DropdownInterface) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    !isOpen ? onOpen && onOpen() : onClose && onClose();
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn`w-fit relative ${className}`}>
      <DropdownContext.Provider value={{ isOpen, toggleOpen }}>
        {children}
      </DropdownContext.Provider>
    </div>
  );
};

interface DropdownButtonInterface {
  children: React.ReactElement;
}

const DropdownButton = ({ children }: DropdownButtonInterface) => {
  const context = useContext(DropdownContext);

  if (context === undefined) throw new Error("Context issue, dropdown context");
  const { toggleOpen } = context;

  return cloneElement(children, {
    onClick: toggleOpen,
    className: `${children.props.className} relative`,
  });
};

interface DropdownOverlayInterface {
  children?: React.ReactNode;
}

const DropdownOverlay = ({ children }: DropdownOverlayInterface) => {
  const context = useContext(DropdownContext);

  if (context === undefined) throw new Error("Context issue, dropdown context");
  const { toggleOpen } = context;

  return (
    <div onClick={toggleOpen} className="fixed w-full h-full top-0 left-0">
      {children}
    </div>
  );
};

interface DropdownContentInterface extends HTMLAttributes<HTMLDivElement> {}

const DropdownContent = ({ children, className }: DropdownContentInterface) => {
  const context = useContext(DropdownContext);

  if (context === undefined) throw new Error("Context issue, dropdown context");

  const { isOpen } = context;

  const contentRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const updatePos = () => {
    const boundingBox = contentRef.current?.getBoundingClientRect();

    if (boundingBox === undefined) return;

    var newStyle = {};

    console.log(boundingBox);

    // bottom Y bounds
    if (boundingBox?.top + boundingBox?.height > window.innerHeight)
      newStyle = { ...newStyle, bottom: "100%" };

    if (boundingBox.x < 0)
      newStyle = { ...newStyle, left: `${0 + boundingBox.width / 2}px` };

    setStyle(newStyle);
  };

  useEffect(() => {
    setStyle({});
    if (isOpen) updatePos();
  }, [isOpen]);

  if (isOpen)
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "absolute left-1/2 z-30 -translate-x-1/2 mt-1 w-52 bg-neutral-100 rounded-sm border border-neutral-200 shadow-md p-2 flex flex-col ",
            className
          )}
          style={style}
          ref={contentRef}
        >
          {children}
        </motion.div>
        <DropdownOverlay />
      </>
    );
};

interface DropdownTitleInterface extends HTMLAttributes<HTMLHeadingElement> {}

const DropdownTitle = ({ children }: DropdownTitleInterface) => {
  return (
    <h2 className="font-semibold text-sm text-neutral-900 py-1">{children}</h2>
  );
};

interface DropdownDividerInterface extends HTMLAttributes<HTMLSpanElement> {}

const DropdownDivider = ({ className, ...props }: DropdownDividerInterface) => {
  return (
    <span
      className={`-mx-2 my-1 h-px bg-neutral-200  ${className}`}
      {...props}
    />
  );
};

const RadioGroupContext = createContext<
  | {
      state: any;
      setState: (value: React.SetStateAction<any>) => void;
    }
  | undefined
>(undefined);

interface DropdownRadioGroupInterface extends HTMLAttributes<HTMLDivElement> {
  value: any;
  setValue: React.SetStateAction<any>;
}

const DropdownRadioGroup = ({
  children,
  value,
  setValue,
}: DropdownRadioGroupInterface) => {
  return (
    <RadioGroupContext.Provider value={{ state: value, setState: setValue }}>
      {" "}
      <div className="flex flex-col gap-2">{children}</div>
    </RadioGroupContext.Provider>
  );
};

interface DropdownRadioButtonInterface
  extends HTMLAttributes<HTMLButtonElement> {
  value: any;
}

const DropdownRadioButton = ({
  children,
  value,
  ...props
}: DropdownRadioButtonInterface) => {
  const context = useContext(RadioGroupContext);

  if (context === undefined) throw new Error("Context issue, dropdown context");

  const { setState, state } = context;

  return (
    <button
      className="transition-colors text-left flex hover:bg-neutral-200 text-neutral-800 disabled:text-neutral-600 rounded-sm items-center font-medium h-8 text-sm "
      onClick={() => setState(value)}
      {...props}
    >
      <div
        className={`${
          value === state ? "visible" : "invisible"
        } rounded-full w-[3.5px] h-[3.5px] bg-neutral-800 mx-4`}
      ></div>
      {children}
    </button>
  );
};

interface DropdownIconInterface {
  children: React.ReactElement;
}

const DropdownIcon = ({ children }: DropdownIconInterface) => {
  return cloneElement(children, {
    className: `absolute right-4 w-6 text-neutral-600`,
  });
};

interface DropdownItemInterface extends HTMLAttributes<HTMLButtonElement> {}

const DropdownItem = ({ children }: DropdownItemInterface) => {
  return (
    <button className="transition-colors text-left flex hover:bg-neutral-200 text-neutral-800 rounded-sm items-center font-medium h-8 text-sm px-2 ">
      {children}
    </button>
  );
};

export {
  Dropdown,
  DropdownButton,
  DropdownContent,
  DropdownDivider,
  DropdownTitle,
  DropdownRadioGroup,
  DropdownRadioButton,
  DropdownItem,
  DropdownIcon,
};
