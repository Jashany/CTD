import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
      unique: true,
    }, 
    courseDescription: {
      type: String,
      required: true,
    },
    courseStartDate: {
      type: Date,
      required: true,
    },
    courseEndDate: {
      type: Date,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    supervisors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supervisor",
      },
    ],
    batches: [
      {
        day: {
          type: String,
          required: true,
          enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
        startTime: {
          type: String, // e.g. "10:00 AM"
          required: true,
        },
        endTime: {
          type: String, // e.g. "11:00 AM"
          required: true,
        },
      },
    ],
    classDays: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);
export default Course;
