const userService = require('../services/userService');
const fonnteService = require('../services/fonnteService');
const logger = require('../utils/logger');

const registerUser = async (req, res) => {
    const { name, whatsappNumber, businessName, businessType } = req.body;

    if (!whatsappNumber) {
        return res.status(400).json({ message: "WhatsApp number is required for registration." });
    }

    try {
        const existingUser = await userService.getUserByWhatsAppNumber(whatsappNumber);
        if (existingUser) {
            return res.status(409).json({ message: "User with this WhatsApp number already exists." });
        }

        const newUser = await userService.createUser({ name, whatsappNumber, businessName, businessType });

        if (!newUser) {
            return res.status(500).json({ message: "Failed to create user account. Please try again." });
        }

        logger.info(`User registered successfully: ${newUser.whatsapp_number}. ID: ${newUser.id}`);
        await fonnteService.sendMessage(newUser.whatsapp_number, "Selamat datang di UMKM Connect WA! Akun Anda berhasil dibuat dan terhubung.");

        res.status(201).json({
            message: "User registered successfully.",
            user: { id: newUser.id, name: newUser.name, whatsappNumber: newUser.whatsapp_number }
        });
    } catch (error) {
        logger.error(`Error during user registration for ${whatsappNumber}:`, error.message);
        res.status(500).json({ message: "An error occurred during registration. Please try again." });
    }
};

module.exports = {
    registerUser
};
