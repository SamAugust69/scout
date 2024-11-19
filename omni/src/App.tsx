import { Navbar } from "@/components/Navbar";
import { useLocalStorage } from "@/lib/context/useLocalStorage";
import { DarkModeContext } from "@/lib/context/darkmode";

function App() {
  const [dark, setDark] = useLocalStorage<boolean>(false, "theme");

  return (
    <DarkModeContext.Provider value={{ dark: dark || false, setDark }}>
      <div className="flex h-screen" data-mode={dark ? "dark" : "light"}>
        <Navbar />
        <div className="p-4 w-full bg-neutral-100 dark:bg-[#272424]"></div>
      </div>
    </DarkModeContext.Provider>
  );
}

export default App;
