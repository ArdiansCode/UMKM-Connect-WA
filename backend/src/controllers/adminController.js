const adminService = require('../services/adminService');

const getDashboardStats = async (req, res) => {
    try {
        const stats = await adminService.getAdminStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardStats };
