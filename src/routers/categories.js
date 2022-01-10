const express = require("express");
const router = new express.Router();
const CategoriesController = require("../controllers/categories_controller");

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories.
 *     tags:
 *     - categories
 *     description: Retrieve a list of categories.
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.get("/categories", CategoriesController.index);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category.
 *     tags:
 *     - categories
 *     description: Create a new category.
 *     requestBody:
 *       $ref: '#/components/requestBodies/Category'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.post("/categories", CategoriesController.create);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retrieve a single category.
 *     tags:
 *     - categories
 *     description: Retrieve a single category.
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     responses:
 *       200:
 *         description: A single category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.get("/categories/:id", CategoriesController.show);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update a single category.
 *     tags:
 *     - categories
 *     description: Update a single category record
 *     parameters:
 *       - $ref: '#/components/parameters/PID'
 *     requestBody:
 *       $ref: '#/components/requestBodies/Category'
 *     responses:
 *       200:
 *         description: The updated category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.patch("/categories/:id", CategoriesController.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a single category.
 *     tags:
 *     - categories
 *     description: Delete a single category record
 *     parameters:
 *       - $ref: "#/components/parameters/PID"
 *     responses:
 *       200:
 *         description: The deleted category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       default:
 *         $ref: '#/components/responses/Error'
 */
router.delete("/categories/:id", CategoriesController.destroy);

module.exports = router;
