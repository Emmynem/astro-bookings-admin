import axios from 'axios';
import { config } from '../config';

const getBookings = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/bookings?page=${page}&size=${size}`,
			{
				headers: {
					'astrobookings-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const searchBookings = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
				`${config.baseAPIurl}/root/search/bookings?page=${page}&size=${size}&search=${payload.search}`,
			{
				headers: {
					'astrobookings-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getBookingsViaUser = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
				`${config.baseAPIurl}/root/bookings/via/user?page=${page}&size=${size}&user_unique_id=${payload.user_unique_id}`,
			{
				headers: {
					'astrobookings-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getBookingsViaStatus = async function (key, page, size, payload) {
	try {
		const response = await axios.get(
				`${config.baseAPIurl}/root/bookings/via/status?page=${page}&size=${size}&stake_status=${payload.stake_status}`,
			{
				headers: {
					'astrobookings-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getBooking = async function (key, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/booking?unique_id=${payload.unique_id}`,
			{
				headers: {
					'astrobookings-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const updateBookingStatus = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/update/booking/status`,
			{
				...payload
			},
			{
				headers: {
					'astrobookings-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const deleteBooking = async function (key, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/root/booking`,
			{
				data: {
					key,
					...payload
				}
			},
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

export {
	getBookings, getBookingsViaUser, getBooking, searchBookings, getBookingsViaStatus, updateBookingStatus, deleteBooking
};