import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

dotenv.config();

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    // Input validation
    if (!email || !password || !name) {
      return next(createError(400, "Name, email, and password are required"));
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(createError(400, "Please provide a valid email address"));
    }

    // Password strength validation
    if (password.length < 6) {
      return next(createError(400, "Password must be at least 6 characters long"));
    }

    // Name validation
    if (name.trim().length < 2) {
      return next(createError(400, "Name must be at least 2 characters long"));
    }

    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return next(createError(400, "Email and password are required"));
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(createError(400, "Please provide a valid email address"));
    }

    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found"));
    }
    console.log(user);
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const currentDateFormatted = new Date();
    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );
    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    //calculte total calories burnt
    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: null,
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    //Calculate total no of workouts
    const totalWorkouts = await Workout.countDocuments({
      user: userId,
      date: { $gte: startToday, $lt: endToday },
    });

    //Calculate average calories burnt per workout
    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    // Fetch category of workouts
    const categoryCalories = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    //Format category data for pie chart

    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    const weeks = [];
    const caloriesBurnt = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
      );
      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );

      const weekData = await Workout.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by date in ascending order
        },
      ]);

      caloriesBurnt.push(
        weekData[0]?.totalCaloriesBurnt ? weekData[0]?.totalCaloriesBurnt : 0
      );
    }

    return res.status(200).json({
      totalCaloriesBurnt:
        totalCaloriesBurnt.length > 0
          ? totalCaloriesBurnt[0].totalCaloriesBurnt
          : 0,
      totalWorkouts: totalWorkouts,
      avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,
      totalWeeksCaloriesBurnt: {
        weeks: weeks,
        caloriesBurned: caloriesBurnt,
      },
      pieChartData: pieChartData,
    });
  } catch (err) {
    next(err);
  }
};

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    let date = req.query.date ? new Date(req.query.date) : new Date();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );

    const todaysWorkouts = await Workout.find({
      user: userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });
    const totalCaloriesBurnt = todaysWorkouts.reduce(
      (total, workout) => total + workout.caloriesBurned,
      0
    );

    return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
  } catch (err) {
    next(err);
  }
};

export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const workoutData = req.body;
    
    if (!workoutData || !workoutData.category || !workoutData.workoutName) {
      return next(createError(400, "Required workout fields are missing"));
    }

    // Create workout object
    const workout = {
      user: userId,
      category: workoutData.category,
      workoutName: workoutData.workoutName,
      sets: workoutData.sets || 0,
      reps: workoutData.reps || 0,
      weight: workoutData.weight || 0,
      duration: workoutData.duration || 0,
      date: workoutData.date ? new Date(workoutData.date) : new Date(),
      caloriesBurned: calculateCaloriesBurnt(workoutData)
    };

    const savedWorkout = await Workout.create(workout);

    return res.status(201).json({
      message: "Workout added successfully",
      workout: savedWorkout,
    });
  } catch (err) {
    console.error("Error in addWorkout:", err);
    next(err);
  }
};

// Function to parse workout data from array of lines
const parseWorkoutData = (workoutData, category) => {
  if (workoutData.length < 4) {
    console.log(`Insufficient workout data for category ${category}:`, workoutData);
    return null;
  }

  try {
    const workoutName = workoutData[0];
    
    // Parse sets and reps - handle both "5 setsX15 reps" and separate "5" "15" formats
    let sets, reps, weight, duration;
    
    if (workoutData.length === 4) {
      // Format: "5 setsX15 reps", "30 kg", "10 min"
      const setsRepsMatch = workoutData[1].match(/(\d+)\s*sets?\s*[xX]\s*(\d+)\s*reps?/i);
      if (setsRepsMatch) {
        sets = parseInt(setsRepsMatch[1]);
        reps = parseInt(setsRepsMatch[2]);
      } else {
        console.log(`Invalid sets/reps format: ${workoutData[1]}`);
        return null;
      }
      
      // Parse weight (remove "kg" suffix)
      const weightMatch = workoutData[2].match(/(\d+(?:\.\d+)?)/);
      weight = weightMatch ? parseFloat(weightMatch[1]) : 0;
      
      // Parse duration (remove "min" suffix)
      const durationMatch = workoutData[3].match(/(\d+(?:\.\d+)?)/);
      duration = durationMatch ? parseFloat(durationMatch[1]) : 0;
      
    } else if (workoutData.length >= 5) {
      // Format: separate lines for sets, reps, weight, duration
      sets = parseInt(workoutData[1]);
      reps = parseInt(workoutData[2]);
      weight = parseFloat(workoutData[3]);
      duration = parseFloat(workoutData[4]);
    } else {
      console.log(`Invalid workout data format for ${category}`);
      return null;
    }

    const details = {
      category: category,
      workoutName: workoutName,
      sets: sets,
      reps: reps,
      weight: weight,
      duration: duration,
      date: new Date()
    };

    // Validate parsed data
    if (isNaN(details.sets) || isNaN(details.reps) || isNaN(details.weight) || isNaN(details.duration)) {
      console.log(`Invalid numeric data in workout:`, details);
      return null;
    }

    if (details.sets <= 0 || details.reps <= 0 || details.weight < 0 || details.duration <= 0) {
      console.log(`Invalid values (sets, reps, duration must be positive, weight can be 0):`, details);
      return null;
    }

    return details;
  } catch (error) {
    console.log(`Error parsing workout data:`, error);
    return null;
  }
};

// Function to calculate calories burnt for a workout
const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = parseInt(workoutDetails.duration);
  const weightInKg = parseInt(workoutDetails.weight);
  const sets = parseInt(workoutDetails.sets);
  const reps = parseInt(workoutDetails.reps);
  
  // Base metabolic equivalent (MET) values for different workout types
  // This is a simplified calculation - in reality, it would depend on specific exercises
  let metValue = 6.0; // Default MET value for moderate strength training
  
  // Adjust MET based on workout intensity (estimated from sets, reps, and weight)
  const intensity = (sets * reps * weightInKg) / durationInMinutes;
  
  if (intensity > 100) {
    metValue = 8.0; // High intensity
  } else if (intensity > 50) {
    metValue = 7.0; // Moderate-high intensity
  } else if (intensity > 25) {
    metValue = 6.0; // Moderate intensity
  } else {
    metValue = 4.0; // Low intensity
  }
  
  // Calories burned = MET × weight in kg × time in hours
  // Assuming average body weight of 70kg for the user (this could be made dynamic)
  const userWeight = 70; // This should ideally come from user profile
  const timeInHours = durationInMinutes / 60;
  
  const caloriesBurned = metValue * userWeight * timeInHours;
  
  return Math.round(caloriesBurned * 100) / 100; // Round to 2 decimal places
};
