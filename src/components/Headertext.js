import { useLocation } from "react-router-dom";

export default function Headertext() {
    const loc = useLocation();

    if (loc.pathname === `/internal/dashboard`) {
        return "Dashboard";
    } else if (loc.pathname === `/internal/users`) {
        return "Users";
    } else if (loc.pathname === `/internal/user/add`) {
        return "Add User";
    } else if (loc.pathname === `/internal/user/edit/details`) {
        return "Edit User Details";
    } else if (loc.pathname === `/internal/bookings`) {
        return "Bookings"
    } else if (loc.pathname === `/internal/settings`) {
        return "Settings";
    } else {
        return "Page not found";
    }
}