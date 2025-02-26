export interface StateAndSet<T> {
	state: T;
	setState: (value: T) => void;
}
