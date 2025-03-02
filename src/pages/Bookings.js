import { useEffect, useState } from "react";
import SuccessTick from "../assets/images/success-tick.png";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Screen from '../components/Screen';
import Arrowright from '../icons/Arrowright';
import Arrowleft from '../icons/Arrowleft';
import Close from "../icons/Close";
import Plus from "../icons/Plus";
import Reset from "../icons/Reset";
import Check from "../icons/Check";
import Cancel from "../icons/Cancel";
import Copy from "../icons/Copy";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getBookings, getBooking } from "../api/bookings";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useUpdateBookingStatus, useDeleteBooking } from "../hooks/useBookings";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Bookings() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorUpdateBookingStatus, handleStatus: handleStatusEdit, handleUpdateBookingStatus, loadingUpdateBookingStatus,
		status: statusEdit, removeUpdateBookingStatusModal, setStatus: setStatusEdit, setRemoveUpdateBookingStatusModal,
		setBookingStatusUniqueId: EditUniqueIdStatus, successUpdateBookingStatus
	} = useUpdateBookingStatus();

	const {
		errorDeleteBooking, handleDeleteBooking, loadingDeleteBooking, removeDeleteBookingModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteBookingModal, successDeleteBooking
	} = useDeleteBooking();

	const [allBooking, setAllBooking] = useState(null);
	const [errorBooking, setErrorBooking] = useState(null);
	const [loadingAllBooking, setLoadingAllBooking] = useState(false);

	const [size, setSize] = useState(20);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllBookings(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllBookings(parseInt(e.target.value), size); };

	async function previousBooking() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllBookings(page - 1, size);
	};

	async function nextBooking() {
		if (page < allBooking.data.pages) setPage(page + 1);
		if (page < allBooking.data.pages) getAllBookings(page + 1, size);
	};

	async function getAllBookings(_page, _size) {
		setAllBooking(null);
		setLoadingAllBooking(true);
		const response = await getBookings(cookie, (_page || page), (_size || size));
		setAllBooking(response.data);
		if (response.error) setErrorBooking(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllBooking(false);
	};

	useEffect(() => {
		if (allBooking === null) {
			getAllBookings();
		}
	}, [allBooking]);

	const [loadingViewBooking, setLoadingViewBooking] = useState(false)
	const [errorViewBooking, setErrorViewBooking] = useState(null)
	const [viewBooking, setViewBooking] = useState(null)

	async function getABooking(unique_id) {
		setLoadingViewBooking(true)
		const response = await getBooking(cookie, { unique_id });
		if (!response.err) {
			setViewBooking(response.data);
			setStatusEdit(response.data.data.booking_status);
		} else { setErrorViewBooking(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewBooking(false)
	};

	if (removeUpdateBookingStatusModal) {
		const modalResponse = document.querySelector("#editBookingModal");
		modalResponse.setAttribute("display", false);
		getAllBookings();
		setRemoveUpdateBookingStatusModal(null);
	}
	if (removeDeleteBookingModal) {
		const modalResponse = document.querySelector("#deleteBookingModal");
		modalResponse.setAttribute("display", false);
		getAllBookings();
		setRemoveDeleteBookingModal(null);
	}

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	const copySomeText = (text) => {
		navigator.clipboard.writeText(text);
	};

	const copyText = (text) => {
		copySomeText(text);
		setCopiedText(true);
		setTimeout(function () {
			setCopiedText(false);
		}, 2000)
	};

	const pageSelectArray = new Array(allBooking ? allBooking.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Bookings</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all bookings</p>
							</div>
						</div>
						{
							loadingAllBooking ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allBooking && allBooking.success && allBooking.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Fullname</th>
														<th className='xui-min-w-150'>Email</th>
														<th className='xui-min-w-150'>Phone Number</th>
														<th className='xui-min-w-150'>Amount</th>
														<th className='xui-min-w-150'>Priority Amount</th>
														<th className='xui-min-w-150'>Total Amount</th>
														<th className='xui-min-w-150'>Proof Image</th>
														<th className='xui-min-w-150'>Topup Proof Image</th>
														<th className='xui-min-w-150'>Booking Status</th>
														<th className='xui-min-w-250'>Created At</th>
														<th className='xui-min-w-250'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allBooking.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.fullname}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.email}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.phone_number ? data.phone_number : "No data"}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.amount.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.priority_amount ? data.priority_amount.toLocaleString() : "No data"}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.total_amount.toLocaleString()}</span>
															</td>
															<td className=''>
																{
																	data.proof_image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.proof_image} alt="Booking Proof Image" />
																			<span title="Copy Image Link" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.proof_image); setTextCopied(data.proof_image); }}>
																				{copiedText && textCopied === data.proof_image ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																			<span title="View File" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.proof_image); }}>
																				<EyeOpen width="16" height="16" />
																			</span>
																		</div>
																}
															</td>
															<td className=''>
																{
																	data.topup_proof_image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.topup_proof_image} alt="Booking Proof Image" />
																			<span title="Copy Image Link" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.topup_proof_image); setTextCopied(data.topup_proof_image); }}>
																				{copiedText && textCopied === data.topup_proof_image ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																			<span title="View File" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.topup_proof_image); }}>
																				<EyeOpen width="16" height="16" />
																			</span>
																		</div>
																}
															</td>
															<td className=''>
																{
																	data.booking_status === "Completed" ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{data.booking_status}</span> : ""
																}
																{
																	data.booking_status === "Processing" ?
																		<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>{data.booking_status}</span> : ""
																}
																{
																	data.booking_status === "Cancelled" ?
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{data.booking_status}</span> : ""
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{new Date(data.createdAt).toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{new Date(data.updatedAt).toLocaleString()}</span>
															</td>
															<td className=''>
																<div className="xui-d-flex xui-grid-gap-1">
																	<button title="Edit Booking" onClick={() => { EditUniqueIdStatus(data.unique_id); getABooking(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editBookingModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Booking" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteBookingModal">
																		<Delete width="16" height="16" />
																	</button>
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div> :
										<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
											<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
												<center className="xui-text-red">
													<Close width="100" height="100" />
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorBooking || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllBooking ?
								<Loading width="12" height="12" /> :
								(
									allBooking && allBooking.success && allBooking.data.rows.length !== 0 ?
										<div className='xui-d-flex xui-flex-jc-flex-end xui-py-1 xui-font-sz-85 xui-opacity-5 xui-mt-1'>
											<div className='xui-d-inline-flex xui-flex-ai-center'>
												<span>Rows per page:</span>
												<select value={size} onChange={handleSize} className='psc-select-rows-per-page xui-ml-half'>
													<option value={20}>20</option>
													<option value={50}>50</option>
													<option value={100}>100</option>
													<option value={500}>500</option>
													<option value={1000}>1000</option>
												</select>
											</div>
											<div className='xui-mx-1 xui-lg-mx-2'>
												<span><span className='xui-font-w-bold'><select value={page} onChange={handlePage} className='psc-select-rows-per-page xui-ml-half'>
													{
														pageSelectArray.map((value, index) => {
															return (
																<option key={index + 1} value={index + 1}>{index + 1}</option>
															)
														})
													}
												</select></span> of {allBooking ? allBooking.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousBooking}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextBooking}>
													<Arrowright width="18" height="18" />
												</div>
											</div>
										</div> :
										""
								)
						}
					</section>
				</Content>
			</Screen>
			<section className='xui-modal' xui-modal="deleteBookingModal" id="deleteBookingModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Booking</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteBooking}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteBooking}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteBooking} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteBooking ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteBooking ? "" : "deleteBookingModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editBookingModal" id="editBookingModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-500 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editBookingModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewBooking ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewBooking && viewBooking.success ?
									<>
										<h1>Edit Booking</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<select value={statusEdit} onChange={handleStatusEdit} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80'>
														<option value={"Cancelled"}>Cancelled</option>
														<option value={"Completed"}>Completed</option>
														<option value={"Processing"}>Processing</option>
													</select>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdateBookingStatus} disabled={loadingUpdateBookingStatus} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateBookingStatus ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateBookingStatus}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateBookingStatus}</span></p>
											</div>
										</form>
									</> :
									<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
										<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
											<center className="xui-text-red">
												<Close width="100" height="100" />
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewBooking}</h3>
											</center>
										</div>
									</div>
							)
					}
				</div>
			</section>
		</>
	);

}
