import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  height: 100%;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  justify-content: center;
  padding: 0px 16px;
  margin: 0 auto;
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin: 0 auto;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  max-width: 800px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: ${({ theme }) => theme.card};
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const CalorieCalculator = () => {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    unit: 'metric' // metric or imperial
  });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }
    if (!formData.height || parseFloat(formData.height) <= 0) {
      newErrors.height = 'Please enter a valid height';
    }
    if (!formData.age || parseFloat(formData.age) <= 0 || parseFloat(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateCalories = () => {
    if (!validateForm()) return;

    let weight = parseFloat(formData.weight);
    let height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    // Convert imperial to metric if needed
    if (formData.unit === 'imperial') {
      weight = weight * 0.453592; // lbs to kg
      height = height * 2.54; // inches to cm
    }

    // Calculate BMR using Mifflin-St Jeor Equation (more accurate than Harris-Benedict)
    let bmr;
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,      // Little to no exercise
      light: 1.375,        // Light exercise 1-3 days/week
      moderate: 1.55,      // Moderate exercise 3-5 days/week
      active: 1.725,       // Hard exercise 6-7 days/week
      very_active: 1.9     // Very hard exercise, physical job
    };

    const tdee = bmr * activityMultipliers[formData.activityLevel];
    
    // Calculate different calorie targets
    const maintenance = Math.round(tdee);
    const mildWeightLoss = Math.round(tdee - 250);    // 0.5 lb/week
    const moderateWeightLoss = Math.round(tdee - 500); // 1 lb/week
    const aggressiveWeightLoss = Math.round(tdee - 750); // 1.5 lb/week
    const mildWeightGain = Math.round(tdee + 250);     // 0.5 lb/week
    const moderateWeightGain = Math.round(tdee + 500);  // 1 lb/week

    setResult({
      bmr: Math.round(bmr),
      maintenance,
      weightLoss: {
        mild: Math.max(mildWeightLoss, Math.round(bmr * 1.2)), // Never go below 1.2x BMR
        moderate: Math.max(moderateWeightLoss, Math.round(bmr * 1.2)),
        aggressive: Math.max(aggressiveWeightLoss, Math.round(bmr * 1.2))
      },
      weightGain: {
        mild: mildWeightGain,
        moderate: moderateWeightGain
      },
      activityLevel: formData.activityLevel,
      unit: formData.unit
    });
  };

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise, desk job' },
    { value: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'very_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
  ];

  return (
    <Container>
      <Wrapper>
        <Title>🧮 Calorie Calculator</Title>
        <CardWrapper>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px' }}>🧮</span>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Daily Calorie Calculator
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                  Calculate your daily calorie needs based on BMR and activity level
                </p>
              </div>
            </div>

            {/* Unit Toggle */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', padding: '4px', backgroundColor: '#f3f4f6', borderRadius: '8px', width: 'fit-content' }}>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, unit: 'metric' }))}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: formData.unit === 'metric' ? '#007AFF' : 'transparent',
                    color: formData.unit === 'metric' ? 'white' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Metric (kg, cm)
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, unit: 'imperial' }))}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: formData.unit === 'imperial' ? '#007AFF' : 'transparent',
                    color: formData.unit === 'imperial' ? 'white' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Imperial (lbs, in)
                </button>
              </div>
            </div>

            {/* Form Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Weight ({formData.unit === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${errors.weight ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  placeholder={formData.unit === 'metric' ? '70' : '154'}
                />
                {errors.weight && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>{errors.weight}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Height ({formData.unit === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${errors.height ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  placeholder={formData.unit === 'metric' ? '175' : '69'}
                />
                {errors.height && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>{errors.height}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Age (years)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${errors.age ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  placeholder="25"
                />
                {errors.age && <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>{errors.age}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Activity Level */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                Activity Level
              </label>
              <div style={{ display: 'grid', gap: '8px' }}>
                {activityLevels.map((level) => (
                  <label
                    key={level.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      border: `2px solid ${formData.activityLevel === level.value ? '#007AFF' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: formData.activityLevel === level.value ? '#eff6ff' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="activityLevel"
                      value={level.value}
                      checked={formData.activityLevel === level.value}
                      onChange={handleInputChange}
                      style={{ marginRight: '12px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500', color: '#1f2937' }}>{level.label}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateCalories}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007AFF'}
            >
              Calculate My Calories 🧮
            </button>

            {/* Results */}
            {result && (
              <div style={{ marginTop: '32px' }}>
                <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📊</span> Your Personalized Calorie Breakdown
                  </h4>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                    Based on the Mifflin-St Jeor equation and your activity level, here are your daily calorie targets for different goals:
                  </p>
                </div>

                {/* BMR and Maintenance */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>{result.bmr}</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>BMR</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                      Basal Metabolic Rate - calories burned at complete rest
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '2px solid #007AFF' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚖️</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007AFF', marginBottom: '8px' }}>{result.maintenance}</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>Maintenance</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                      Calories to maintain your current weight
                    </div>
                  </div>
                </div>

                {/* Weight Loss Options */}
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '18px', fontWeight: '600', color: '#dc2626', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📉</span> Weight Loss Goals
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fef2f2', borderRadius: '12px', border: '2px solid #fca5a5' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '4px' }}>{result.weightLoss.mild}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '4px' }}>Mild Loss</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                        ~0.5 lb/week (-250 cal/day)
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fef2f2', borderRadius: '12px', border: '2px solid #dc2626' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '4px' }}>{result.weightLoss.moderate}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '4px' }}>Moderate Loss</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                        ~1 lb/week (-500 cal/day)
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fef2f2', borderRadius: '12px', border: '2px solid #b91c1c' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#b91c1c', marginBottom: '4px' }}>{result.weightLoss.aggressive}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#7f1d1d', marginBottom: '4px' }}>Aggressive Loss</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                        ~1.5 lb/week (-750 cal/day)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weight Gain Options */}
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '18px', fontWeight: '600', color: '#16a34a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📈</span> Weight Gain Goals
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '2px solid #86efac' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>{result.weightGain.mild}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#15803d', marginBottom: '4px' }}>Mild Gain</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                        ~0.5 lb/week (+250 cal/day)
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '2px solid #16a34a' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>{result.weightGain.moderate}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#15803d', marginBottom: '4px' }}>Moderate Gain</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                        ~1 lb/week (+500 cal/day)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#fef7cd', borderRadius: '12px', border: '1px solid #fbbf24' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>💡</span>
                    <div>
                      <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#92400e', margin: '0 0 8px 0' }}>Important Notes:</h5>
                      <ul style={{ fontSize: '14px', color: '#92400e', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
                        <li>These calculations use the Mifflin-St Jeor equation, which is more accurate than older formulas</li>
                        <li>Individual results may vary based on genetics, body composition, and metabolic factors</li>
                        <li>For weight loss, we never recommend going below 1.2x your BMR for safety</li>
                        <li>Gradual changes (0.5-1 lb/week) are more sustainable than aggressive approaches</li>
                        <li>Consider consulting with a healthcare provider or registered dietitian for personalized advice</li>
                        <li>Remember to focus on nutrient-dense foods and regular physical activity</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </CardWrapper>
      </Wrapper>
    </Container>
  );
};

export default CalorieCalculator;
