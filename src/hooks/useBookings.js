import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { updateBookingStatus, deleteBooking } from "../api/bookings";

const useUpdateBookingStatus = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateBookingStatus, setLoadingUpdateBookingStatus] = useState(false);
	const [removeUpdateBookingStatusModal, setRemoveUpdateBookingStatusModal] = useState(null);
	const [bookingStatusUniqueId, setBookingStatusUniqueId] = useState(null);
	const [status, setStatus] = useState(null);

	const handleStatus = (e) => { e.preventDefault(); setStatus(e.target.value); };

	const [errorUpdateBookingStatus, setErrorUpdateBookingStatus] = useState(null);
	const [successUpdateBookingStatus, setSuccessUpdateBookingStatus] = useState(null);

	const handleUpdateBookingStatus = () => {

		if (!loadingUpdateBookingStatus) {
			if (!bookingStatusUniqueId) {
				setErrorUpdateBookingStatus(null);
				setSuccessUpdateBookingStatus(null);
				setErrorUpdateBookingStatus("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateBookingStatus(null);
				}, 2500)
			} else if (!status) {
				setErrorUpdateBookingStatus("Status is required");
				setTimeout(function () {
					setErrorUpdateBookingStatus(null);
				}, 2500)
			} else {
				setLoadingUpdateBookingStatus(true);

				const updateBookingStatusRes = updateBookingStatus(cookie, {
					unique_id: bookingStatusUniqueId,
					booking_status: status,
				})

				updateBookingStatusRes.then(res => {
					setLoadingUpdateBookingStatus(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateBookingStatus(error);
							setTimeout(function () {
								setErrorUpdateBookingStatus(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateBookingStatus(error);
							setTimeout(function () {
								setErrorUpdateBookingStatus(null);
							}, 2000)
						}
					} else {
						setErrorUpdateBookingStatus(null);
						setSuccessUpdateBookingStatus(`Booking status updated successfully!`);

						setTimeout(function () {
							setSuccessUpdateBookingStatus(null);
							setRemoveUpdateBookingStatusModal(true);
							setBookingStatusUniqueId(null);
							setStatus(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateBookingStatus(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateBookingStatus, removeUpdateBookingStatusModal, bookingStatusUniqueId, errorUpdateBookingStatus, successUpdateBookingStatus,
		handleUpdateBookingStatus, setRemoveUpdateBookingStatusModal, setBookingStatusUniqueId, setStatus, handleStatus, status
	};
};

const useDeleteBooking = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDeleteBooking, setLoadingDeleteBooking] = useState(false);
	const [removeDeleteBookingModal, setRemoveDeleteBookingModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteBooking, setErrorDeleteBooking] = useState(null);
	const [successDeleteBooking, setSuccessDeleteBooking] = useState(null);

	const handleDeleteBooking = () => {

		if (!loadingDeleteBooking) {
			if (!uniqueId) {
				setErrorDeleteBooking(null);
				setSuccessDeleteBooking(null);
				setErrorDeleteBooking("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteBooking(null);
				}, 2500)
			} else {
				setLoadingDeleteBooking(true);

				const deleteBookingRes = deleteBooking(cookie, {
					unique_id: uniqueId
				})

				deleteBookingRes.then(res => {
					setLoadingDeleteBooking(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteBooking(error);
							setTimeout(function () {
								setErrorDeleteBooking(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteBooking(error);
							setTimeout(function () {
								setErrorDeleteBooking(null);
							}, 2000)
						}
					} else {
						setErrorDeleteBooking(null);
						setSuccessDeleteBooking(`Booking deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteBooking(null);
							setRemoveDeleteBookingModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteBooking(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteBooking, removeDeleteBookingModal, errorDeleteBooking, successDeleteBooking, handleDeleteBooking,
		setRemoveDeleteBookingModal, setUniqueId
	};
};

export { useUpdateBookingStatus, useDeleteBooking };