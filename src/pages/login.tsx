import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn, user, getUser, GoogleProvider } from "@/database/Auth";
import Layout from "../layouts/Main";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
 
type LoginMail = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const { register, handleSubmit, errors } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
 
  useEffect(() => {
    async function useUser() {
      try {
        const data = await getUser();
        if(data){
          router.push('/');
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setPageLoading(false);
      }
    }

    useUser();
  }, [router]);

  const onSubmit = async (data: LoginMail) => {
    if (user) {
      console.log(user);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await signIn(data.email, data.password);
      console.log(result);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await GoogleProvider();
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Layout>
        <div className="container flex justify-center items-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-xl">Loading...</p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="form-page">
        <div className="container">
          <motion.div 
            className="back-button-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/products">
              <i className="icon-left" />
              Back to store
            </Link>
          </motion.div>

          <motion.div 
            className="form-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2 
              className="form-block__title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Log in
            </motion.h2>
            <motion.p 
              className="form-block__description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Sign in to your account to continue
            </motion.p>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <motion.div 
                className="form__input-row"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <input
                  className="form__input"
                  placeholder="email"
                  type="text"
                  name="email"
                  ref={register({
                    required: true,
                    pattern:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  })}
                />

                {errors.email && errors.email.type === "required" && (
                  <motion.p 
                    className="message message--error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    This field is required
                  </motion.p>
                )}

                {errors.email && errors.email.type === "pattern" && (
                  <motion.p 
                    className="message message--error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Please write a valid email
                  </motion.p>
                )}
              </motion.div>

              <motion.div 
                className="form__input-row"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <input
                  className="form__input"
                  type="password"
                  placeholder="Password"
                  name="password"
                  ref={register({ required: true })}
                />
                {errors.password && errors.password.type === "required" && (
                  <motion.p 
                    className="message message--error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    This field is required
                  </motion.p>
                )}
              </motion.div>

              <motion.div 
                className="form__info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <div className="checkbox-wrapper">
                  <label
                    htmlFor="check-signed-in"
                    className="checkbox checkbox--sm"
                  >
                    <input
                      type="checkbox"
                      name="keepSigned"
                      id="check-signed-in"
                      ref={register({ required: false })}
                    />
                    <span className="checkbox__check" />
                    <p>Keep me signed in</p>
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="form__info__forgot-password"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div 
                className="form__btns"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <motion.button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="btn-social fb-btn"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <motion.div 
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <i className="icon-facebook" />
                  )}
                  Google
                </motion.button>
                <motion.button 
                  type="button" 
                  className="btn-social google-btn"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <img src="/images/icons/gmail.svg" alt="gmail" /> Gmail
                </motion.button>
              </motion.div>

              <motion.button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isLoading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                {isLoading ? (
                  <motion.div 
                    className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : null}
                {isLoading ? "Signing in..." : "Sign in"}
              </motion.button>

              <motion.p 
                className="form__signup-link"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1 }}
              >
                Not a member yet? <Link href="/register">Sign up</Link>
              </motion.p>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
