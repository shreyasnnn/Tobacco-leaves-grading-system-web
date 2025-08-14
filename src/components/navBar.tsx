import React, { useState } from "react";
import { Button } from "../components/button/index";
import { Menu, X, LeafIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3 md:px-[10%]">
        {/* Logo */}
        <div className="flex flex-row gap-1 text-xl font-bold">
        <LeafIcon />
          ToboGradre
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Button variant="empty" className="hover:bg-gray-50 rounded-xl" onClick={()=>navigate("/")}>Home</Button>
          <Button variant="empty" className="hover:bg-gray-50 rounded-xl" onClick={()=>navigate("/history")}>History</Button>
          <Button variant="empty" className="hover:bg-gray-50 rounded-xl" onClick={()=>navigate("/analysis")}>Analytics</Button>
          <Button variant="empty" className="hover:bg-gray-50 rounded-xl" >About</Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className=" focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-start px-6 pb-4 space-y-2 bg-white">
          <Button variant="empty" className="w-full text-left hover:bg-gray-50" onClick={()=>navigate("/")}>
            Home
          </Button>
          <Button variant="empty" className="w-full text-left hover:bg-gray-50" onClick={()=>navigate("/history")}>
            History
          </Button>
          <Button variant="empty" className="w-full text-left hover:bg-gray-50" onClick={()=>navigate("/analytics")}>
            Analytics
          </Button>
          <Button variant="empty" className="w-full text-left hover:bg-gray-50" >
            About
          </Button>
        </div>
      )}
    </nav>
  );
}
