import axios from 'axios';
import { config } from '../config';

const getUsers = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/users?page=${page}&size=${size}`,
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

const getUser = async function (key, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/user?unique_id=${payload.unique_id}`,
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

const createUser = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/create/user`,
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

const updateUserDetails = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/update/details`,
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

const updateUserDescription = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/update/description`,
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

const updateUserProfileImage = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/update/profile/image`,
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

const deleteUser = async function (key, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/root/user`,
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
	getUsers, getUser, createUser, updateUserDetails, updateUserDescription, updateUserProfileImage, deleteUser
};