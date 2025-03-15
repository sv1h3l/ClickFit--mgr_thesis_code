export interface StateAndSet<T> {
	state: T;
	setState: (value: T) => void;
}

export interface StateAndSetFunction<T> {
	state: T;
	setState: React.Dispatch<React.SetStateAction<T>>;
}
