const StudentSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      phoneNumber: {
        type: Number,
        required: true,
      },
      rollNo: {
        type: String,
        required: true,
        unique: true,
      },
      year: {
        type: Number,
        required: true,
      },
      branch: {
        type: String,
        required: true,
      },
      
      attendance: [
        {
          course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
          },
          batch: {
            day: {
              type: String,
              required: true,
              enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            },
            timeSlot: {
              startTime: {
                type: String, // e.g. "10:00 AM"
                required: true,
              },
              endTime: {
                type: String, // e.g. "11:00 AM"
                required: true,
              },
            },
          },
          attendedHours: {
            type: Number,
            default: 0, // Total attended hours for this course
          },
          attendanceRecords: [
            {
              date: {
                type: Date,
                required: true,
              },
              present: {
                type: Boolean,
                required: true,
              },
            },
          ],
        },
      ],
    },
    { timestamps: true }
  );
  
  const Student = mongoose.model("Student", StudentSchema);
  export default Student;
  