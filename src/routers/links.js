const express = require("express");
const router = new express.Router();
const LinksController = require("../controllers/links_controller");

/**
 * @swagger
 * /groups/{group_pid}/links:
 *   get:
 *     summary: Retrieve a list of links for a given group.
 *     tags:
 *       - links
 *     parameters:
 *       - $ref: "#/components/parameters/GroupPID"
 *     responses:
 *       200:
 *         description: A list of links.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Link'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.get("/groups/:group_pid/links", LinksController.index);

/**
 * @swagger
 * /groups/{group_pid}/links:
 *   post:
 *     summary: Create a link for a given collection.
 *     tags:
 *       - links
 *     parameters:
 *       - $ref: "#/components/parameters/GroupPID"
 *     requestBody:
 *       $ref: '#/components/requestBodies/Link'
 *     responses:
 *       200:
 *         description: The new group.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Link'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.post("/groups/:group_pid/links", LinksController.create);

/**
 * @swagger
 * /links/{id}:
 *   get:
 *     summary: Retrieve a single link.
 *     tags:
 *     - links
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     responses:
 *       200:
 *         description: A single link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Link'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.get("/links/:id", LinksController.show);

/**
 * @swagger
 * /links/{id}:
 *   patch:
 *     summary: Updates a single link.
 *     tags:
 *     - links
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     requestBody:
 *       $ref: '#components/requestBodies/Link'
 *     responses:
 *       200:
 *         description: The updated link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Link'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.patch("/links/:id", LinksController.update);

/**
 * @swagger
 * /links/{id}:
 *   delete:
 *     summary: Deletes a single link.
 *     tags:
 *     - links
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     responses:
 *       200:
 *         description: The deleted link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Link'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.delete("/links/:id", LinksController.destroy);

module.exports = router;
