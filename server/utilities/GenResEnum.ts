/* Generic Response and Enum */

export enum GenEnum {
	SUCCESS = 200,

	BAD_REQUEST = 400,
	UNAUTHORIZED = 403,
	NOT_FOUND = 404,
	ALREADY_EXISTS = 409,

	FAILURE = 500,
}

export interface GenRes<T> {
	status: GenEnum;
	message?: string;
	data?: T;
}

// FIXME → Předělat všechny interfaces na GenRes
