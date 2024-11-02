import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="max-w-lg mx-auto mt-7 mb-20 px-3 py-5 rounded-md bg-[#4338CA]">
      <ul className="flex items-center justify-between">
        <li className="text-white duration-200 font-semibold text-lg ">
          <NavLink to="/">Home</NavLink>
        </li>
        <ul className="flex gap-5">
          <li className="text-white duration-200 font-semibold text-lg">
            <NavLink to="/login">Login</NavLink>
          </li>
          <li className="text-white duration-200 font-semibold text-lg">
            <NavLink to="/register">Register</NavLink>
          </li>
        </ul>
      </ul>
    </nav>
  );
};

export default Navbar;
