export enum GenericModelReturnEnum {
	ALREADY_EXIST = -2,
	FAILURE = -1,

	SUCCESS = 0,
}

export interface GenericModelReturn<T> {
	status: GenericModelReturnEnum;
	message?: string;
	data?: T;
}

// FIXME → Předělat všechny interfaces na GenericModelReturn
