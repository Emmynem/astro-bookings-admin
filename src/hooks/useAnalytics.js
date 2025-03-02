import { useState, useEffect } from "react";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getUserAnalytics as GetUserAnalytics, getBookingAnalytics as GetBookingAnalytics } from "../api/analytics";

const useGetAnalytics = () => {
	const { cookie, forceLogout } = useCookie(config.key, "");

	const [userAnalytics, setUserAnalytics] = useState(null);
	const [bookingAnalytics, setBookingAnalytics] = useState(null);

	async function getUserAnalytics() {
		const response = await GetUserAnalytics(cookie);
		setUserAnalytics(response.data);
		// if (response.response_code === 403) forceLogout();
	}

	async function getBookingAnalytics() {
		const response = await GetBookingAnalytics(cookie);
		setBookingAnalytics(response.data);
		// if (response.response_code === 403) forceLogout();
	}

	useEffect(() => {
		if (userAnalytics === null) {
			getUserAnalytics();
		}
		if (bookingAnalytics === null) {
			getBookingAnalytics();
		}
	}, [userAnalytics, bookingAnalytics]);

	return { userAnalytics, bookingAnalytics, getUserAnalytics, getBookingAnalytics }
};

export { useGetAnalytics };