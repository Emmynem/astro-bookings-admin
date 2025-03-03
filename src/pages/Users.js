import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { getUsers, getUser } from "../api/users";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useDeleteUser } from "../hooks/useUsers";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Users() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorDeleteUser, handleDeleteUser, loadingDeleteUser, removeDeleteUserModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteUserModal, successDeleteUser
	} = useDeleteUser();

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	const [allUser, setAllUser] = useState(null);
	const [errorUser, setErrorUser] = useState(null);
	const [loadingAllUser, setLoadingAllUser] = useState(false);

	const [size, setSize] = useState(20);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllUsers(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllUsers(parseInt(e.target.value), size); };

	async function previousUser() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllUsers(page - 1, size);
	};

	async function nextUser() {
		if (page < allUser.data.pages) setPage(page + 1);
		if (page < allUser.data.pages) getAllUsers(page + 1, size);
	};

	async function getAllUsers(_page, _size) {
		setAllUser(null);
		setLoadingAllUser(true);
		const response = await getUsers(cookie, (_page || page), (_size || size));
		setAllUser(response.data);
		if (response.error) setErrorUser(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllUser(false);
	};

	useEffect(() => {
		if (allUser === null) {
			getAllUsers();
		}
	}, [allUser]);

	const [loadingViewUser, setLoadingViewUser] = useState(false)
	const [errorViewUser, setErrorViewUser] = useState(null)
	const [viewUser, setViewUser] = useState(null)

	async function getAUser(unique_id) {
		setLoadingViewUser(true)
		const response = await getUser(cookie, { unique_id });
		if (!response.err) {
			setViewUser(response.data);
		} else { setErrorViewUser(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewUser(false)
	};

	if (removeDeleteUserModal) {
		const modalResponse = document.querySelector("#deleteUserModal");
		modalResponse.setAttribute("display", false);
		getAllUsers();
		setRemoveDeleteUserModal(null);
	}

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

	const pageSelectArray = new Array(allUser ? allUser.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Astronauts</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all astronauts</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<Link to={`/internal/user/add`} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80">
										<span className="xui-mr-half">Add Astronaut</span>
										<Plus width="15" height="15" />
									</Link>
								</div>
							</div>
						</div>
						{
							loadingAllUser ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allUser && allUser.success && allUser.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Fullname</th>
														<th className='xui-min-w-100'>Fee</th>
														<th className='xui-min-w-100'>Priority Fee</th>
														<th className='xui-min-w-150'>Image</th>
														<th className='xui-min-w-250'>Created At</th>
														<th className='xui-min-w-250'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allUser.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.fullname}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.fee.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.priority_fee ? data.priority_fee.toLocaleString() : "No priority fee"}</span>
															</td>
															<td className=''>
																{
																	data.profile_image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.profile_image} alt="User Image" />
																			<span title="Copy Image Link" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.profile_image); setTextCopied(data.profile_image); }}>
																				{copiedText && textCopied === data.profile_image ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																			<span title="View File" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.profile_image); }}>
																				<EyeOpen width="16" height="16" />
																			</span>
																		</div>
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
																	<Link to={`/internal/user/edit/details?unique_id=${data.unique_id}`} className="xui-text-dc-none xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50">
																		<Edit width="20" height="20" />
																	</Link>
																	<button title="Delete User" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteUserModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorUser || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllUser ?
								<Loading width="12" height="12" /> :
								(
									allUser && allUser.success && allUser.data.rows.length !== 0 ?
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
												</select></span> of {allUser ? allUser.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousUser}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextUser}>
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
			<section className='xui-modal' xui-modal="deleteUserModal" id="deleteUserModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Astronaut</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteUser}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteUser}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteUser} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteUser ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteUser ? "" : "deleteUserModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);

}
