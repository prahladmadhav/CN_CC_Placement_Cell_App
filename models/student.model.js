const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        college: {
            type: String,
            required: true,
        },
        isPlaced: {
            type: Boolean,
            required: true,
        },
        age: {
            type: Number,
        },
        dsaScore: {
            type: Number,
            required: true,
        },
        webdScore: {
            type: Number,
            required: true,
        },
        reactScore: {
            type: Number,
            required: true,
        },
        batch: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
