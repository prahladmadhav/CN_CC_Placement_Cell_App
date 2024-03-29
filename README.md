# Placement Cell App

## Table of Contents
1. [Introduction](#introduction)
2. [Task](#task)
3. [Pages](#pages)
4. [CSV Data Format](#csv-data-format)
5. [Getting Started](#getting-started)
6. [Dependencies](#dependencies)
7. [Installation](#installation)
8. [Usage](#usage)
9. [License](#license)

## Introduction
This project aims to create an interface for employees of a company to manage and maintain a database of student interviews. The system allows employees to add and view student details, course scores, interview schedules, and results. Additionally, employees can download the entire database in CSV format for compiling various reports.

## Task
The project focuses on managing the following data for student interviews:
- Batch
- Student Details (including college and status: placed, not_placed)
- Course Scores (DSA Final Score, WebD Final Score, React Final Score)
- Interviews (company name and date)
- Results (mapping between company and student, with result options: PASS, FAIL, On Hold, Didn’t Attempt)

## Pages
The system provides the following pages to facilitate data management:
1. Sign Up and Sign In: These pages are exclusively for employees to log in and access the system.
2. List of Students + Add New Student: Employees can view the list of students and add new students to the database.
3. List of Interviews + Create an Interview: Employees can see the list of interviews and schedule new interviews by specifying the date.
4. Allocate a Student to an Interview: Employees can assign students to specific interviews.
5. Interview Details and Result Status: Employees can select an interview to view all students associated with it and mark their result status (PASS, FAIL, On Hold, Didn't Attempt) directly from the list page.

## CSV Data Format
The complete CSV file contains the following columns:
- Student ID
- Student Name
- Student College
- Student Status
- DSA Final Score
- WebD Final Score
- React Final Score
- Interview Date
- Interview Company
- Interview Result

A student can have multiple entries based on the interviews they have attended.

## Getting Started
To set up the project locally, follow the instructions in the [Installation](#installation) section.

## Dependencies
Kindly refer to the package.json file for the dependencies

## Installation
1. Clone the repository: `git clone https://github.com/prahladmadhav/CN_CC_Placement_Cell_App.git`
2. Navigate to the project directory: `cd CN_CC_Placement_Cell_App`
3. Install dependencies: `npm install`

## Usage
1. Run the front-end application: `npm start`
2. Access the application in your browser at `http://localhost:8000`

## License
This project is licensed under the [MIT License](LICENSE).

---

Thank you for using our Employee Data Management System! We hope this system enhances your data management experience and simplifies report generation. Happy interviewing!