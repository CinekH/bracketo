import express from 'express';
import { createBracket, getAllBrackets, getBracket, updateBracket } from '../controllers/bracket.controller.js';

const router = express.Router();

router.post('/create', createBracket);
router.get('/get-all', getAllBrackets);
router.get('/get/:bracketId', getBracket);
router.post('/update', updateBracket);

export default router;