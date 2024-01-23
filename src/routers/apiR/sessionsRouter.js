import { Router } from 'express'
import { UsersManager } from '../../models/User.js'
import { sessions } from '../../middlewares/sessions.js'
import { soloLogueadosApi } from '../../middlewares/auth.js'
export const sessionsRouter = Router()

sessionsRouter.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    let datosUsuario;

    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      datosUsuario = {
        email: 'admin',
        nombre: 'admin',
        apellido: 'admin',
        rol: 'admin'
      };
    } else {
      const usuario = await UsersManager.findOne({ email }).lean();

      if (!usuario || password !== usuario.password) {
        return res.status(400).json({ status: 'error', message: 'login failed' });
      }

      datosUsuario = {
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: 'usuario'
      };

      
      req.session.user = datosUsuario;
    }

    return res.status(201).json({ status: 'success', message: 'login success' });
  } catch (error) {
    return res.status(400).json({ status: 'error', message: error });
  }
});


  
  sessionsRouter.get('/current', (req, res) => {
    if (req.session['user']) {
      return res.json(req.session['user'])
    }
    res.status(400).json({ status: 'error', message: 'No hay sesion iniciada aun' })
  })
 


sessionsRouter.delete('/current', (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ status: 'logout error', body: err });
      }
      return res.json({ status: 'success', message: 'logout OK' });
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
