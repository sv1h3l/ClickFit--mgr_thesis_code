export enum GenericModelReturnEnum {
	ALREADY_EXIST = 409,
	FAILURE = 500,

	SUCCESS = 200,
}

export interface GenericModelReturn<T> {
	status: GenericModelReturnEnum;
	message?: string;
	data?: T;
}

// FIXME → Předělat všechny interfaces na GenericModelReturn
