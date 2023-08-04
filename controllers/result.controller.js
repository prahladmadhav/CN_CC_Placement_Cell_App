const Result = require("../models/result.model");
const Interview = require("../models/interview.model");
const Student = require("../models/student.model");
const moment = require("moment");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");
const fs = require("fs");

const resultStatuses = { pass: "PASS", fail: "FAIL", onHold: "On Hold", notAttempted: "Didn't Attempt" };

module.exports.viewAll = async (req, res) => {
    let results;
    let interviews;
    let students;
    try {
        results = await Result.find({}).populate("student").populate("interview").sort("-createdAt");
        interviews = await Interview.find({});
        interviews.forEach((interview) => {
            if (interview.date == null) {
                interview.formatedDate = "No Date Set";
            } else {
                interview.formatedDate = moment(interview.date).format("ll");
            }
        });
        results.forEach((result) => {
            if (result.interview.date == null) {
                result.interview.formatedDate = "No Date Set";
            } else {
                result.interview.formatedDate = moment(result.interview.date).format("ll");
            }
        });
        students = await Student.find({});
    } catch (err) {
        results = [];
        interviews = [];
        students = [];
        req.flash("error", "Error Encountered!");
        console.log(`Interviews not Loaded: ${err}`);
    }
    return res.render("result", {
        title: "Interviews",
        results: results,
        interviews: interviews,
        students: students,
    });
};
module.exports.single = async (req, res) => {
    try {
        let resultSingle = await Result.findById(req.params.id).populate("student").populate("interview");
        if (resultSingle) {
            resultSingle.interview.formatedDate = moment(resultSingle.interview.date).format("ll");
            let interviews = await Interview.find({});
            interviews.forEach((interview) => {
                if (interview.date == null) {
                    interview.formatedDate = "No Date Set";
                } else {
                    interview.formatedDate = moment(interview.date).format("ll");
                }
            });
            let students = await Student.find({});
            return res.render("result_single", {
                title: resultSingle.company,
                resultSingle: resultSingle,
                interviews: interviews,
                students: students,
                students: students,
                resultStatus: resultStatuses[resultSingle.status],
            });
        } else {
            req.flash("error", `Result Not Found`);
            console.log(`Result(${req.params.id}) was not found`);
        }
    } catch (err) {
        req.flash("error", `Error encountered`);
        console.log(`Error Loading profile page: ${err}`);
    }
    return res.redirect("back");
};
module.exports.create = async (req, res) => {
    try {
        let interview = await Interview.findById(req.body.interview);
        let student = await Student.findById(req.body.student);
        if (interview && student) {
            let result = await Result.create(req.body);
            if (req.xhr) {
                return res.status(200).json({
                    success: true,
                    result: result.populate("student").populate("interview"),
                    message: "Result created!",
                });
            }
            req.flash("success", "Result created!");
            console.log(`Result created: ${result.id}`);
        } else {
            if (req.xhr) {
                return res.status(500).json({
                    success: false,
                    message: "Student or Interview does not exist!",
                });
            }
            req.flash("error", "Student or Interview does not exist!");
            console.log(`Student or Interview does not exist: {student:${req.body.student},interview:${req.body.interview}}`);
        }
    } catch (err) {
        if (req.xhr) {
            return res.status(500).json({
                success: false,
                message: "Error Encountered!",
            });
        }
        req.flash("error", "Error Encountered!");
        console.log(`Error Creating a Result: ${err}`);
    }
    return res.redirect("back");
};
module.exports.destroy = async (req, res) => {
    try {
        let result = await Result.findById(req.params.id);
        if (result) {
            await Result.deleteOne({ _id: req.params.id });
            if (req.xhr) {
                return res.status(200).json({
                    success: true,
                    message: "Result deleted!",
                });
            }
            req.flash("success", "Result deleted!");
            console.log(`Result deleted: ${result}`);
        } else {
            if (req.xhr) {
                return res.status(500).json({
                    success: false,
                    message: "Result could not be found!",
                });
            }
            req.flash("error", "Result could not be found!");
            console.log(`Result does exist: ${req.params.id}`);
        }
    } catch (err) {
        if (req.xhr) {
            return res.status(500).json({
                success: false,
                message: "Error Encountered!",
            });
        }
        req.flash("error", "Error Encountered!");
        console.log(`Error Deleting a Result: ${err}`);
    }
    return res.redirect("back");
};
module.exports.edit = async (req, res) => {
    try {
        let result = await Interview.findById(req.params.id);
        if (result) {
            let interview = await Interview.findById(req.body.interview);
            let student = await Student.findById(req.body.student);
            if (interview && student) {
                result = await Interview.findByIdAndUpdate(req.params.id, req.body);
                if (req.xhr) {
                    return res.status(200).json({
                        success: true,
                        result: result,
                        message: "Result data updated!",
                    });
                }
                req.flash("success", "Result data updated!");
                console.log(`Result data updated: ${result}`);
            } else {
                if (req.xhr) {
                    return res.status(500).json({
                        success: false,
                        message: "Student or Interview does not exist!",
                    });
                }
                req.flash("error", "Student or Interview does not exist!");
                console.log(`Student or Interview does not exist: {student:${req.body.student},interview:${req.body.interview}}`);
            }
        } else {
            if (req.xhr) {
                return res.status(500).json({
                    success: false,
                    message: "Result not found!",
                });
            }
            req.flash("error", "Result not found!");
            console.log(`Result not found: ${req.params.id}`);
        }
    } catch (err) {
        if (req.xhr) {
            return res.status(500).json({
                success: false,
                message: "Error Encountered!",
            });
        }
        req.flash("error", "Error Encountered!");
        console.log(`Error Updating a Result: ${err}`);
    }
    return res.redirect("back");
};
module.exports.download = async (req, res) => {
    try {
        const results = await Result.find().populate("student").populate("interview");
        if (results.length === 0) {
            req.flash("error", "No results found.");
        } else {
            const csvData = results.map((result) => ({
                studentId: result.student._id,
                studentName: result.student.name,
                studentCollege: result.student.college,
                studentStatus: result.student.isPlaced ? "Placed" : "Not Placed",
                dsaScore: result.student.dsaScore,
                webdScore: result.student.webdScore,
                reactScore: result.student.reactScore,
                interviewDate: moment(result.interview.date).format("ll"), // Format date as YYYY-MM-DD
                company: result.interview.company,
                status: resultStatuses[result.status],
            }));
            // const csvFilePath = "results.csv";
            const csvFilePath = path.join(__dirname, "../", `result/result-${Date.now()}.csv`);
            const csvWriter = createCsvWriter({
                path: csvFilePath,
                header: [
                    { id: "studentId", title: "Student ID" },
                    { id: "studentName", title: "Student Name" },
                    { id: "studentCollege", title: "Student College" },
                    { id: "studentStatus", title: "Student Status" },
                    { id: "dsaScore", title: "DSA Final Score" },
                    { id: "webdScore", title: "WebD Final Score" },
                    { id: "reactScore", title: "React Final Score" },
                    { id: "interviewDate", title: "Interview Date" },
                    { id: "company", title: "Interview Company" },
                    { id: "status", title: "Interview Student Result" },
                ],
            });
            try {
                await csvWriter.writeRecords(csvData);
                console.log("CSV file created successfully:", csvFilePath);
                try {
                    return res.download(csvFilePath, "results.csv");
                } catch (err) {
                    req.flash("error", "Error sending CSV file.");
                    console.error("Error sending CSV file:", err);
                }
            } catch (err) {
                req.flash("error", "Error writing CSV file.");
                console.error("Error writing CSV file:", err);
                req.flash("error", "Internal Server Error");
            }
        }
    } catch (err) {
        console.error("Error:", err);
        req.flash("error", "Internal Server Error");
    }
    return res.redirect("back");
};
