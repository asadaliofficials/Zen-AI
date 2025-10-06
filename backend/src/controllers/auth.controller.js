export const authController =  (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({ message: 'all fields are required!' });
	}
	res.send('message from auth controller');
};