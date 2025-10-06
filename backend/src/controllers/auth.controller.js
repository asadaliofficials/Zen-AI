export const authController = (req, res) => {
	const { name, email, password } = req.body;

	res.status(200).json({ message: 'all data recieved.', data: { name, email, password } });
};
