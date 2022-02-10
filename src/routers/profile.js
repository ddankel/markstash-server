const express = require("express");
const router = new express.Router();
const ProfileController = require("../controllers/ProfileController");

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Retrieve the current user's profile
 *     tags:
 *       - profile
 *     responses:
 *       200:
 *         description: The user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.get("/profile", ProfileController.show);

module.exports = router;
