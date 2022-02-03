const express = require("express");
const router = new express.Router();
const GroupsController = require("../controllers/GroupsController");

/**
 * @swagger
 * /collections/{collection_pid}/groups:
 *   get:
 *     summary: Retrieve a list of groups for a given collection.
 *     tags:
 *       - groups
 *     parameters:
 *       - $ref: "#/components/parameters/CollectionPID"
 *     responses:
 *       200:
 *         description: A list of groups.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Group'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.get("/collections/:collection_pid/groups", GroupsController.index);

/**
 * @swagger
 * /collections/{collection_pid}/groups:
 *   post:
 *     summary: Create a group for a given collection.
 *     tags:
 *       - groups
 *     parameters:
 *       - $ref: "#/components/parameters/CollectionPID"
 *     requestBody:
 *       $ref: '#/components/requestBodies/Group'
 *     responses:
 *       200:
 *         description: The new group.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Group'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.post("/collections/:collection_pid/groups", GroupsController.create);

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Retrieve a single collection.
 *     tags:
 *     - groups
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     responses:
 *       200:
 *         description: A single collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Group'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.get("/groups/:id", GroupsController.show);

/**
 * @swagger
 * /groups/{id}:
 *   patch:
 *     summary: Updates a single group.
 *     tags:
 *     - groups
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     requestBody:
 *       $ref: '#components/requestBodies/Group'
 *     responses:
 *       200:
 *         description: The updated group.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Group'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.patch("/groups/:id", GroupsController.update);

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Deletes a single group.
 *     tags:
 *     - groups
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     responses:
 *       200:
 *         description: The deleted group.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Group'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.delete("/groups/:id", GroupsController.destroy);

/**
 * @swagger
 * /groups/{id}/relocate:
 *   patch:
 *     summary: Relocates a group to a specified collection
 *     tags:
 *     - groups
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group:
 *                 type: object
 *                 properties:
 *                   collectionPid:
 *                     type: String
 *                     description: The collection to place this group in
 *                     example: x98jp3
 *                   ordinal:
 *                     type: integer
 *                     description: This group's ordered place, used for sorting
 *                     example: 1
 *                     minimum: 1
 *     responses:
 *       200:
 *         description: The updated collection and its siblings, ordered by ordinal.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Group'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.patch("/groups/:id/relocate", GroupsController.relocate);

module.exports = router;
