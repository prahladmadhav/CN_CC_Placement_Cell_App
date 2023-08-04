const Interview = require("../models/interview.model");
const Result = require("../models/result.model");
const moment = require("moment");

module.exports.viewAll = async (req, res) => {
    let interviews;
    try {
        interviews = await Interview.find({}).sort("-createdAt");
        interviews.forEach((interview) => {
            if (interview.date == null) {
                interview.formatedDate = "No Date Set";
            } else {
                interview.formatedDate = moment(interview.date).format("ll");
            }
        });
    } catch (err) {
        interviews = [];
        req.flash("error", "Error Encountered!");
        console.log(`Interviews not Loaded: ${err}`);
    }
    return res.render("interview", {
        title: "Interview Desk",
        interviews: interviews,
    });
};
module.exports.single = async (req, res) => {
    try {
        let interviewSingle = await Interview.findById(req.params.id);
        if (interviewSingle) {
            interviewSingle.formatedDate = moment(interviewSingle.date).format("ll");
            interviewSingle.inputDate = moment(interviewSingle.date).format("YYYY-MM-DD");
            return res.render("interview_single", {
                title: interviewSingle.company,
                interviewSingle: interviewSingle,
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
        let interview = await Interview.create(req.body);
        if (req.xhr) {
            return res.status(200).json({
                success: true,
                interview: interview,
                message: "Interview created!",
            });
        }
        req.flash("success", "Interview created!");
        console.log(`Interview created: ${interview.id}`);
    } catch (err) {
        if (req.xhr) {
            return res.status(500).json({
                success: false,
                message: "Error Encountered!",
            });
        }
        req.flash("error", "Error Encountered!");
        console.log(`Error Creating an Interview: ${err}`);
    }
    return res.redirect("back");
};
module.exports.destroy = async (req, res) => {
    try {
        let interview = await Interview.findById(req.params.id);
        if (interview) {
            await Interview.deleteOne({ _id: req.params.id });
            await Result.deleteMany({ interview: req.params.id });
            if (req.xhr) {
                return res.status(200).json({
                    success: true,
                    message: "Interview deleted!",
                });
            }
            req.flash("success", "Interview deleted!");
            console.log(`Interview deleted: ${interview}`);
        } else {
            if (req.xhr) {
                return res.status(500).json({
                    success: false,
                    message: "Interview could not be found!",
                });
            }
            req.flash("error", "Interview could not be found!");
            console.log(`Interview does exist: ${req.params.id}`);
        }
    } catch (err) {
        if (req.xhr) {
            return res.status(500).json({
                success: false,
                message: "Error Encountered!",
            });
        }
        req.flash("error", "Error Encountered!");
        console.log(`Error Deleting an Interview: ${err}`);
    }
    return res.redirect("back");
};
module.exports.edit = async (req, res) => {
    try {
        let interview = await Interview.findById(req.params.id);
        if (interview) {
            interview = await Interview.findByIdAndUpdate(req.params.id, req.body);
            if (req.xhr) {
                return res.status(200).json({
                    success: true,
                    interview: interview,
                    message: "Interview data updated!",
                });
            }
            req.flash("success", "Interview data updated!");
            console.log(`Interview data updated: ${interview.id}`);
        } else {
            if (req.xhr) {
                return res.status(500).json({
                    success: false,
                    message: "Interview not found!",
                });
            }
            req.flash("error", "Interview not found!");
            console.log(`Interview not found: ${req.params.id}`);
        }
    } catch (err) {
        if (req.xhr) {
            return res.status(500).json({
                success: false,
                message: "Error Encountered!",
            });
        }
        req.flash("error", "Error Encountered!");
        console.log(`Error Updating an Interview: ${err}`);
    }
    return res.redirect("back");
};
