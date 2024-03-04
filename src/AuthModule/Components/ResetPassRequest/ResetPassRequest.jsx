import React,{useState} from "react";
import logo from "../../../assets/images/4.png";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import PreLoader from "../../../SharedModule/Components/PreLoader/PreLoader";

export default function ResetPassRequest() {

   // *************preloader*******************
 const [showLoading, setShowLoading] = useState(false);

  const navigate = useNavigate();
  const {
    register, //btsheel el values ui inputs
    handleSubmit, //integration
    formState: { errors }, //errors
  } = useForm();

 //****************to request reset******************

  const onSubmit = (data) => {
    console.log(data);
    setShowLoading(true);
    axios
      .post("https://upskilling-egypt.com:443/api/v1/Users/Reset/Request", data)
      .then((response) => {
        console.log(data);
        setShowLoading(false);
        navigate("/reset-password");
        toast.success(
          response?.data?.message || "Code sent to your mail please check",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
        setShowLoading(false);
      });
  };
  
  return showLoading ? (
    <PreLoader/>
  ) : (
    <div className="Auth-container container-fluid">
      <div className="row bg-overlay vh-100  justify-content-center align-items-center">
        <div className="col-md-6">
          <div className="bg-white rounded p-3">
            <div className="logo-cont  text-center">
              <img src={logo} alt="logo" />
            </div>
            <form id="form4" className="w-75 m-auto" onSubmit={handleSubmit(onSubmit)}>
              <h3>Request Reset Password</h3>
              <p>Please Enter Your Email And Check Your Inbox</p>
              {/* email input */}
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <i className="fa-regular fa-envelope"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="enter your email"
                  type="email"
                  {...register("email", {
                    required: true,
                    pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  })}
                />
              </InputGroup>

              {errors.email && errors.email.type === "required" && (
                <span className=" text-danger my-1">email is required</span>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <span className=" text-danger my-1">invalid email</span>
              )}
              {/* //email input */}
           
      

              <div className="form-group my-3">
              <button
                  type="submit"
                  className={
                    "btn btn-success w-100" + (showLoading ? " disabled" : " ")
                  }
                >
                  {showLoading == true ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    "Send"
                  )}
                </button>
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
