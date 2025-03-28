import mongoose from "mongoose";
import Place from "../models/Place";
import { Request, Response } from "express";
import formidable from "formidable";
import cloudinary from "../config/cloudinary";
import { v4 as uuid } from 'uuid';

export class PlaceController {

    static createPlace = async (req: Request, res: Response) => {
        const { name, description, image, location, category } = req.body;
        try {
            const place = new Place({
                name,
                description,
                image,
                location,
                category
            });

            const newPlace = await place.save();
            const selectedFields = {
                _id: newPlace._id,
                name: newPlace.name,
                description: newPlace.description,
                images: newPlace.images,
                location: newPlace.location,
                category: newPlace.category
            }
            res.status(201).json(selectedFields);
        } catch (error) {
            // console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static getPlaces = async (req: Request, res: Response) => {
        try {
            const places = await Place.find();
            res.status(200).json(places);
        } catch (error) {
            res.status(500).json("Internal server error");
        }
    }

    static getPlace = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json("Invalid id");
            }
            const place = await Place.findById(id);
            if (!place) {
                res.status(404).json("Place not found");
            }
            res.status(200).json(place);
        } catch (error) {
            res.status(500).json("Internal server error");
        }
    }

    static updatePlace = async (req: Request, res: Response) => {

        const { id } = req.params;
        const { name, description, location, category, images } = req.body;

        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({message: "Invalid id"});
                return;
            }

            // 
            const place = await Place.findById(id);
            if (!place) {
                res.status(404).json({message: "Place not found"});
                return;
            }

            place.name = name || place.name;
            place.description = description || place.description;
            place.location = location || place.location;
            place.category = category || place.category;
            place.images = images || place.images;

            // save the updated place
            const updatedPlace = await place.save();
            res.status(200).json(updatedPlace);

        } catch (error) {
            // console.log(error);
            res.status(500).json({message: "Internal server error"});
        }

    }

    static deletePlace = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json("Invalid id");
            }

            const place = await Place.findById(id);
            if (!place) {
                res.status(404).json("Place not found");
            }

            await place.deleteOne();
            res.status(200).json("Place deleted");

        } catch (error) {
            res.status(500).json("Internal server error");
        }
    }

    static uploadImages = async (req: Request, res: Response) => {
        const form = formidable({ 
            multiples: true  // Permite recibir varios archivos
        }); //
    
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.error("Error al procesar los archivos:", error);
                res.status(400).json({ message: 'Error al procesar los archivos' });
                return;
            }
    
            // Verifica si se reciben las imágenes

            // images es un array si se sube una sola imagen o un objeto si se suben varias
            // The key 'images' is used in the form data
            const images = Array.isArray(files.images) ? files.images : [files.images]; 
            
            if (images.length > 5) {
                res.status(400).json({ message: 'No se pueden subir más de 5 imágenes' });
                return;
            }
    
            try {
                const imageUrls = [];
                // Subir las imágenes a Cloudinary
                const uploadPromises = images.map((image) => {
                    return cloudinary.uploader.upload(image.filepath, {
                        public_id: uuid(), 
                        folder: 'places',
                    });
                });
    
                // Esperar que todas las imágenes se suban
                const results = await Promise.all(uploadPromises);
                
                // Extraer las URLs de las imágenes subidas
                results.forEach(result => {
                    imageUrls.push(result.secure_url);
                });
    
                // Obtener el lugar por ID y actualizar sus imágenes
                const { id } = req.params;
                const updatedPlace = await Place.findByIdAndUpdate(
                    id, 
                    { images: imageUrls }, 
                    { new: true }
                );
    
                if (!updatedPlace) {
                    res.status(404).json({ message: 'Lugar no encontrado' });
                    return;
                }
    
                res.status(200).json({ message: 'Imágenes subidas correctamente', images: imageUrls });
    
            } catch (error) {
                console.error("Error al subir las imágenes:", error);
                res.status(500).json({ msg: 'Error al subir las imágenes' });
                return;
            }
        });
    };

    
    
}