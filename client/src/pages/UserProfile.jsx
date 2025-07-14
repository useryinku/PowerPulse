import React, { useState } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import WorkoutPlanner from '../components/WorkoutPlanner';

// Mock data for demonstration
const mockUserData = {
  username: "FitWarrior2024",
  location: "San Francisco, CA",
  profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  xpLevel: 42,
  currentXP: 3250,
  nextLevelXP: 4000,
  streak: 15,
  totalWorkouts: 127,
  hoursTrained: 89.5,
  caloriesBurned: 15420,
  currentGoal: "Lose 10 lbs by March",
  goalProgress: 65,
  recentAchievement: "Completed 100 workouts! 🎉",
  isPublic: true,
  achievements: [
    { id: 1, name: "First Workout", icon: "🏃", rarity: "common", unlocked: true, date: "2024-01-15" },
    { id: 2, name: "10 Day Streak", icon: "🔥", rarity: "common", unlocked: true, date: "2024-02-01" },
    { id: 3, name: "100 Workouts", icon: "💯", rarity: "rare", unlocked: true, date: "2024-06-15" },
    { id: 4, name: "Marathon Runner", icon: "🏃‍♂️", rarity: "rare", unlocked: true, date: "2024-05-20" },
    { id: 5, name: "Strength Master", icon: "💪", rarity: "legendary", unlocked: false, date: null },
    { id: 6, name: "Consistency King", icon: "👑", rarity: "legendary", unlocked: false, date: null },
  ],
  weeklyActivity: [
    { day: 'Mon', steps: 8500, calories: 420, workouts: 1 },
    { day: 'Tue', steps: 12000, calories: 580, workouts: 1 },
    { day: 'Wed', steps: 6800, calories: 320, workouts: 0 },
    { day: 'Thu', steps: 15200, calories: 720, workouts: 2 },
    { day: 'Fri', steps: 9800, calories: 450, workouts: 1 },
    { day: 'Sat', steps: 18500, calories: 890, workouts: 2 },
    { day: 'Sun', steps: 7200, calories: 340, workouts: 1 },
  ],
  goals: [
    { id: 1, title: "Lose 10 lbs", progress: 65, target: 10, current: 6.5, unit: "lbs", completed: false },
    { id: 2, title: "Run 5K under 25 min", progress: 80, target: 25, current: 26.5, unit: "min", completed: false },
    { id: 3, title: "Complete 50 workouts", progress: 100, target: 50, current: 50, unit: "workouts", completed: true },
    { id: 4, title: "Bench press bodyweight", progress: 45, target: 180, current: 135, unit: "lbs", completed: false },
  ],
  friends: [
    { id: 1, name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face", comment: "Great workout today! 💪", time: "2h ago" },
    { id: 2, name: "Mike R.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", comment: "Keep up the streak! 🔥", time: "4h ago" },
    { id: 3, name: "Emma L.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face", comment: "Awesome progress on your goals!", time: "1d ago" },
  ]
};


const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [achievementFilter, setAchievementFilter] = useState('all');
  const [activityMetric, setActivityMetric] = useState('steps');
  const [isPublic, setIsPublic] = useState(mockUserData.isPublic);
  const [workoutPlans, setWorkoutPlans] = useState([]);

  const handlePlanCreated = (plans) => {
    setWorkoutPlans(plans);
  };

  const filteredAchievements = mockUserData.achievements.filter(achievement => {
    if (achievementFilter === 'all') return true;
    if (achievementFilter === 'recent') return achievement.unlocked && new Date(achievement.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (achievementFilter === 'rare') return achievement.rarity === 'rare' || achievement.rarity === 'legendary';
    return true;
  });

  const getActivityData = () => {
    return mockUserData.weeklyActivity.map(day => ({
      ...day,
      value: day[activityMetric]
    }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'activity', label: 'Activity', icon: '�' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'workout-plans', label: 'Workout Plans', icon: '�' },
  ];

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '24px'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(to right, #007AFF, #5B86E5)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '32px',
          marginBottom: '32px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={mockUserData.profilePhoto}
                alt="Profile"
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  border: '4px solid white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                right: '-8px',
                backgroundColor: '#00ff6a',
                color: 'white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {mockUserData.xpLevel}
              </div>
            </div>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{mockUserData.username}</h1>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isPublic ? '#00ff6a' : 'rgba(255, 255, 255, 0.2)',
                    color: 'white'
                  }}
                >
                  {isPublic ? 'Public' : 'Private'}
                </button>
              </div>
              <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '16px' }}>📍 {mockUserData.location}</p>
              
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Recent Achievement</p>
                <p style={{ fontWeight: '600', margin: 0 }}>{mockUserData.recentAchievement}</p>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', opacity: 0.9 }}>XP Progress</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{mockUserData.currentXP}/{mockUserData.nextLevelXP}</span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '9999px', height: '12px' }}>
                  <div 
                    style={{
                      height: '12px',
                      borderRadius: '9999px',
                      backgroundColor: '#00ff6a',
                      width: `${(mockUserData.currentXP / mockUserData.nextLevelXP) * 100}%`,
                      transition: 'all 0.5s'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #e5e7eb' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 24px',
                  fontWeight: '500',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: activeTab === tab.id ? '#007AFF' : '#6b7280',
                  borderBottom: activeTab === tab.id ? '2px solid #007AFF' : 'none'
                }}
              >
                <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div style={{ ...cardStyle, textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔥</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007AFF' }}>{mockUserData.streak}</div>
                <div style={{ color: '#6b7280' }}>Day Streak</div>
              </div>
              
              <div style={{ ...cardStyle, textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>💪</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007AFF' }}>{mockUserData.totalWorkouts}</div>
                <div style={{ color: '#6b7280' }}>Total Workouts</div>
              </div>
              
              <div style={{ ...cardStyle, textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>⏱️</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007AFF' }}>{mockUserData.hoursTrained}h</div>
                <div style={{ color: '#6b7280' }}>Hours Trained</div>
              </div>
            </div>

            {/* Friends Activity and Current Goal */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              <div style={cardStyle}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Friends Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {mockUserData.friends.map((friend) => (
                    <div key={friend.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '500', color: '#1f2937' }}>{friend.name}</span>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>{friend.time}</span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{friend.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Current Goal Progress</h3>
                <div style={{ background: 'linear-gradient(to right, #007AFF, #5B86E5)', borderRadius: '8px', padding: '24px', color: 'white' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{mockUserData.currentGoal}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', opacity: 0.9 }}>Progress</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{mockUserData.goalProgress}%</span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '9999px', height: '12px' }}>
                    <div 
                      style={{
                        height: '12px',
                        borderRadius: '9999px',
                        backgroundColor: '#00ff6a',
                        width: `${mockUserData.goalProgress}%`,
                        transition: 'all 0.5s'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Achievements</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'recent', 'rare'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAchievementFilter(filter)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      backgroundColor: achievementFilter === filter ? '#007AFF' : '#f3f4f6',
                      color: achievementFilter === filter ? 'white' : '#374151'
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {filteredAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: achievement.unlocked ? '#007AFF' : '#e5e7eb',
                    backgroundColor: achievement.unlocked ? '#eff6ff' : '#f9fafb',
                    opacity: achievement.unlocked ? 1 : 0.6,
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{achievement.icon}</div>
                  <h4 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>{achievement.name}</h4>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: achievement.rarity === 'common' ? '#e5e7eb' : 
                                   achievement.rarity === 'rare' ? '#fed7aa' : '#e9d5ff',
                    color: achievement.rarity === 'common' ? '#374151' :
                           achievement.rarity === 'rare' ? '#c2410c' : '#7c3aed'
                  }}>
                    {achievement.rarity}
                  </span>
                  {achievement.unlocked && achievement.date && (
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '8px 0 0 0' }}>
                      Unlocked: {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Weekly Activity</h3>
              <select
                value={activityMetric}
                onChange={(e) => setActivityMetric(e.target.value)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="steps">Steps</option>
                <option value="calories">Calories</option>
                <option value="workouts">Workouts</option>
              </select>
            </div>
            
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getActivityData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#007AFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div style={cardStyle}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Goals</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {mockUserData.goals.map((goal) => (
                <div
                  key={goal.id}
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: goal.completed ? '#00ff6a' : '#e5e7eb',
                    backgroundColor: goal.completed ? '#f0fdf4' : 'white',
                    opacity: goal.completed ? 0.75 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <h4 style={{ 
                      fontWeight: 'bold', 
                      fontSize: '18px',
                      color: goal.completed ? '#6b7280' : '#1f2937',
                      textDecoration: goal.completed ? 'line-through' : 'none',
                      margin: 0
                    }}>
                      {goal.title}
                    </h4>
                    {goal.completed && <span style={{ fontSize: '24px' }}>✅</span>}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#007AFF' }}>
                      {goal.progress}%
                    </span>
                  </div>
                  
                  <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '12px' }}>
                    <div
                      style={{
                        height: '12px',
                        borderRadius: '9999px',
                        backgroundColor: goal.completed ? '#00ff6a' : '#007AFF',
                        width: `${Math.min(goal.progress, 100)}%`,
                        transition: 'all 0.5s'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workout-plans' && (
          <div>
            <WorkoutPlanner onPlanCreated={handlePlanCreated} />
            
            {workoutPlans.length > 0 && (
              <div style={{ ...cardStyle, marginTop: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Your Generated Workout Plans</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  {workoutPlans.map((plan, index) => (
                    <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{plan.day}</h4>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: '#007AFF',
                          color: 'white',
                          borderRadius: '9999px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {plan.type}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {plan.exercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: exerciseIndex === plan.exercises.length - 1 ? 'none' : '1px solid #f3f4f6'
                          }}>
                            <span style={{ fontWeight: '500', color: '#1f2937' }}>{exercise.name}</span>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                              {exercise.sets} × {exercise.reps}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserProfile;
