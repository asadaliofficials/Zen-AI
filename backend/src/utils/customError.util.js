// utils/httpError.js
function customError(statusCode = 500, message) {
	const err = new Error(message);
	err.statusCode = statusCode;
	return err;
}

export default customError;
