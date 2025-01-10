import React, { useState } from "react";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import API from "../services/api";

function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser)
  const role = currentUser.role || "";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log(currentUser);
  const handleSignOutClick = () => {
    setShowPopup(true);
  };
  const handleCancel = () => {
    setShowPopup(false);
  };
  const handleConfirmSignOut = async () => {
    setShowPopup(false);
    try {
      const data = await API.post("/api/auth/signout");

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        console.log("error in logout");
        return;
      }

      dispatch(signOutUserSuccess());
      localStorage.removeItem("accessToken");
      console.log(data);
      console.log(" logout");
      navigate("/login");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const tableRolePath = {
    Admin: "/charts",
    StateHead: "/statehead/table",
    Manager: "/manager/table",
    Employee: "/employee/table",
  };
  const dataRolePath = {
    Admin: "/data",
    StateHead: "/statehead/data",
    Manager: "/manager/data",
    Employee: "/employee/data",
  };
  return (
    <div className="w-screen ">

    
    <div className="  bg-gray-500 mx-1  p-3 justify-center rounded-2xl flex ">
      {/* logo  */}
      <Link
        to="/"
        className="flex w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] gap-5 items-center"
      >
        <img
          src="/images/logo.jpg"
          alt="logo"
          className="w-[40px] h-[40px] rounded-full "
        />
        <span className="w-full hidden lg:block md:flex  font-bold text-white  ">
          Collections{" "}
        </span>
      </Link>
      {/* right */}
      <div className="flex w-[86%] md:w-[92%] lg:w-[84%] xl:w-[84%] justify-end gap-10">
        <div className="flex  items-center ">
          <ul className="flex gap-5 font-semibold text-white cursor-pointer">
            <Link to={tableRolePath[role]}>
              <li>Table</li>
            </Link>
            <Link to={dataRolePath[role]}>
              <li>Data</li>
            </Link>
            {role === "Admin" ? (
              <Link to="/creation/users">
                <li>Creation</li>
              </Link>
            ) : (
              ""
            )}
          </ul>
        </div>
        <div className="flex  items-center">
          <LiaSignOutAltSolid
            className="w-[30px] h-[30px] cursor-pointer text-red-700"
            onClick={handleSignOutClick}
          />
        </div>
      </div>
      </div>
      {/* PopUp  */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to sign out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
