import Link from "next/link";
import { signUp, user } from "../database/Auth";
import Layout from "../layouts/Main";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
 
  useEffect(() =>{
   
    if(user){
       router.push('/');
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (e.target[2].value === "on") {
      const result = await signUp(e.target[0].value, e.target[1].value);
      console.log("submit", result);
    }
  };
   
  return (
    <>
  <Layout>
    <section className="form-page">
      <div className="container">
        <div className="back-button-section">
          <Link href="/products">
            <i className="icon-left" />
            Back to store
          </Link>
        </div>

        <div className="form-block">
          <h2 className="form-block__title">
            Create an account and discover the benefits
          </h2>
          <p className="form-block__description">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>

          <form className="form" onSubmit={(e) => handleSubmit(e)}>
            <div className="form__input-row">
              <input
                className="Email"
                placeholder="Email"
                type="email"
                required
              />
            </div>

            <div className="form__input-row">
              <input
                className="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="form__info">
              <div className="checkbox-wrapper">
                <label
                  htmlFor="check-signed-in"
                  className="checkbox checkbox--sm"
                >
                  <input
                    name="signed-in"
                    type="checkbox"
                    id="check-signed-in"
                    required
                  />
                  <span className="checkbox__check" />
                  <p>
                    I agree to the Google Terms of Service and Privacy Policy
                  </p>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn--rounded btn--yellow btn-submit"
            >
              Sign up
            </button>

            <p className="form__signup-link">
              <Link href="/login">Are you already a member?</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  </Layout>
    </>
  )
  
};

export default RegisterPage;
