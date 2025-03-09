import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { supabase } from '@/database/supabase';

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
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: #1f2937;
`;

const SubTitle = styled.p`
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #4b5563;
`;

const MessageBox = styled.div<{ type: 'success' | 'error' }>`
  border-radius: 0.375rem;
  padding: 1rem;
  margin-top: 1.5rem;
  background-color: ${props => props.type === 'success' ? '#f0fdf4' : '#fef2f2'};
  color: ${props => props.type === 'success' ? '#166534' : '#991b1b'};
  border: 1px solid ${props => props.type === 'success' ? '#86efac' : '#fecaca'};
`;

const Form = styled.form`
  margin-top: 2rem;
`;

const Input = styled.input`
  appearance: none;
  border-radius: 0.375rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  color: #1f2937;
  
  &:focus {
    outline: none;
    ring: 2px solid #3b82f6;
    border-color: #3b82f6;
  }
`;

const Button = styled.button`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  margin-top: 1.5rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
  background-color: #2563eb;
  
  &:hover:not(:disabled) {
    background-color: #1d4ed8;
  }
  
  &:focus {
    outline: none;
    ring: 2px solid #93c5fd;
    ring-offset: 2px;
  }
  
  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const BackLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  
  a {
    font-weight: 500;
    color: #2563eb;
    
    &:hover {
      color: #1d4ed8;
    }
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setMessage({
        text: 'Password reset instructions sent to your email!',
        type: 'success',
      });
    } catch (error: any) {
      setMessage({
        text: error.message || 'Failed to send reset password email',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <div>
          <Title>Reset Password</Title>
          <SubTitle>
            Enter your email address below and we'll send you instructions to reset your password.
          </SubTitle>
        </div>
        
        {message && (
          <MessageBox type={message.type}>
            <p>{message.text}</p>
          </MessageBox>
        )}
        
        <Form onSubmit={handleResetPassword}>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
        </Form>
        
        <BackLink>
          <Link href="/login">Back to Login</Link>
        </BackLink>
      </FormContainer>
    </Container>
  );
};

export default ForgotPassword;


















// import Link from "next/link";
// import { useForm } from "react-hook-form";

// import Layout from "../layouts/Main";
// import { server } from "../utils/server";
// import { postData } from "../utils/services";

// type ForgotMail = {
//   email: string;
// };

// const ForgotPassword = () => {
//   const { register, handleSubmit, errors } = useForm();

//   const onSubmit = async (data: ForgotMail) => {
//     await postData(`${server}/api/login`, {
//       email: data.email,
//     });
//   };

//   return (
//     <Layout>
//       <section className="form-page">
//         <div className="container">
//           <div className="back-button-section">
//             <Link href="/products">
//               <i className="icon-left" />
//               Back to shop
//             </Link>
//           </div>

//           <div className="form-block">
//             <h2 className="form-block__title">Forgot your password?</h2>
//             <p className="form-block__description">
//               Enter your email or phone number and recover your account
//             </p>

//             <form className="form" onSubmit={handleSubmit(onSubmit)}>
//               <div className="form__input-row">
//                 <input
//                   className="form__input"
//                   placeholder="email"
//                   type="text"
//                   name="email"
//                   ref={register({
//                     required: true,
//                     pattern:
//                       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//                   })}
//                 />

//                 {errors.email && errors.email.type === "required" && (
//                   <p className="message message--error">
//                     This field is required
//                   </p>
//                 )}

//                 {errors.email && errors.email.type === "pattern" && (
//                   <p className="message message--error">
//                     Please write a valid email
//                   </p>
//                 )}
//               </div>

//               <div className="form__input-row">
//                 <input
//                   className="form__input"
//                   type="password"
//                   placeholder="Password"
//                   name="password"
//                   ref={register({ required: true })}
//                 />
//                 {errors.password && errors.password.type === "required" && (
//                   <p className="message message--error">
//                     This field is required
//                   </p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 className="btn btn--rounded btn--yellow btn-submit"
//               >
//                 Reset password
//               </button>
//             </form>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default ForgotPassword;
