import { Router } from 'express';
import * as TweetsController from '../controllers/tweets.controller';
const router = new Router();

// Get sentiment
router.route('/sentiment').post(TweetsController.getSentiment);

export default router;
