import React, { useState } from 'react';

import { uploadSheetAsync } from '../../api';

const FileUpload = ({
	channel,
	onSuccess = () => {},
	formParams = {},
}) => {
	const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);
	const [progress, setProgress] = useState(0);

	const onChange = (event) => {
		setProgress(0);
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};

	const onUploadProgress = (event) => {
		setProgress(Math.round((100 * event.loaded) / event.total));
	}

	const handleSubmit = async () => {

		console.log(result);
	}

	return (
		<div>


			<div>
				<button onClick={handleSubmit} >OK</button>
			</div>
		</div>
	);
}

export default FileUpload;
