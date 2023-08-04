const Student = require("../models/student.model");
const Result = require("../models/result.model");

module.exports.viewAll = async (req, res) => {
    let students;
    try {
        students = await Student.find({}).sort("-createdAt");
    } catch (err) {
        students = [];
        req.flash("error", "Error Encountered!");
        console.log(`Students not Loaded: ${err}`);
    }
    return res.render("student", {
        title: "Student Desk",
        students: students,
    });
};
module.exports.profile = async (req, res) => {
    try {
        let profileStudent = await Student.findById(req.params.id);
        if (profileStudent) {
            return res.render("student_profile", {
                title: profileStudent.name,
                profileStudent: profileStudent,
            });
        } else {
            req.flash("error", `User Not Found`);
            console.log(`User(${req.params.id}) was not found`);
        }
    } catch (err) {
        req.flash("error", `Error encountered`);
        console.log(`Error Loading profile page: ${err}`);
    }
    return res.redirect("back");
};
module.exports.create = async (req, res) => {
    try {
        let studentexists = await Student.findOne({ email: req.body.email });
        if (studentexists) {
            if (req.xhr) {
                return res.status(500).json({
                    success: false,
                    message: "Student email already exists!",
                });
            }
            req.flash("error", "Student email already exists!");
            console.log("Student email already exists!");
            return res.redirect("back");
        }
        let studentData = {};
        studentData["name"] = req.body.name;
        studentData["email"] = req.body.email;
        studentData["college"] = req.body.college;
        studentData["isPlaced"] = req.body.isPlaced == "yes";
        studentData["age"] = parseInt(req.body.age);
        studentData["dsaScore"] = parseInt(req.body.dsaScore);
        studentData["webdScore"] = parseInt(req.body.webdScore);
        studentData["reactScore"] = parseInt(req.body.reactScore);
        studentData["batch"] = req.body.batch;
        let student = await Student.create(studentData);
        if (req.xhr) {
            return res.status(200).json({
                success: true,
                student: student,
                message: "Student created!",
            });
        }
        req.flash("success", "Student created!");
        console.log(`Student created: ${student.id}`);
    } catch (err) {
        if (req.xhr) {
            return res.status(500).json({
                success: false,
                message: "Error Encountered!",
            });
        }
        req.flash("error", "Error Encountered!");
        console.log(`Error Creating a Student: ${err}`);
    }
    return res.redirect("back");
};
module.exports.destroy = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id);
        if (student) {
            await Student.deleteOne({ _id: req.params.id });
            await Result.deleteMany({ student: req.params.id });
            if (req.xhr) {
                return res.status(200).json({
                    success: true,
                    message: "Student deleted!",
                });
            }
            req.flash("success", "Student deleted!");
            console.log(`Student deleted: ${student}`);
        } else {
            if (req.xhr) {
                return res.status(500).json({
                    success: false,
                    message: "Student could not be found!",
                });
            }
            req.flash("error", "Student could not be found!");
            console.log(`Student does exist: ${req.params.id}`);
        }
    } catch (err) {
        if (req.xhr) {
            return res.status(500).json({
                success: false,
                message: "Error Encountered!",
            });
        }
        req.flash("error", "Error Encountered!");
        console.log(`Error Deleting a Student: ${err}`);
    }
    return res.redirect("back");
};
module.exports.edit = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id);
        if (student) {
            if (student["email"] !== req.body.email) {
                let sameEmail = await Student.findOne({ email: req.body.email });
                if (sameEmail) {
                    if (req.xhr) {
                        return res.status(500).json({
                            success: false,
                            message: "Student email already exists!",
                        });
                    }
                    req.flash("error", "Student email already exists!");
                    console.log("Student email already exists!");
                    return res.redirect("back");
                }
            }
            student["name"] = req.body.name;
            student["email"] = req.body.email;
            student["college"] = req.body.college;
            student["isPlaced"] = req.body.isPlaced == "yes";
            student["age"] = parseInt(req.body.age);
            student["dsaScore"] = parseInt(req.body.dsaScore);
            student["webdScore"] = parseInt(req.body.webdScore);
            student["reactScore"] = parseInt(req.body.reactScore);
            student["batch"] = req.body.batch;
            await student.save();
            if (req.xhr) {
                return res.status(200).json({
                    success: true,
                    student: student,
                    message: "Student data updated!",
                });
            }
            req.flash("success", "Student data updated!");
            console.log(`Student data updated: ${student.id}`);
        } else {
            if (req.xhr) {
                return res.status(500).json({
                    success: false,
                    message: "Student not found!",
                });
            }
            req.flash("error", "Student not found!");
            console.log(`Student not found: ${req.params.id}`);
        }
    } catch (err) {
        if (req.xhr) {
            return res.status(500).json({
                success: false,
                message: "Error Encountered!",
            });
        }
        req.flash("error", "Error Encountered!");
        console.log(`Error Updating a Student: ${err}`);
    }
    return res.redirect("back");
};
