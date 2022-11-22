import { FiUser } from "react-icons/fi";
import { Outlet } from "react-router-dom";

export const BaseLayout: React.FC = () => {
  return (
    <div className="max-w-[100vw] min-h-screen flex items-center flex-col">
      <header className="bg-purple-700 w-full flex items-center justify-between py-5 px-9 text-white print:hidden">
        <span className="text-xl font-bold">IBGE</span>

        <FiUser size={25} />
      </header>

      <div className="p-2 w-full flex flex-col items-center">
        <Outlet />
      </div>
    </div>
  );
};
