import mongoose from "mongoose";

// interface place turism

export interface IPlace extends mongoose.Document {
    name: string;
    description: string;
    location: string;
    category: {
        type: string,
        enum: ["natural", "cultural", "religious"]
    }
    images: string[];
}

// Schema place turism

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: false,
        trim: true,
    },
    category: {
        type: String,
        enum: ["natural", "cultural", "religioso"],
        default: "natural",
        required: false
    },
    images: {
        type: [String],
        required: false
    }
});

const Place = mongoose.model<IPlace>("Place", placeSchema);
export default Place;