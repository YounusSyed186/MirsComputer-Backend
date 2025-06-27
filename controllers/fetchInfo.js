import User from "../models/User.js";

const fetchUserInfo= async (req, res) => {
    try {
        const userId = req.body.userId || req.user.id; // Get userId from request body or authenticated user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        
    }
}
export default fetchUserInfo;