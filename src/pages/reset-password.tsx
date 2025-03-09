import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/database/supabase';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 3rem 1rem;
`;

const FormContainer = styled.div`
  max-width: 28rem;
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
`;

const MessageContainer = styled.div<{ type: 'success' | 'error' }>`
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: ${props => props.type === 'success' ? '#f0fdf4' : '#fef2f2'};
  color: ${props => props.type === 'success' ? '#166534' : '#991b1b'};
  border: 1px solid ${props => props.type === 'success' ? '#86efac' : '#fecaca'};
`;

const FormGroup = styled.div`
  margin-top: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  margin-top: 0.25rem;
  appearance: none;
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: #3b82f6;
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
  background-color: ${props => props.disabled ? '#93c5fd' : '#2563eb'};
  &:hover {
    background-color: ${props => props.disabled ? '#93c5fd' : '#1d4ed8'};
  }
  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-color: #3b82f6;
  }
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

const TextCenter = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const StyledLink = styled(Link)`
  font-weight: 500;
  color: #2563eb;
  &:hover {
    color: #3b82f6;
  }
`;

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const router = useRouter();

  // Rest of your component code remains the same
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    // Your existing handlePasswordReset function
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setMessage({
        text: 'Your password has been updated successfully!',
        type: 'success',
      });

      // Redirect to login page after successful password reset
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      setMessage({
        text: error.message || 'Failed to reset password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Extract tokens from URL hash and set up session
  useEffect(() => {
    // Your existing useEffect code
    const checkSession = async () => {
      try {
        // First try to get an existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If no session exists, try to extract access token from URL hash
          if (typeof window !== 'undefined') {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
    
            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');
            console.log('access_token',access_token)
            console.log('refresh_token',refresh_token)
            if (hash && hash.includes('access_token')) {
                   
              if (access_token) {
                // Set the auth session using the token from URL
                const { error } = await supabase.auth.setSession({
                  access_token: access_token,
                  refresh_token: '',
                });
                
                if (error) throw error;
                setTokenChecked(true);
                return;
              }
            }
            
            // No valid token found in URL
            setMessage({
              text: 'Invalid or expired password reset link. Please request a new one.',
              type: 'error',
            });
          }
        } else {
          setTokenChecked(true);
        }
      } catch (error: any) {
        setMessage({
          text: 'Failed to verify reset token: ' + (error.message || 'Unknown error'),
          type: 'error',
        });
      }
      setTokenChecked(true);
    };

    checkSession();
  }, []);

  return (
    <Container>
      <FormContainer>
        <div>
          <Title>Set New Password</Title>
        </div>

        {message && (
          <MessageContainer type={message.type}>
            <p>{message.text}</p>
          </MessageContainer>
        )}

        {(!message?.type || message.type !== 'error') && tokenChecked ? (
          <form onSubmit={handlePasswordReset}>
            <FormGroup>
              <Label htmlFor="password">New Password</Label>
              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Reset Password'}
              </Button>
            </FormGroup>
          </form>
        ) : !tokenChecked ? (
          <TextCenter>
            <p>Verifying reset link...</p>
          </TextCenter>
        ) : (
          <TextCenter>
            <StyledLink href="/forgot-password">
              Request a new reset link
            </StyledLink>
          </TextCenter>
        )}

        <TextCenter>
          <StyledLink href="/login">
            Back to Login
          </StyledLink>
        </TextCenter>
      </FormContainer>
    </Container>
  );
};

export default ResetPassword;