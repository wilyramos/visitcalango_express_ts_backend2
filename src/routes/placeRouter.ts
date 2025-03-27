import express from 'express';
import { body } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { PlaceController } from '../controllers/PlaceController';

const router = express.Router();

// Router CRUD for place turism
router.post('/create',
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('description')
        .notEmpty()
        .withMessage('Description is required'),
    handleInputErrors,
    PlaceController.createPlace
);

router.get('/', 
    PlaceController.getPlaces
);

router.get('/:id', 
    PlaceController.getPlace
);

router.put('/:id', 

    PlaceController.updatePlace
);

router.delete('/:id', 
    PlaceController.deletePlace
);

// Upload images for place for specific place
router.post('/:id/upload',
    PlaceController.uploadImages
)


export default router