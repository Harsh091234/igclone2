import User from "../models/user.model.js";
export const savePublicKey = async (req, res) => {
    const { userId: clerkId } = req.auth();
    const { publicKey } = req.body;
    await User.updateOne({ clerkId }, { publicKey: Buffer.from(publicKey) });
    res.json({ success: true });
};
export const getPublicKey = async (req, res) => {
    const user = await User.findById(req.params.userId).select("publicKey");
    res.json({ publicKey: user?.publicKey });
};
