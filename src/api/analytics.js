import axios from 'axios';
import { config } from '../config';

const getUserAnalytics = async function (key) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/user/stats`,
			{
				headers: {
					'astrobookings-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error };
	}
};

const getBookingAnalytics = async function (key) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/booking/stats`,
			{
				headers: {
					'astrobookings-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error };
	}
};

export { getUserAnalytics, getBookingAnalytics };