import express from 'express';
import { body } from 'express-validator';
import verifyAuth from '../middleware/auth';
import { handleInputErrors } from '../middleware/validation';
import { UserController } from '../controllers/UserController';


const router = express.Router();

// Rputer CRUD for user
router.post('/register',
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('email')
        .isEmail()
        .withMessage('Email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    handleInputErrors,
    UserController.createUser
);

router.post('/login', 
    body('email')
        .isEmail()
        .withMessage('Email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleInputErrors,
    UserController.login
);

router.get('/profile', 
    verifyAuth,
    UserController.profile
);

router.get('/users', 
    verifyAuth,
    UserController.getUsers
);


// TODO: Add routes for get, update and delete user
router.get('/user/:id', 
    verifyAuth,
    UserController.getUser
);

router.put('/user/:id', 
    verifyAuth,
    UserController.updateUser
);

router.delete('/user/:id', 
    verifyAuth,
    UserController.deleteUser
);



export default router;
