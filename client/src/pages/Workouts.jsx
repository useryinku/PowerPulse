import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import WorkoutCard from "../components/cards/WorkoutCard";
import WorkoutPlanner from "../components/WorkoutPlanner";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import { getWorkouts, addWorkout } from "../api";
import { CircularProgress, Button, Tooltip } from "@mui/material";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;
const Wrapper = styled.div`
  flex: 1;
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const Right = styled.div`
  flex: 1;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const CalendarDay = styled.div`
  background: ${({ hasWorkout, theme }) => hasWorkout ? theme.primary : 'transparent'};
  color: ${({ hasWorkout, theme }) => hasWorkout ? 'white' : 'inherit'};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ hasWorkout, theme }) => 
      hasWorkout ? theme.primary + 'dd' : theme.primary + '20'};
    transform: scale(1.1);
  }
`;

const WorkoutIndicator = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff4444;
  border: 2px solid white;
`;

const TooltipContent = styled.div`
  padding: 8px;
  max-width: 200px;
`;

const WorkoutType = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 4px;
`;

const ExerciseList = styled.div`
  font-size: 12px;
  line-height: 1.3;
`;

const Workouts = () => {
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [calendarWorkouts, setCalendarWorkouts] = useState({});

  const getTodaysWorkout = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    await getWorkouts(token, date ? `?date=${date}` : "").then((res) => {
      setTodaysWorkouts(res?.data?.todaysWorkouts);
      console.log(res.data);
      setLoading(false);
    });
  }, [date]);

  const handlePlanCreated = (plan) => {
    setWorkoutPlan(plan);
    // Add to calendar for the current week
    const newCalendarWorkouts = {};
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay() + 1); // Start from Monday
    
    plan.forEach((dayPlan) => {
      const dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(dayPlan.day);
      if (dayIndex >= 0) {
        const workoutDate = new Date(currentWeekStart);
        workoutDate.setDate(currentWeekStart.getDate() + dayIndex);
        const dateKey = workoutDate.toISOString().split('T')[0];
        newCalendarWorkouts[dateKey] = dayPlan;
      }
    });
    setCalendarWorkouts(newCalendarWorkouts);
  };

  const addToCalendar = async () => {
    if (!workoutPlan) return;
    
    const token = localStorage.getItem("fittrack-app-token");
    
    for (const dayPlan of workoutPlan) {
      const date = new Date();
      const dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(dayPlan.day);
      if (dayIndex >= 0) {
        date.setDate(date.getDate() + (dayIndex - date.getDay() + 7) % 7);
      }
      
      for (const exercise of dayPlan.exercises) {
        const workoutData = {
          category: dayPlan.type,
          workoutName: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: 60, // Default duration
          date: date
        };
        
        try {
          await addWorkout(token, workoutData);
        } catch (error) {
          console.error("Error adding workout:", error);
        }
      }
    }
    
    // Refresh today's workouts
    getTodaysWorkout();
  };

  useEffect(() => {
    getTodaysWorkout();
  }, [date, getTodaysWorkout]);

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              onChange={(e) => setDate(`${e.$M + 1}/${e.$D}/${e.$y}`)}
              slots={{
                day: (props) => {
                  const dateKey = props.day.format('YYYY-MM-DD');
                  const hasWorkout = calendarWorkouts[dateKey];
                  
                  const tooltipContent = hasWorkout ? (
                    <TooltipContent>
                      <WorkoutType>{hasWorkout.type}</WorkoutType>
                      <ExerciseList>
                        {hasWorkout.exercises.slice(0, 3).map((exercise, index) => (
                          <div key={index}>
                            • {exercise.name} ({exercise.sets}x{exercise.reps})
                          </div>
                        ))}
                        {hasWorkout.exercises.length > 3 && (
                          <div>... and {hasWorkout.exercises.length - 3} more</div>
                        )}
                      </ExerciseList>
                    </TooltipContent>
                  ) : null;

                  return (
                    <Tooltip 
                      title={tooltipContent || ""} 
                      arrow 
                      placement="top"
                      enterDelay={300}
                      leaveDelay={200}
                    >
                      <CalendarDay hasWorkout={!!hasWorkout} onClick={props.onClick}>
                        {props.day.date()}
                        {hasWorkout && <WorkoutIndicator />}
                      </CalendarDay>
                    </Tooltip>
                  );
                }
              }}
            />
          </LocalizationProvider>
        </Left>
        <Right>
          <Section>
            <SecTitle>Workout Planner</SecTitle>
            <WorkoutPlanner onPlanCreated={handlePlanCreated} />
            {workoutPlan && (
              <Button
                variant="contained"
                onClick={addToCalendar}
                style={{ marginTop: '20px' }}
              >
                Add to Calendar
              </Button>
            )}
          </Section>
          <Section>
            <SecTitle>Todays Workout</SecTitle>
            {loading ? (
              <CircularProgress />
            ) : (
              <CardWrapper>
                {todaysWorkouts.map((workout) => (
                  <WorkoutCard workout={workout} />
                ))}
              </CardWrapper>
            )}
          </Section>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Workouts;
