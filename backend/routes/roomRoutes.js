import express from 'express';
import { listRooms, searchRooms, getFeaturedRooms, getRoomById } from '../controllers/roomController.js';

const router = express.Router();

router.get('/', listRooms);
router.get('/search', searchRooms);
router.get('/featured', getFeaturedRooms);
// NOTE: /featured must come BEFORE /:id or Express will match "featured" as an id
router.get('/:id', getRoomById);

export default router;
