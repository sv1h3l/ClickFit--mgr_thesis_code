export const generateToken = () => {
	return Array(8) // 8 bloků o délce 8 znaků (64 znaků celkem)
		.fill(null)
		.map(() => Math.random().toString(36).slice(2, 10))
		.join('');
};
