import type { Router } from 'express';
import {
  handleAddUser,
  handleDeleteUser,
  handleGetUser,
  handleUpdateUser,
  handleUserLogin,
  handleVerifyUser,
} from '@/controllers/user-controllers';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.get('/', authenticate(), handleGetUser);
  router.get('/verify', (req, res, next) => handleVerifyUser(req, res, next));
  router.post('/create', handleAddUser);
  router.post('/login', handleUserLogin);
  router.post('/remove', authenticate(), handleDeleteUser);
  router.put('/update', authenticate(), handleUpdateUser);
});
