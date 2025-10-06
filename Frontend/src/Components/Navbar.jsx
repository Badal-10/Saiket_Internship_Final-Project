import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
const logo = "/Logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState(localStorage.getItem("adminName") || "");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);
  const menuRef = useRef(null);

  // Sync whenever localStorage changes OR route changes
  useEffect(() => {
    const syncName = () => setAdminName(localStorage.getItem("adminName") || "");
    syncName(); // run immediately
    window.addEventListener("storage", syncName);
    return () => window.removeEventListener("storage", syncName);
  }, []);

  useEffect(() => {
    // re-check whenever navigating (important for logout redirect)
    setAdminName(localStorage.getItem("adminName") || "");
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    setMenuOpen(false);
    setAdminName(""); // 🔑 force re-render
    navigate("/", { replace: true });
  };

  return (
    <nav className="flex justify-between items-center fixed left-0 right-0 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#12c2e9] via-[#c471ed] to-[#f64f59] z-40">
      {adminName ? (
        <div className="flex items-center gap-1 sm:gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8 sm:h-12 sm:w-12 rounded-full shadow-lg" />
          <span className="text-xl sm:text-3xl font-bold">CrewControl</span>
        </div>
      ) : (
        <Link to="/" className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Logo" className="h-8 w-8 sm:h-12 sm:w-12 rounded-full shadow-lg" />
          <span className="text-xl sm:text-3xl font-bold">CrewControl</span>
        </Link>
      )}

      <div className="flex items-center gap-2 sm:gap-4">
        {adminName ? (
          <>
            <div ref={ref} className="relative hidden sm:block">
              <button
                onClick={() => setOpen((s) => !s)}
                className="px-4 py-2 bg-white/20 rounded-full"
              >
                👋 {adminName}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow z-50">
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden px-2 py-1 bg-white/20 rounded"
            >
              ☰
            </button>
            {menuOpen && (
              <div ref={menuRef} className="absolute top-full right-0 mt-1 w-48 bg-white text-black rounded shadow z-50 sm:hidden">
                <div className="px-4 py-2 border-b">👋 {adminName}</div>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="hidden sm:block">
            <Link to="/" className="px-3 py-1">Home</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
