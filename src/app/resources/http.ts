interface Response {
	success: boolean;
	data?: object;
	errors?: ResponseError[];
}

interface ResponseError {
	title: string;
	detail?: string;
	httpStatus?: number;
}

export {
	Response,
	ResponseError
}