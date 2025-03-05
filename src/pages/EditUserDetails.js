import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
// import BundledEditor from '../BundledEditor';
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getUsers, getUser } from "../api/users";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useUploadProfileImage, useUserDescription, useUserDetails } from "../hooks/useUsers";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function EditUserDetails() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const unique_id = searchParams.get("unique_id");

	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorDescriptionRef = useRef(null);

	const [showConfirmUpdateUserDescription, setShowConfirmUpdateUserDescription] = useState(false);

	const {
		errorUserDetails, fee, fullname, handleFee, handleFullname, handlePriorityFee, handleUserDetails, loadingUserDetails, priorityFee, removeUserDetailsModal, 
		setFee, setFullname, setPriorityFee, setRemoveUserDetailsModal, setUserUniqueId: UpdateUserDetailsSetUniqueId, successUserDetails
	} = useUserDetails();

	const {
		description, errorUserDescription, handleDescription, handleUserDescription, loadingUserDescription, removeUserDescriptionModal, setDescription, setRemoveUserDescriptionModal, 
		setUserUniqueId: UpdateUserDescriptionSetUniqueId, successUserDescription
	} = useUserDescription();

	const {
		errorProfileImage, handleUploadProfileImage, loadingProfileImage, removeProfileImageModal, selectedProfileImage, setRemoveProfileImageModal, setSelectedProfileImage, 
		setUniqueId: UpdateUserProfileImageSetUniqueId, successProfileImage, uploadingProfileImagePercentage
	} = useUploadProfileImage();

	const setDescriptionContents = () => {
		if (editorDescriptionRef.current) {
			handleDescription(editorDescriptionRef.current.getContent());
		}
	};

	const [loadingViewUser, setLoadingViewUser] = useState(false)
	const [errorViewUser, setErrorViewUser] = useState(null)
	const [viewUser, setViewUser] = useState(null)

	async function getAUser(unique_id) {
		setLoadingViewUser(true)
		const response = await getUser(cookie, { unique_id });
		if (!response.err) {
			setViewUser(response.data);
			UpdateUserDetailsSetUniqueId(response.data.data.unique_id);
			UpdateUserDescriptionSetUniqueId(response.data.data.unique_id);
			UpdateUserProfileImageSetUniqueId(response.data.data.unique_id);

			setFullname(response.data.data.fullname);
			setDescription(response.data.data.description);
			setFee(response.data.data.fee);
			setPriorityFee(response.data.data.priority_fee);
		} else { setErrorViewUser(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewUser(false)
	};

	const handleSelectUserImage = (e) => {
		const el = e.target.files[0];
		setSelectedProfileImage("");
		setSelectedProfileImage(el);
	};

	const getFileExtension = (filename) => {
		let lastDot = filename.lastIndexOf('.');
		let ext = filename.substring(lastDot + 1);
		return ext;
	};

	const getFileNameAlone = (filename) => {
		let _filename = filename.split("/");
		return _filename[_filename.length - 1];
	};

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	useEffect(() => {
		if (viewUser === null) {
			getAUser(unique_id);
		}
	}, [viewUser]);

	if (removeProfileImageModal || removeUserDetailsModal || removeUserDescriptionModal) {
		// const modalResponse = document.querySelector("#editUserModal");
		// modalResponse.setAttribute("display", false);
		// callLastUserFunction();
		setRemoveProfileImageModal(null);
		setRemoveUserDetailsModal(null);
		setRemoveUserDescriptionModal(null);
		window.location.reload(true);
	}

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						{
							loadingViewUser ?
								<center>
									<Loading width="12" height="12" />
								</center> : (
									viewUser && viewUser.success ?
										<>
											<form className="xui-form" layout="2" onSubmit={handleUserDetails}>
												<div className="xui-form-box xui-mt-2">
													<label>Fullname</label>
													<input className="xui-font-sz-90" type="text" value={fullname} onChange={handleFullname} required placeholder="Enter fullname"></input>
												</div>
												<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
													<div className="xui-form-box xui-mt-2">
														<label>Fee</label>
														<input className="xui-font-sz-90" type="number" min={0} value={fee} onChange={handleFee} required placeholder="Enter fee"></input>
													</div>
													<div className="xui-form-box xui-mt-2">
														<label>Priority Fee (Optional)</label>
														<input className="xui-font-sz-90" type="number" min={0} value={priorityFee} onChange={handlePriorityFee} placeholder="Enter priority fee"></input>
													</div>
												</div>

												<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUserDetails}</span></p>
												<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUserDetails}</span></p>

												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button disabled={loadingUserDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUserDetails ?
																<Loading width="12" height="12" />
																: <Arrowright width="12" height="12" />
														}
													</button>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
													<label>Image</label>
													<div className="xui-d-flex xui-flex-ai-center">
														{
															viewUser.data.image ?
																getFileExtension(viewUser.data.image) === "pdf" || getFileExtension(viewUser.data.image) === "PDF" ?
																	<div className='xui-d-inline-flex xui-flex-ai-center'>
																		<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewUser.data.image)}</span>
																		<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewUser.data.image); }}>
																			<EyeOpen width="20" height="20" />
																		</span>
																	</div> :
																	<img className="xui-img-200" src={viewUser.data.image} alt="User Image" />
																: null
														}
														<input onChange={handleSelectUserImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .webp" id="editImage" required />
													</div>
													{
														uploadingProfileImagePercentage > 0 ?
															<>
																<label htmlFor="uploader">Uploading</label>
																<progress className="xui-h-30" value={uploadingProfileImagePercentage} id="uploader" max="100">{uploadingProfileImagePercentage + "%"}</progress><br /><br></br>
															</> :
															""
													}

													{loadingProfileImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

													<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorProfileImage}</span></p>
													<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successProfileImage}</span></p>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button disabled={loadingProfileImage} onClick={handleUploadProfileImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingProfileImage ?
																<Loading width="12" height="12" />
																: <Arrowright width="12" height="12" />
														}
													</button>
												</div>
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={handleUserDescription}>
												<div className="xui-form-box xui-mt-2">
													<label className="">Description</label>
													<textarea type={"text"} maxLength={65535} placeholder={"Write a description"} value={description} onChange={handleDescription}></textarea>
													{/* <BundledEditor
														onInit={(evt, editor) => editorDescriptionRef.current = editor}
														initialValue={description}
														init={{
															height: 700,
															font_size_input_default_unit: "pt",
															menubar: false,
															plugins: [
																'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
																'searchreplace', 'table', 'wordcount', 'code',
															],
															toolbar: [
																'undo redo | styles | bold italic forecolor fontsizeinput | bullist numlist outdent indent | link image | alignleft aligncenter alignright alignjustify | removeformat | table | code',
															],
															toolbar_mode: 'floating',
															content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
														}}
													/> */}
												</div>

												{/* {
													showConfirmUpdateUserDescription ?
														<div className="xui-m-3">
															<center>
																<h4>Confirm Edit User Description</h4>
																<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
															</center>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUserDescription}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUserDescription}</span></p>
															<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={handleUserDescription} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">Yes</span>
																		{
																			loadingUserDescription ?
																				<Loading width="12" height="12" />
																				: <Check width="20" height="20" />
																		}
																	</button>
																</div>
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={() => setShowConfirmUpdateUserDescription(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">No</span>
																		<Close width="20" height="20" />
																	</button>
																</div>
															</div>
														</div> : */}
														<div>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUserDescription}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUserDescription}</span></p>
															<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
																{/* <button onClick={() => { setDescriptionContents(); setShowConfirmUpdateUserDescription(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85"> */}
																<button type="submit" disabled={loadingUserDescription} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
																	<span className="xui-mr-half">Save Changes</span>
																	{
																		loadingUserDescription ?
																			<Loading width="12" height="12" />
																			: <Arrowright width="12" height="12" />
																	}
																</button>
															</div>
														</div>
												{/* } */}
											</form>
										</> :
										<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
											<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
												<center className="xui-text-red">
													<Close width="100" height="100" />
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewUser}</h3>
												</center>
											</div>
										</div>
								)
						}
					</section>
				</Content>
			</Screen>
		</>
	);

}