import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { config } from "./config";
import useCookie from "./hooks/useCookie";
import Layout from "./pages/Layout";
import Access from "./pages/Access";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import SignIn from "./pages/auth/SignIn";
import Bookings from "./pages/Bookings";
import AddUser from "./pages/AddUser";
import EditUserDetails from "./pages/EditUserDetails";
import AppDefaults from "./pages/AppDefaults";

export default function App(){
  const {cookie} = useCookie(config.key, "");

  return(
    <BrowserRouter>
      <Routes>
        <Route path='/internal' element={<Layout />}>
          <Route path="dashboard" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Dashboard />)
          } />
          <Route path="app/defaults" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<AppDefaults />)
          } />
          <Route path="users" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Users />)
          } />
          <Route path="bookings" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Bookings />)
          } />
          <Route path="user/add" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<AddUser />)
          } />
          <Route path="user/edit/details" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<EditUserDetails />)
          } />
          <Route path="*" element={<Navigate replace to={"dashboard"} />} />
        </Route>
        <Route path='/' element={<Access />}>
          <Route index element={<SignIn />} />
          <Route path="signin" element={
            cookie && cookie !== '' && cookie !== '[object Object]' ?
              (<Navigate replace to={"/internal/dashboard"} />) :
              (<SignIn />)
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}