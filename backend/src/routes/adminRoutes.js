const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware autentikasi sederhana
const authorizeAdmin = (req, res, next) => {
    // Cek header untuk token admin (Anda bisa simpan di .env atau request header)
    const adminToken = req.headers['x-admin-token'];
    if (adminToken && adminToken === process.env.ADMIN_SECRET_TOKEN) {
        next();
    } else {
        res.status(403).json({ message: "Akses ditolak: Anda bukan admin." });
    }
};

// Admin Dashboard Route dengan proteksi
router.get('/stats', authorizeAdmin, adminController.getDashboardStats);

module.exports = router;
