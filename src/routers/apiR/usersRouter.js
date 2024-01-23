import { Router } from 'express';
import { UsersManager } from '../../models/User.js';
import { soloLogueadosApi } from '../../middlewares/auth.js';
export const usersRouter = Router()

usersRouter.post('/', async (req, res) => {
  try {
    const usuario = await UsersManager.create(req.body)
    res.status(201).json({ status: 'success', payload: usuario })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }
})


usersRouter.get('/current', soloLogueadosApi, async (req, res) => {
try {
  const user = req.session.user;

  if (user) {
    
    const usuario = await UsersManager.findOne({ email: user.email }, { password: 0 }).lean();
    return res.json({ status: 'success', payload: usuario });
  } else {
    return res.status(400).json({ status: 'error', message: 'No hay sesión iniciada' });
  }
} catch (error) {
  return res.status(500).json({ status: 'error', message: error.message });
}
});

