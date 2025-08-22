const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createResume,
  getUserResumes,
  getResume,
  updateResume,
  deleteResume,
  setDefaultResume,
  getDefaultResume,
  getPublicResumes,
  duplicateResume
} = require('../controllers/resumeController');

router.get('/public', getPublicResumes);

router.use(protect);

router.route('/')
  .post(createResume)
  .get(getUserResumes);

router.get('/default', getDefaultResume);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

router.patch('/:id/set-default', setDefaultResume);
router.post('/:id/duplicate', duplicateResume);

module.exports = router;
