import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  EmailOutlined, 
  PhoneOutlined, 
  LocationOnOutlined,
  SendOutlined
} from '@mui/icons-material';

const Container = styled.div`
  flex: 1;
  height: 100%;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  justify-content: flex-start;
  padding: 0px 16px;
  margin: 0 auto;
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => theme.primary + 20};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
`;

const InfoText = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 8px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 8px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  min-height: 120px;
  resize: vertical;
  outline: none;
  font-family: inherit;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background: ${({ theme }) => theme.secondary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Container>
      <Wrapper>
        <Title>📞 Contact Us</Title>
        
        <ContactGrid>
          {/* Contact Information */}
          <Card>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold' }}>
              Get in Touch
            </h3>
            <p style={{ margin: '0 0 24px 0', color: '#6b7280', lineHeight: '1.5' }}>
              Have questions about PowerPulse? Need help with your fitness journey? 
              We're here to help! Reach out to us through any of the channels below.
            </p>
            
            <ContactInfo>
              <InfoItem>
                <IconWrapper>
                  <EmailOutlined />
                </IconWrapper>
                <InfoContent>
                  <InfoTitle>Email</InfoTitle>
                  <InfoText>support@powerpulse.com</InfoText>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <IconWrapper>
                  <PhoneOutlined />
                </IconWrapper>
                <InfoContent>
                  <InfoTitle>Phone</InfoTitle>
                  <InfoText>+1 (555) 123-4567</InfoText>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <IconWrapper>
                  <LocationOnOutlined />
                </IconWrapper>
                <InfoContent>
                  <InfoTitle>Address</InfoTitle>
                  <InfoText>123 Fitness Street<br />San Francisco, CA 94102</InfoText>
                </InfoContent>
              </InfoItem>
            </ContactInfo>
            
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#15803d', fontSize: '14px', fontWeight: '600' }}>
                💡 Quick Tip
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#15803d', lineHeight: '1.4' }}>
                For faster support, include your username and a detailed description of your issue when contacting us.
              </p>
            </div>
          </Card>

          {/* Contact Form */}
          <Card>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold' }}>
              Send us a Message
            </h3>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="message">Message</Label>
                <TextArea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  required
                />
              </FormGroup>
              
              <SubmitButton type="submit">
                <SendOutlined sx={{ fontSize: 18 }} />
                Send Message
              </SubmitButton>
            </form>
          </Card>
        </ContactGrid>
        
        {/* FAQ Section */}
        <Card style={{ marginTop: '16px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold' }}>
            Frequently Asked Questions
          </h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#007AFF' }}>
                How do I reset my password?
              </h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Click on "Forgot Password" on the login page and follow the instructions sent to your email.
              </p>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#007AFF' }}>
                Can I sync my data with other fitness apps?
              </h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Currently, PowerPulse works as a standalone app, but we're working on integrations with popular fitness trackers.
              </p>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#007AFF' }}>
                Is my data secure?
              </h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Yes! We use industry-standard encryption and security measures to protect your personal information and fitness data.
              </p>
            </div>
          </div>
        </Card>
      </Wrapper>
    </Container>
  );
};

export default Contact;
