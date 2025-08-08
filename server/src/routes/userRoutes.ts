// server/routes/userRoutes.ts
import express, { Router } from 'express';
import { getUsers, addUser } from '../controllers/userController';

const router: Router = express.Router();

// Route definitions (DRY)
const routes: {
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
  handler: (req: express.Request, res: express.Response) => void | Promise<void>;
}[] = [
  { method: 'get', path: '/', handler: getUsers },
  { method: 'post', path: '/', handler: addUser },
];

// Register routes
routes.forEach(({ method, path, handler }) => {
  router[method](path, handler);
});

export default router;
