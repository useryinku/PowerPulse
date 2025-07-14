import React, { useState } from "react";
import styled from "styled-components";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Card, 
  CardContent, 
  Typography,
  Chip,
  Box
} from "@mui/material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;

const PlanCard = styled(Card)`
  margin-bottom: 16px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
`;

const ExerciseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.text_primary + 10};
  
  &:last-child {
    border-bottom: none;
  }
`;

// Workout templates
const workoutTemplates = {
  2: {
    name: "Upper/Lower Split",
    days: [
      {
        day: "Monday",
        type: "Upper Body",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", weight: 0 },
          { name: "Bent Over Row", sets: 4, reps: "8-10", weight: 0 },
          { name: "Overhead Press", sets: 3, reps: "10-12", weight: 0 },
          { name: "Pull-ups/Lat Pulldown", sets: 3, reps: "8-12", weight: 0 },
          { name: "Dips", sets: 3, reps: "10-15", weight: 0 },
          { name: "Bicep Curls", sets: 3, reps: "12-15", weight: 0 },
          { name: "Tricep Extensions", sets: 3, reps: "12-15", weight: 0 }
        ]
      },
      {
        day: "Thursday",
        type: "Lower Body",
        exercises: [
          { name: "Squats", sets: 4, reps: "8-10", weight: 0 },
          { name: "Romanian Deadlifts", sets: 4, reps: "8-10", weight: 0 },
          { name: "Bulgarian Split Squats", sets: 3, reps: "10-12", weight: 0 },
          { name: "Hip Thrusts", sets: 3, reps: "12-15", weight: 0 },
          { name: "Walking Lunges", sets: 3, reps: "12-15", weight: 0 },
          { name: "Calf Raises", sets: 4, reps: "15-20", weight: 0 },
          { name: "Plank", sets: 3, reps: "30-60s", weight: 0 }
        ]
      }
    ]
  },
  3: {
    name: "Push/Pull/Legs",
    days: [
      {
        day: "Monday",
        type: "Push",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", weight: 0 },
          { name: "Overhead Press", sets: 4, reps: "8-10", weight: 0 },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: 0 },
          { name: "Dips", sets: 3, reps: "10-15", weight: 0 },
          { name: "Lateral Raises", sets: 3, reps: "12-15", weight: 0 },
          { name: "Tricep Pushdowns", sets: 3, reps: "12-15", weight: 0 },
          { name: "Overhead Tricep Extension", sets: 3, reps: "12-15", weight: 0 }
        ]
      },
      {
        day: "Wednesday",
        type: "Pull",
        exercises: [
          { name: "Deadlifts", sets: 4, reps: "6-8", weight: 0 },
          { name: "Pull-ups/Lat Pulldown", sets: 4, reps: "8-12", weight: 0 },
          { name: "Bent Over Row", sets: 4, reps: "8-10", weight: 0 },
          { name: "Face Pulls", sets: 3, reps: "12-15", weight: 0 },
          { name: "Barbell Curls", sets: 3, reps: "10-12", weight: 0 },
          { name: "Hammer Curls", sets: 3, reps: "12-15", weight: 0 },
          { name: "Cable Curls", sets: 3, reps: "12-15", weight: 0 }
        ]
      },
      {
        day: "Friday",
        type: "Legs",
        exercises: [
          { name: "Squats", sets: 4, reps: "8-10", weight: 0 },
          { name: "Romanian Deadlifts", sets: 4, reps: "8-10", weight: 0 },
          { name: "Leg Press", sets: 3, reps: "12-15", weight: 0 },
          { name: "Bulgarian Split Squats", sets: 3, reps: "10-12", weight: 0 },
          { name: "Leg Curls", sets: 3, reps: "12-15", weight: 0 },
          { name: "Calf Raises", sets: 4, reps: "15-20", weight: 0 },
          { name: "Abs Circuit", sets: 3, reps: "15-20", weight: 0 }
        ]
      }
    ]
  }
};

// Custom workout generator for 4+ days
const generateCustomWorkout = (daysPerWeek) => {
  const customPlans = {
    4: {
      name: "Upper/Lower Split (4 Days)",
      days: [
        {
          day: "Monday",
          type: "Upper Body",
          exercises: [
            { name: "Bench Press", sets: 4, reps: "6-8", weight: 0 },
            { name: "Bent Over Row", sets: 4, reps: "6-8", weight: 0 },
            { name: "Overhead Press", sets: 3, reps: "8-10", weight: 0 },
            { name: "Pull-ups", sets: 3, reps: "8-12", weight: 0 },
            { name: "Dips", sets: 3, reps: "10-12", weight: 0 },
            { name: "Barbell Curls", sets: 3, reps: "10-12", weight: 0 }
          ]
        },
        {
          day: "Tuesday",
          type: "Lower Body",
          exercises: [
            { name: "Squats", sets: 4, reps: "6-8", weight: 0 },
            { name: "Romanian Deadlifts", sets: 4, reps: "8-10", weight: 0 },
            { name: "Bulgarian Split Squats", sets: 3, reps: "10-12", weight: 0 },
            { name: "Hip Thrusts", sets: 3, reps: "12-15", weight: 0 },
            { name: "Calf Raises", sets: 4, reps: "15-20", weight: 0 },
            { name: "Plank", sets: 3, reps: "45-60s", weight: 0 }
          ]
        },
        {
          day: "Thursday",
          type: "Upper Body",
          exercises: [
            { name: "Incline Dumbbell Press", sets: 4, reps: "8-10", weight: 0 },
            { name: "Lat Pulldown", sets: 4, reps: "8-10", weight: 0 },
            { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", weight: 0 },
            { name: "Cable Rows", sets: 3, reps: "10-12", weight: 0 },
            { name: "Lateral Raises", sets: 3, reps: "12-15", weight: 0 },
            { name: "Tricep Extensions", sets: 3, reps: "12-15", weight: 0 }
          ]
        },
        {
          day: "Friday",
          type: "Lower Body",
          exercises: [
            { name: "Deadlifts", sets: 4, reps: "5-6", weight: 0 },
            { name: "Front Squats", sets: 3, reps: "8-10", weight: 0 },
            { name: "Walking Lunges", sets: 3, reps: "12-15", weight: 0 },
            { name: "Leg Curls", sets: 3, reps: "12-15", weight: 0 },
            { name: "Leg Extensions", sets: 3, reps: "12-15", weight: 0 },
            { name: "Russian Twists", sets: 3, reps: "20-30", weight: 0 }
          ]
        }
      ]
    },
    5: {
      name: "Push/Pull/Legs/Upper/Lower",
      days: [
        {
          day: "Monday",
          type: "Push",
          exercises: [
            { name: "Bench Press", sets: 4, reps: "6-8", weight: 0 },
            { name: "Overhead Press", sets: 4, reps: "8-10", weight: 0 },
            { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: 0 },
            { name: "Lateral Raises", sets: 4, reps: "12-15", weight: 0 },
            { name: "Tricep Dips", sets: 3, reps: "10-15", weight: 0 },
            { name: "Close Grip Bench Press", sets: 3, reps: "10-12", weight: 0 }
          ]
        },
        {
          day: "Tuesday",
          type: "Pull",
          exercises: [
            { name: "Deadlifts", sets: 4, reps: "5-6", weight: 0 },
            { name: "Pull-ups", sets: 4, reps: "8-12", weight: 0 },
            { name: "Bent Over Row", sets: 4, reps: "8-10", weight: 0 },
            { name: "Face Pulls", sets: 3, reps: "15-20", weight: 0 },
            { name: "Barbell Curls", sets: 3, reps: "10-12", weight: 0 },
            { name: "Hammer Curls", sets: 3, reps: "12-15", weight: 0 }
          ]
        },
        {
          day: "Wednesday",
          type: "Legs",
          exercises: [
            { name: "Squats", sets: 4, reps: "6-8", weight: 0 },
            { name: "Romanian Deadlifts", sets: 4, reps: "8-10", weight: 0 },
            { name: "Bulgarian Split Squats", sets: 3, reps: "10-12", weight: 0 },
            { name: "Leg Press", sets: 3, reps: "15-20", weight: 0 },
            { name: "Calf Raises", sets: 4, reps: "15-20", weight: 0 },
            { name: "Abs Circuit", sets: 3, reps: "15-20", weight: 0 }
          ]
        },
        {
          day: "Friday",
          type: "Upper Body",
          exercises: [
            { name: "Incline Barbell Press", sets: 4, reps: "8-10", weight: 0 },
            { name: "T-Bar Row", sets: 4, reps: "8-10", weight: 0 },
            { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", weight: 0 },
            { name: "Cable Rows", sets: 3, reps: "10-12", weight: 0 },
            { name: "Preacher Curls", sets: 3, reps: "12-15", weight: 0 },
            { name: "Overhead Tricep Extension", sets: 3, reps: "12-15", weight: 0 }
          ]
        },
        {
          day: "Saturday",
          type: "Lower Body",
          exercises: [
            { name: "Front Squats", sets: 4, reps: "8-10", weight: 0 },
            { name: "Stiff Leg Deadlifts", sets: 4, reps: "10-12", weight: 0 },
            { name: "Walking Lunges", sets: 3, reps: "12-15", weight: 0 },
            { name: "Leg Curls", sets: 3, reps: "12-15", weight: 0 },
            { name: "Hip Thrusts", sets: 3, reps: "15-20", weight: 0 },
            { name: "Plank Variations", sets: 3, reps: "45-60s", weight: 0 }
          ]
        }
      ]
    },
    6: {
      name: "Push/Pull/Legs x2",
      days: [
        {
          day: "Monday",
          type: "Push",
          exercises: [
            { name: "Bench Press", sets: 4, reps: "6-8", weight: 0 },
            { name: "Overhead Press", sets: 4, reps: "8-10", weight: 0 },
            { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: 0 },
            { name: "Lateral Raises", sets: 4, reps: "12-15", weight: 0 },
            { name: "Tricep Dips", sets: 3, reps: "12-15", weight: 0 },
            { name: "Diamond Push-ups", sets: 3, reps: "10-15", weight: 0 }
          ]
        },
        {
          day: "Tuesday",
          type: "Pull",
          exercises: [
            { name: "Deadlifts", sets: 4, reps: "5-6", weight: 0 },
            { name: "Pull-ups", sets: 4, reps: "8-12", weight: 0 },
            { name: "Bent Over Row", sets: 4, reps: "8-10", weight: 0 },
            { name: "Face Pulls", sets: 3, reps: "15-20", weight: 0 },
            { name: "Barbell Curls", sets: 3, reps: "10-12", weight: 0 },
            { name: "Cable Hammer Curls", sets: 3, reps: "12-15", weight: 0 }
          ]
        },
        {
          day: "Wednesday",
          type: "Legs",
          exercises: [
            { name: "Squats", sets: 4, reps: "6-8", weight: 0 },
            { name: "Romanian Deadlifts", sets: 4, reps: "8-10", weight: 0 },
            { name: "Bulgarian Split Squats", sets: 3, reps: "10-12", weight: 0 },
            { name: "Leg Press", sets: 3, reps: "15-20", weight: 0 },
            { name: "Calf Raises", sets: 4, reps: "15-20", weight: 0 },
            { name: "Hanging Leg Raises", sets: 3, reps: "12-15", weight: 0 }
          ]
        },
        {
          day: "Thursday",
          type: "Push",
          exercises: [
            { name: "Incline Barbell Press", sets: 4, reps: "8-10", weight: 0 },
            { name: "Dumbbell Shoulder Press", sets: 4, reps: "10-12", weight: 0 },
            { name: "Decline Dumbbell Press", sets: 3, reps: "10-12", weight: 0 },
            { name: "Arnold Press", sets: 3, reps: "12-15", weight: 0 },
            { name: "Close Grip Bench Press", sets: 3, reps: "10-12", weight: 0 },
            { name: "Tricep Pushdowns", sets: 3, reps: "12-15", weight: 0 }
          ]
        },
        {
          day: "Friday",
          type: "Pull",
          exercises: [
            { name: "T-Bar Row", sets: 4, reps: "8-10", weight: 0 },
            { name: "Lat Pulldown", sets: 4, reps: "10-12", weight: 0 },
            { name: "Cable Rows", sets: 4, reps: "10-12", weight: 0 },
            { name: "Reverse Flyes", sets: 3, reps: "15-20", weight: 0 },
            { name: "Preacher Curls", sets: 3, reps: "10-12", weight: 0 },
            { name: "21s Bicep Curls", sets: 3, reps: "21", weight: 0 }
          ]
        },
        {
          day: "Saturday",
          type: "Legs",
          exercises: [
            { name: "Front Squats", sets: 4, reps: "8-10", weight: 0 },
            { name: "Stiff Leg Deadlifts", sets: 4, reps: "10-12", weight: 0 },
            { name: "Walking Lunges", sets: 3, reps: "12-15", weight: 0 },
            { name: "Leg Curls", sets: 3, reps: "12-15", weight: 0 },
            { name: "Hip Thrusts", sets: 3, reps: "15-20", weight: 0 },
            { name: "Plank to Push-up", sets: 3, reps: "10-15", weight: 0 }
          ]
        }
      ]
    }
  };

  return customPlans[daysPerWeek] || customPlans[6];
};

const WorkoutPlanner = ({ onPlanCreated }) => {
  const [daysPerWeek, setDaysPerWeek] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const handleGeneratePlan = () => {
    let plan;
    
    if (daysPerWeek <= 3) {
      plan = workoutTemplates[daysPerWeek];
    } else {
      plan = generateCustomWorkout(daysPerWeek);
    }
    
    if (plan) {
      setGeneratedPlan(plan);
      onPlanCreated(plan.days);
    }
  };

  return (
    <Container>
      <Typography variant="h6" color="primary" gutterBottom>
        Workout Plan Generator
      </Typography>
      
      <FormControl fullWidth>
        <InputLabel>Days per Week</InputLabel>
        <Select
          value={daysPerWeek}
          label="Days per Week"
          onChange={(e) => setDaysPerWeek(e.target.value)}
        >
          <MenuItem value={2}>2 Days</MenuItem>
          <MenuItem value={3}>3 Days</MenuItem>
          <MenuItem value={4}>4 Days</MenuItem>
          <MenuItem value={5}>5 Days</MenuItem>
          <MenuItem value={6}>6 Days</MenuItem>
        </Select>
      </FormControl>

      <Button 
        variant="contained" 
        onClick={handleGeneratePlan}
        disabled={!daysPerWeek}
        sx={{ mt: 2 }}
      >
        Generate Workout Plan
      </Button>

      {generatedPlan && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {generatedPlan.name}
          </Typography>
          
          {generatedPlan.days.map((day, index) => (
            <PlanCard key={index}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography variant="h6">{day.day}</Typography>
                  <Chip 
                    label={day.type} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                
                {day.exercises.map((exercise, exerciseIndex) => (
                  <ExerciseItem key={exerciseIndex}>
                    <Typography variant="body1">
                      {exercise.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exercise.sets} sets × {exercise.reps} reps
                    </Typography>
                  </ExerciseItem>
                ))}
              </CardContent>
            </PlanCard>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default WorkoutPlanner;
