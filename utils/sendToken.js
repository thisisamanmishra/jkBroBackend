const sendToken = async (user, statusCode, res) => {
    try {
        const token = await user.generateAuthToken();

        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        }

        res.status(statusCode).cookie('token', token, options).json({
            success: true,
            user
        });
        console.log("Token sent successfully");
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

module.exports = sendToken;
