/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - userId
 *         - googleSub
 *         - email
 *         - name
 *         - role
 *       properties:
 *         userId:
 *           type: integer
 *           description: The unique identifier for the user
 *         googleSub:
 *           type: string
 *           description: Google's unique identifier for the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         name:
 *           type: string
 *           description: User's display name
 *         pictureUrl:
 *           type: string
 *           format: uri
 *           description: URL to user's profile picture
 *         role:
 *           type: string
 *           enum: [shopper, admin]
 *           default: shopper
 *           description: User's role in the system
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 *     GoogleProfile:
 *       type: object
 *       required:
 *         - sub
 *         - email
 *         - name
 *       properties:
 *         sub:
 *           type: string
 *           description: Google's unique identifier
 *         email:
 *           type: string
 *           format: email
 *           description: User's email from Google
 *         name:
 *           type: string
 *           description: User's name from Google
 *         picture:
 *           type: string
 *           format: uri
 *           description: User's profile picture URL from Google
 */
export interface User {
  userId: number;
  googleSub: string;
  email: string;
  name: string;
  pictureUrl?: string;
  role: 'shopper' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}