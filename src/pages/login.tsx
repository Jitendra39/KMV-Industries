import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn, user, getUser, GoogleProvider } from "@/database/Auth";
import Layout from "../layouts/Main";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
 
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
          router.push('/profile');
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
          <div className="text-center animate-fade-in">
            <div 
              className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4 animate-spin"
            />
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="form-page">
        <div className="container">
          <div className="back-button-section animate-fade-slide-left">
            <Link href="/products">
              <i className="icon-left" />
              Back to store
            </Link>
          </div>

          <div className="form-block animate-fade-slide-up">
            <h2 className="form-block__title animate-fade-in">
              Log in
            </h2>
            <p className="form-block__description animate-fade-in">
              Sign in to your account to continue
            </p>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form__input-row animate-fade-slide-up">
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
                  <p className="message message--error animate-fade-in">
                    This field is required
                  </p>
                )}

                {errors.email && errors.email.type === "pattern" && (
                  <p className="message message--error animate-fade-in">
                    Please write a valid email
                  </p>
                )}
              </div>

              <div className="form__input-row animate-fade-slide-up">
                <input
                  className="form__input"
                  type="password"
                  placeholder="Password"
                  name="password"
                  ref={register({ required: true })}
                />
                {errors.password && errors.password.type === "required" && (
                  <p className="message message--error animate-fade-in">
                    This field is required
                  </p>
                )}
              </div>

              <div className="form__info animate-fade-slide-up">
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
              </div>

              <div className="form__btns animate-fade-slide-up">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="btn-social fb-btn hover:scale-103 active:scale-97"
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                  ) : (
                    <i className="icon-facebook" />
                  )}
                  Google
                </button>
                <button 
                  type="button" 
                  className="btn-social google-btn hover:scale-103 active:scale-97"
                >
                  <img src="/images/icons/gmail.svg" alt="gmail" /> Gmail
                </button>
              </div>

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit hover:scale-103 active:scale-97 animate-fade-slide-up"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                ) : null}
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              <p className="form__signup-link animate-fade-slide-up">
                Not a member yet? <Link href="/register">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
