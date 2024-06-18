import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    const userId = req.user._id;
    try {
        const notifications = await Notification.find({to: userId }).populate({
            path: "from",
            select: "userName profileImg",
        });
        
        await Notification.updateMany(
            {to: userId},
            {read: true}
        );

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const deleteNotifications = async (req, res) => {
    const userId = req.user._id;
    try {
        await Notification.deleteMany({to: userId});
        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotifications controller: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

// export const deleteOneNotifications = async (req, res) => {
//     const userId = req.user._id;
//     const notificationId = req.params.id;
//     try {
//         const notification = await Notification.findById(notificationId);
//         if (!notification) {
//             return res.status(404).json({ error: "Notification not found" });
//         }
//         if (notification.to.toString() !== userId.toString()) {
//             return res.status(401).json({ error: "You are not authorized to delete this notification" });
//         }

//         await Notification.findByIdAndDelete(notificationId);
//         res.status(200).json({ message: "Notifications deleted successfully" });
//     } catch (error) {
//         console.log("Error in deleteOneNotifications controller: ", error.message);
//         res.status(500).json({ error: error.message });
//     }
// };