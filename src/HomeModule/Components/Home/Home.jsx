import React from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import headerImg from "../../../assets/images/home.png";
import { Button } from "bootstrap";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div>
      <Header>
        <div className="header-content text-white rounded">
          <div className="row align-items-center  mx-2 px-3">
            <div className="col-md-9">
              <h3 className="px-4"><strong>Welcome Upskilling !</strong></h3>
              <p className="w-75 px-4">
                This is a welcoming screen for the entry of the application ,
                you can now see the options
              </p>
            </div>
            <div className="col-md-3">
              <div>
                <img src={headerImg} className="headerImg img-fluid" alt="header" />
              </div>
            </div>
          </div>
        </div>
      </Header>
      <div className="row home-sec  rounded-2 m-4 p-4 align-items-center">
        <div className="col-md-6">
          <div>
            <h4><strong>Fill the recipes !</strong> </h4>
            <p>
              you can now fill the meals easily using the table and form , click
              here and sill it with the table !
            </p>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <div>
           
           <button className="btn btn-success px-3">
           <Link to={"/dashboard/recipes"} className="text-white text-decoration-none">
              Fill Recipes &nbsp;
              <i className=" fa fa-arrow-right"></i>
              </Link>
              </button>
           
          
          </div>
        </div>
      </div>
    </div>
  );
}
