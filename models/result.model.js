const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        interview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
        status: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
