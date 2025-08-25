import React, { useState } from "react";
import { Button } from "../components/button/index";
import { Menu, X, LeafIcon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-b from-green-50 to-white">
      <div className="flex items-center justify-between px-6 py-4 md:px-[10%]">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer flex flex-row items-center gap-2 text-xl font-bold text-green-800"
        >
          <LeafIcon className="text-green-600" />
          ToboGrade
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          <Button
            variant="empty"
            className="hover:bg-green-100 rounded-xl"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            variant="empty"
            className="hover:bg-green-100 rounded-xl"
            onClick={() => navigate("/history")}
          >
            History
          </Button>
          <Button
            variant="empty"
            className="hover:bg-green-100 rounded-xl"
            onClick={() => navigate("/analysis")}
          >
            Analytics
          </Button>
          <Button variant="empty" className="hover:bg-green-100 rounded-xl" onClick={()=>navigate("/about")}>
            About
          </Button>

          {/* Log Out Button */}
          <Button
            variant="empty"
            onClick={handleLogout}
            className="rounded-xl hover:bg-green-600 hover:text-white flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-start px-6 pb-4 space-y-2 bg-gradient-to-b from-green-50 to-white">
          <Button
            variant="empty"
            className="w-full text-left hover:bg-green-100"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            variant="empty"
            className="w-full text-left hover:bg-green-100"
            onClick={() => navigate("/history")}
          >
            History
          </Button>
          <Button
            variant="empty"
            className="w-full text-left hover:bg-green-100"
            onClick={() => navigate("/analysis")}
          >
            Analytics
          </Button>
          <Button variant="empty" className="w-full text-left hover:bg-green-100" onClick={() => navigate("/about")}>
            About
          </Button>

          {/* Log Out Button - Mobile */}
          <Button
            variant="empty"
            onClick={handleLogout}
            className="w-full text-left hover:bg-green-600 hover:text-white flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
