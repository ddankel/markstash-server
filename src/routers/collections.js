const express = require("express");
const router = new express.Router();
const CollectionsController = require("../controllers/CollectionsController");

/**
 * @swagger
 * /categories/{category_pid}/collections:
 *   get:
 *     summary: Retrieve a list of collections for a given category.
 *     tags:
 *       - collections
 *     parameters:
 *       - $ref: "#/components/parameters/CategoryPID"
 *     responses:
 *       200:
 *         description: A list of collections.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Collection'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.get("/categories/:category_pid/collections", CollectionsController.index);

/**
 * @swagger
 * /categories/{category_pid}/collections:
 *   post:
 *     summary: Create a new collection under the specified category.
 *     tags:
 *     - collections
 *     parameters:
 *       - $ref: "#/components/parameters/CategoryPID"
 *     requestBody:
 *       $ref: '#components/requestBodies/Collection'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Collection'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.post("/categories/:category_pid/collections", CollectionsController.create);

/**
 * @swagger
 * /collections/{id}:
 *   get:
 *     summary: Retrieve a single collection.
 *     tags:
 *     - collections
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
 *                   $ref: '#/components/schemas/Collection'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.get("/collections/:id", CollectionsController.show);

/**
 * @swagger
 * /collections/{id}:
 *   patch:
 *     summary: Updates a single collection.
 *     tags:
 *     - collections
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     requestBody:
 *       $ref: '#components/requestBodies/Collection'
 *     responses:
 *       200:
 *         description: The updated collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Collection'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.patch("/collections/:id", CollectionsController.update);

/**
 * @swagger
 * /collections/{id}:
 *   delete:
 *     summary: Deletes a single collection.
 *     tags:
 *     - collections
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     responses:
 *       200:
 *         description: The deleted collection.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Collection'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.delete("/collections/:id", CollectionsController.destroy);

/**
 * @swagger
 * /collections/{id}/relocate:
 *   patch:
 *     summary: Relocates a collection to a specified category and column
 *     tags:
 *     - collections
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               collection:
 *                 type: object
 *                 properties:
 *                   categoryPid:
 *                     type: string
 *                     description: The category to place this collection under
 *                     example: k39js3
 *                   column:
 *                     type: integer
 *                     description: The column to place this collection in
 *                     default: 1
 *                     minimum: 1
 *                     maximum: 3
 *                   ordinal:
 *                     type: integer
 *                     description: This collection's ordered place, used for sorting
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
 *                     $ref: '#/components/schemas/Collection'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.patch("/collections/:id/relocate", CollectionsController.relocate);

module.exports = router;
