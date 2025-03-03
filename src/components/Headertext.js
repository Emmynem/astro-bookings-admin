import { useLocation } from "react-router-dom";

export default function Headertext() {
    const loc = useLocation();

    if (loc.pathname === `/internal/dashboard`) {
        return "Dashboard";
    } else if (loc.pathname === `/internal/users`) {
        return "Astronauts";
    } else if (loc.pathname === `/internal/user/add`) {
        return "Add Astronaut";
    } else if (loc.pathname === `/internal/user/edit/details`) {
        return "Edit Astronaut Details";
    } else if (loc.pathname === `/internal/bookings`) {
        return "Bookings"
    } else if (loc.pathname === `/internal/app/defaults`) {
        return "Defaults";
    } else if (loc.pathname === `/internal/settings`) {
        return "Settings";
    } else {
        return "Page not found";
    }
}