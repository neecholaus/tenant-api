import * as http from '../resources/http';

class Validate {

	// returns array of errors if fields specified in requiredInputs are not present in body
	static require(requiredInputs: string[], body: any): http.ResponseError[] {
		let errors: Array<http.ResponseError> = [];

		for (let inputName in requiredInputs) {

			// if required field is not populated in body
			if (Object.keys(body).indexOf(requiredInputs[inputName]) == -1) {
				errors.push(<http.ResponseError>{
					title: 'Missing Input',
					detail: requiredInputs[inputName] + ' was not provided.',
					httpStatus: 422
				});

				continue;
			}

			// if value provided but falsy
			if (!body[requiredInputs[inputName]]) {
				errors.push(<http.ResponseError>{
					title: 'Invalid Input',
					detail: requiredInputs[inputName] + ' was invalid.',
					httpStatus: 422
				});
			}
		}

		return errors;
	}
}

export default Validate;