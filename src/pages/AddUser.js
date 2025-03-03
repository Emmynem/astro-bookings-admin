import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddUser } from "../hooks/useUsers";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function AddUser() {
	const navigate = useNavigate();

	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorDescriptionRef = useRef(null);

	const [showConfirmAddUser, setShowConfirmAddUser] = useState(false);

	const {
		description, errorAddUser, fee, fullname, handleAddUser, handleDescription, handleFee, handleFullname, handlePriorityFee, loadingAddUser, 
		priorityFee, removeAddUserModal, selectedAddUser, setDescription, setFee, setFullname, setPriorityFee, setRemoveAddUserModal, setSelectedAddUser, 
		successAddUser, uploadingAddUserPercentage
	} = useAddUser();

	const setDescriptionContents = () => {
		if (editorDescriptionRef.current) {
			handleDescription(editorDescriptionRef.current.getContent());
		}
	};

	const handleSelectAddUser = (e) => {
		const el = e.target.files[0];
		setSelectedAddUser("");
		setSelectedAddUser(el);
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

	if (removeAddUserModal) {
		setRemoveAddUserModal(null);
		setTimeout(function () {
			navigate(`/internal/users`);
		}, 1500)
	}

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>Create new User</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half"></p>
							</div>
						</div>
						<form className="xui-form" layout="2" onSubmit={handleAddUser}>
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
							<div className="xui-form-box xui-mt-2">
								<label>Image (Optional)</label>
								<input onChange={handleSelectAddUser} type={"file"} accept=".png, .jpg, .jpeg, .heic, .webp" id="image" />
							</div>
							{
								uploadingAddUserPercentage > 0 ?
									<>
										<label htmlFor="uploader">Uploading</label>
										<progress className="xui-h-30" value={uploadingAddUserPercentage} id="uploader" max="100">{uploadingAddUserPercentage + "%"}</progress><br /><br></br>
									</> :
									""
							}
							<div className="xui-form-box xui-mt-2">
								<label className="">Description</label>
								<textarea type={"text"} maxLength={65535} placeholder={"Write a description"} value={description} onChange={handleDescription}></textarea>
								{/* <BundledEditor
									onInit={(evt, editor) => editorDescriptionRef.current = editor}
									initialValue={description}
									init={{
										height: 500,
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
								showConfirmAddUser ?
									<div className="xui-m-3">
										<center>
											<h4>Confirm Add User</h4>
											<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
										</center>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddUser}</span></p>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddUser}</span></p>
										<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
											<div className="xui-d-inline-flex xui-flex-ai-center">
												<button onClick={handleAddUser} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Yes</span>
													{
														loadingAddUser ?
															<Loading width="12" height="12" />
															: <Check width="20" height="20" />
													}
												</button>
											</div>
											<div className="xui-d-inline-flex xui-flex-ai-center">
												<button onClick={() => setShowConfirmAddUser(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">No</span>
													<Close width="20" height="20" />
												</button>
											</div>
										</div>
									</div> : */}
									<div>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddUser}</span></p>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddUser}</span></p>
										<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
											{/* <button disabled={fullname && fullname.length < 2 || !fee} onClick={() => { setDescriptionContents(); setShowConfirmAddUser(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85"> */}
											<button type="submit" className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
												<span className="xui-mr-half">Save User</span>
											</button>
										</div>
									</div>
							{/* } */}
						</form>
					</section>
				</Content>
			</Screen>
		</>
	);

}