import { useState } from "react";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { createUser, updateUserDescription, updateUserDetails, updateUserProfileImage, deleteUser } from "../api/users";
import { uploadFile } from "../api/clouder";

const useAddUser = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingAddUser, setLoadingAddUser] = useState(false);
	const [removeAddUserModal, setRemoveAddUserModal] = useState(null);
	const [fullname, setFullname] = useState(null);
	const [description, setDescription] = useState(null);
	const [fee, setFee] = useState(null);
	const [priorityFee, setPriorityFee] = useState(null);
	const [selectedAddUser, setSelectedAddUser] = useState("");
	const [uploadingAddUserPercentage, setUploadingAddUserPercentage] = useState(0);

	const [errorAddUser, setErrorAddUser] = useState(null);
	const [successAddUser, setSuccessAddUser] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleFullname = (e) => { e.preventDefault(); setFullname(e.target.value); };
	const handleDescription = (contents) => { setDescription(contents); };
	const handleFee = (e) => { e.preventDefault(); setFee(parseFloat(e.target.value)); };
	const handlePriorityFee = (e) => { e.preventDefault(); setPriorityFee(parseFloat(e.target.value)); };

	const handleAddUser = () => {

		if (!loadingAddUser) {
			if (!fullname) {
				setErrorAddUser(null);
				setSuccessAddUser(null);
				setErrorAddUser("Fullname is required");
				setTimeout(function () {
					setErrorAddUser(null);
				}, 2500)
			} else if (fullname.length > 500) {
				setErrorAddUser("Fullname maximum characters - 500");
				setTimeout(function () {
					setErrorAddUser(null);
				}, 2500)
			} 
			// else if (!description) {
			// 	setErrorAddUser("Description is required");
			// 	setTimeout(function () {
			// 		setErrorAddUser(null);
			// 	}, 2500)
			// } 
			else if (description && description.length > 65535) {
				setErrorAddUser("Description maximum characters - 65535");
				setTimeout(function () {
					setErrorAddUser(null);
				}, 2500)
			} else if (!fee) {
				setErrorAddUser("Fee is required");
				setTimeout(function () {
					setErrorAddUser(null);
				}, 2500)
			} else if (selectedAddUser && !allowed_extensions.includes(selectedAddUser.type)) {
				setErrorAddUser("Invalid image format (.png, .jpg, .jpeg & .webp)");
				setTimeout(function () {
					setErrorAddUser(null);
				}, 2000)
			} else if (selectedAddUser && selectedAddUser.size > maximum_file_size) {
				setErrorAddUser("File too large (max 10mb)");
				setTimeout(function () {
					setErrorAddUser(null);
				}, 2000)
			} else {
				setLoadingAddUser(true);

				if (!selectedAddUser) {
					const createUserRes = createUser(cookie, {
						fullname: fullname,
						description: description ? description : undefined,
						fee: fee,
						priority_fee: priorityFee ? priorityFee : undefined,
					})

					createUserRes.then(res => {
						setLoadingAddUser(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddUser(error);
								setTimeout(function () {
									setErrorAddUser(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddUser(error);
								setTimeout(function () {
									setErrorAddUser(null);
								}, 2000)
							}
						} else {
							setErrorAddUser(null);
							setUploadingAddUserPercentage(0);
							setSuccessAddUser(`Created user successfully!`);

							setTimeout(function () {
								setSuccessAddUser(null);
								setRemoveAddUserModal(true);
								setFullname(null);
								setDescription(null);
								setFee(null);
								setPriorityFee(null);
							}, 2500)
						}
					}).catch(err => {
						setLoadingAddUser(false);
					})
				} else {
					const formdata = new FormData();
					formdata.append("file_path", "astro/users");
					formdata.append("file", selectedAddUser);
					formdata.append("cloudinary_name", config.cloudy_name);
					formdata.append("cloudinary_key", config.cloudy_key);
					formdata.append("cloudinary_secret", config.cloudy_secret);
	
					const uploadFileRes = uploadFile(formdata)
	
					uploadFileRes.then(res => {
						setLoadingAddUser(false);
						if (res.err) {
							if (!res.error.response.data.success) {
								const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
								setErrorAddUser(error);
								setTimeout(function () {
									setErrorAddUser(null);
								}, 2000)
							} else {
								const error = `${res.error.code} - ${res.error.message}`;
								setErrorAddUser(error);
								setTimeout(function () {
									setErrorAddUser(null);
								}, 2000)
							}
						} else {
							setErrorAddUser(null);
							setUploadingAddUserPercentage(0);
							setSuccessAddUser(`User Image Uploaded!`);
	
							const image = res.data.data.secure_url;
							const image_type = res.data.data.format;
							const image_public_id = res.data.data.public_id;
							
							const createUserRes = createUser(cookie, {
								fullname: fullname,
								description: description ? description : undefined,
								fee: fee,
								priority_fee: priorityFee ? priorityFee : undefined,
								profile_image: image, 
								profile_image_public_id: image_public_id
							})
			
							createUserRes.then(res => {
								setLoadingAddUser(false);
								if (res.err) {
									if (!res.error.response.data.success) {
										const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
										setErrorAddUser(error);
										setTimeout(function () {
											setErrorAddUser(null);
										}, 2000)
									} else {
										const error = `${res.error.code} - ${res.error.message}`;
										setErrorAddUser(error);
										setTimeout(function () {
											setErrorAddUser(null);
										}, 2000)
									}
								} else {
									setErrorAddUser(null);
									setUploadingAddUserPercentage(0);
									setSuccessAddUser(`Created user successfully!`);
			
									setTimeout(function () {
										setSuccessAddUser(null);
										setRemoveAddUserModal(true);
										setFullname(null);
										setDescription(null);
										setFee(null);
										setPriorityFee(null);
									}, 2500)
								}
							}).catch(err => {
								setLoadingAddUser(false);
							})
						}
					}).catch(err => {
						setUploadingAddUserPercentage(0);
						setLoadingAddUser(false);
					})
				}
			}
		}
	};

	return {
		cookie, loadingAddUser, removeAddUserModal, errorAddUser, successAddUser, handleAddUser, setSelectedAddUser,
		setRemoveAddUserModal, fullname, description, fee, priorityFee, uploadingAddUserPercentage, selectedAddUser, setFullname, 
		setDescription, setFee, setPriorityFee, handleDescription, handleFee, handlePriorityFee, handleFullname, 
	};
};

const useUserDescription = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUserDescription, setLoadingUserDescription] = useState(false);
	const [removeUserDescriptionModal, setRemoveUserDescriptionModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);
	const [description, setDescription] = useState(null);

	const [errorUserDescription, setErrorUserDescription] = useState(null);
	const [successUserDescription, setSuccessUserDescription] = useState(null);

	const handleDescription = (contents) => { setDescription(contents); };

	const handleUserDescription = () => {

		if (!loadingUserDescription) {
			if (!userUniqueId) {
				setErrorUserDescription(null);
				setSuccessUserDescription(null);
				setErrorUserDescription("User Unique Id is required");
				setTimeout(function () {
					setErrorUserDescription(null);
				}, 2500)
			} else if (description && description.length > 65535) {
				setErrorUserDescription("Description maximum characters - 65535");
				setTimeout(function () {
					setErrorUserDescription(null);
				}, 2500)
			} else {
				setLoadingUserDescription(true);

				const updateUserDescriptionRes = updateUserDescription(cookie, {
					unique_id: userUniqueId,
					description: description ? description : undefined,
				})

				updateUserDescriptionRes.then(res => {
					setLoadingUserDescription(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUserDescription(error);
							setTimeout(function () {
								setErrorUserDescription(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUserDescription(error);
							setTimeout(function () {
								setErrorUserDescription(null);
							}, 2000)
						}
					} else {
						setErrorUserDescription(null);
						setSuccessUserDescription(`User description updated successfully!`);

						setTimeout(function () {
							setSuccessUserDescription(null);
							setRemoveUserDescriptionModal(true);
							setUserUniqueId(null);
							setDescription(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUserDescription(false);
				})

			}
		}
	};

	return {
		cookie, loadingUserDescription, removeUserDescriptionModal, errorUserDescription, successUserDescription, handleUserDescription, 
		setRemoveUserDescriptionModal, setUserUniqueId, handleDescription, setDescription, description
	};
};

const useUserDetails = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUserDetails, setLoadingUserDetails] = useState(false);
	const [removeUserDetailsModal, setRemoveUserDetailsModal] = useState(null);
	const [userUniqueId, setUserUniqueId] = useState(null);
	const [fullname, setFullname] = useState(null);
	const [fee, setFee] = useState(null);
	const [priorityFee, setPriorityFee] = useState(null);

	const [errorUserDetails, setErrorUserDetails] = useState(null);
	const [successUserDetails, setSuccessUserDetails] = useState(null);

	const handleFullname = (e) => { e.preventDefault(); setFullname(e.target.value); };
	const handleFee = (e) => { e.preventDefault(); setFee(parseFloat(e.target.value)); };
	const handlePriorityFee = (e) => { e.preventDefault(); setPriorityFee(parseFloat(e.target.value)); };

	const handleUserDetails = (e) => {
		e.preventDefault();

		if (!loadingUserDetails) {
			if (!userUniqueId) {
				setErrorUserDetails(null);
				setSuccessUserDetails(null);
				setErrorUserDetails("User Unique Id is required");
				setTimeout(function () {
					setErrorUserDetails(null);
				}, 2500)
			} else if (!fullname) {
				setErrorUserDetails("Fullname is required");
				setTimeout(function () {
					setErrorUserDetails(null);
				}, 2500)
			} else if (fullname.length > 500) {
				setErrorUserDetails("Fullname maximum characters - 500");
				setTimeout(function () {
					setErrorUserDetails(null);
				}, 2500)
			} else if (!fee) {
				setErrorUserDetails("Fee is required");
				setTimeout(function () {
					setErrorUserDetails(null);
				}, 2500)
			} else {
				setLoadingUserDetails(true);

				const updateUserDetailsRes = updateUserDetails(cookie, {
					unique_id: userUniqueId,
					fullname: fullname,
					fee: fee,
					priority_fee: priorityFee ? priorityFee : undefined,
				})

				updateUserDetailsRes.then(res => {
					setLoadingUserDetails(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUserDetails(error);
							setTimeout(function () {
								setErrorUserDetails(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUserDetails(error);
							setTimeout(function () {
								setErrorUserDetails(null);
							}, 2000)
						}
					} else {
						setErrorUserDetails(null);
						setSuccessUserDetails(`User details updated successfully!`);

						setTimeout(function () {
							setSuccessUserDetails(null);
							setRemoveUserDetailsModal(true);
							setUserUniqueId(null);
							setFullname(null);
							setFee(null);
							setPriorityFee(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUserDetails(false);
				})

			}
		}
	};

	return {
		cookie, loadingUserDetails, removeUserDetailsModal, errorUserDetails, successUserDetails, handleUserDetails, 
		setRemoveUserDetailsModal, setUserUniqueId, handleFullname, handleFee, handlePriorityFee, setFullname, setFee, 
		setPriorityFee, fullname, fee, priorityFee 
	};
};

const useUploadProfileImage = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingProfileImage, setLoadingProfileImage] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeProfileImageModal, setRemoveProfileImageModal] = useState(null);
	const [selectedProfileImage, setSelectedProfileImage] = useState("");
	const [uploadingProfileImagePercentage, setUploadingProfileImagePercentage] = useState(0);

	const [errorProfileImage, setErrorProfileImage] = useState(null);
	const [successProfileImage, setSuccessProfileImage] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP"];
	const maximum_file_size = 10 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadProfileImage = (e) => {
		e.preventDefault();

		if (!loadingProfileImage) {
			if (!uniqueId) {
				setErrorProfileImage(null);
				setSuccessProfileImage(null);
				setErrorProfileImage("Unique ID is required");
				setTimeout(function () {
					setErrorProfileImage(null);
				}, 2000)
			} else if (!allowed_extensions.includes(selectedProfileImage.type)) {
				setErrorProfileImage("Invalid image format (.png, .jpg, .jpeg & .webp)");
				setTimeout(function () {
					setErrorProfileImage(null);
				}, 2000)
			} else if (selectedProfileImage.size > maximum_file_size) {
				setErrorProfileImage("File too large (max 10mb)");
				setTimeout(function () {
					setErrorProfileImage(null);
				}, 2000)
			} else {
				setLoadingProfileImage(true);

				const formdata = new FormData();
				formdata.append("file_path", "astro/users");
				formdata.append("file", selectedProfileImage);
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFileRes = uploadFile(formdata)

				uploadFileRes.then(res => {
					setLoadingProfileImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorProfileImage(error);
							setTimeout(function () {
								setErrorProfileImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorProfileImage(error);
							setTimeout(function () {
								setErrorProfileImage(null);
							}, 2000)
						}
					} else {
						setErrorProfileImage(null);
						setUploadingProfileImagePercentage(0);
						setSuccessProfileImage(`Profile Image Uploaded!`);

						const image = res.data.data.secure_url;
						const image_type = res.data.data.format;
						const image_public_id = res.data.data.public_id;

						const updateUserProfileImageRes = updateUserProfileImage(cookie, {
							unique_id: uniqueId, profile_image: image, profile_image_public_id: image_public_id
						})

						updateUserProfileImageRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingProfileImagePercentage(0);
									setLoadingProfileImage(false);
									setErrorProfileImage(error);
									setTimeout(function () {
										setErrorProfileImage(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingProfileImagePercentage(0);
									setLoadingProfileImage(false);
									setErrorProfileImage(error);
									setTimeout(function () {
										setErrorProfileImage(null);
									}, 2000)
								}
							} else {
								setErrorProfileImage(null);
								setUploadingProfileImagePercentage(0);
								setSuccessProfileImage(`Profile Image edited successfully!`);

								setTimeout(function () {
									setLoadingProfileImage(false);
									setSuccessProfileImage(null);
									setRemoveProfileImageModal(true);
									setUniqueId(null);
								}, 3000)
							}
						}).catch(err => {
							setUploadingProfileImagePercentage(0);
							setLoadingProfileImage(false);
						})
					}
				}).catch(err => {
					setUploadingProfileImagePercentage(0);
					setLoadingProfileImage(false);
				})
			}
		}
	};

	return {
		cookie, loadingProfileImage, errorProfileImage, successProfileImage, handleUploadProfileImage, uniqueId, setSelectedProfileImage,
		setUniqueId, uploadingProfileImagePercentage, selectedProfileImage, removeProfileImageModal, setRemoveProfileImageModal
	};
};

const useDeleteUser = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDeleteUser, setLoadingDeleteUser] = useState(false);
	const [removeDeleteUserModal, setRemoveDeleteUserModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteUser, setErrorDeleteUser] = useState(null);
	const [successDeleteUser, setSuccessDeleteUser] = useState(null);

	const handleDeleteUser = () => {

		if (!loadingDeleteUser) {
			if (!uniqueId) {
				setErrorDeleteUser(null);
				setSuccessDeleteUser(null);
				setErrorDeleteUser("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteUser(null);
				}, 2500)
			} else {
				setLoadingDeleteUser(true);

				const deleteUserRes = deleteUser(cookie, {
					unique_id: uniqueId
				})

				deleteUserRes.then(res => {
					setLoadingDeleteUser(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteUser(error);
							setTimeout(function () {
								setErrorDeleteUser(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteUser(error);
							setTimeout(function () {
								setErrorDeleteUser(null);
							}, 2000)
						}
					} else {
						setErrorDeleteUser(null);
						setSuccessDeleteUser(`User deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteUser(null);
							setRemoveDeleteUserModal(true);
							setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteUser(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteUser, removeDeleteUserModal, errorDeleteUser, successDeleteUser, handleDeleteUser,
		setRemoveDeleteUserModal, setUniqueId
	};
};

export { useAddUser, useUserDescription, useUserDetails, useUploadProfileImage, useDeleteUser };
