import {
  handleDeleteAllUnverifiedUsers,
  handleGetAllUsers,
  handleGetAllVerifiedUsers,
} from '@/controllers/admin-controllers';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';
import { Router } from 'express';

export default createRouter((router: Router) => {
  router.use(
    authenticate({
      verifyAdmin: true,
    })
  );

  router.get('/all-users', handleGetAllUsers);
  router.get('/all-verfied-users', handleGetAllVerifiedUsers);
  router.delete('/remove-unverified-users', handleDeleteAllUnverifiedUsers);
});
