import React, { useEffect, useState } from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import headerImg from "../../../assets/images/head1.png";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import noData from "../../../assets/images/nodata.png";
import NoData from "../../../SharedModule/Components/NoData/NoData";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import PreLoader from "../../../SharedModule/Components/PreLoader/PreLoader";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Pagination from "react-bootstrap/Pagination";

export default function CategoriesList() {
  let [categoriesList, setCategoriesList] = useState([]);
  let [itemId, setItemId] = useState(0);
  // *************search**************
  let [searchString, setSearchString] = useState("");
  // *************preloader*******************
  const [showLoading, setShowLoading] = useState(false);
  // ***********pagination***************
  const [pagesArray, setPagesArray] = useState([]);
  // //**************** to use more than one modal in same component**********
  const [modalState, setModalState] = useState("close");

  const showAddModal = () => {
    setValue("name", null);
    setModalState("add-modal");
  };

  const showDeleteModal = (id) => {
    setItemId(id);
    setModalState("delete-modal");
  };
  const showUpdateModal = (categoryObj) => {
    setItemId(categoryObj.id);
    setValue("name", categoryObj.name);
    setModalState("update-modal");
  };
  const handleClose = () => setModalState("close");

  //****************delete category ***************************

  const deleteCategory = () => {
    setShowLoading(true);
    axios
      .delete(`https://upskilling-egypt.com:443/api/v1/Category/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log(response);
        handleClose();
        setShowLoading(false);
        getCategoryList();
        toast.success(
          response?.data?.message || "category deleted successfully",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      })
      .catch((error) => {
        console.log(error);
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
  //****************update category**********************
  const updateCategory = (data) => {
    setShowLoading(true);
    axios
      .put(`https://upskilling-egypt.com:443/api/v1/Category/${itemId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log(response);
        handleClose();
        setShowLoading(false);
        getCategoryList();
        toast.success(
          response?.data?.message || "category updated successfully",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      })
      .catch((error) => {
        console.log(error);
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

  // //****************validation using useform**************
  let {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  // //****************api integration add categ*************
  let onSubmit = (data) => {
    console.log(data);
    setShowLoading(true);
    axios
      .post("https://upskilling-egypt.com:443/api/v1/Category/", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        handleClose();
        setShowLoading(false);
        getCategoryList();
        toast.success(
          response?.data?.message || "category added successfully",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      })
      .catch((error) => {
        console.log(error);
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
  //****************get all category************************
  const getCategoryList = (pageNo, name) => {
    setShowLoading(true);
    //get categ
    axios
      .get("https://upskilling-egypt.com:443/api/v1/Category/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        params: {
          pageSize: 5,
          pageNumber: pageNo,
          name: name,
        },
      })
      .then((response) => {
        setCategoriesList(response?.data?.data);
        setPagesArray(
          Array(response?.data?.totalNumberOfPages)
            .fill()
            .map((_, i) => i + 1)
        );
        setShowLoading(false);
      })
      .catch((error) => {
        console.log(error);
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
  // ******get name value user entered in search inp***********
  const getNameValue = (e) => {
    setSearchString(e.target.value);
    getCategoryList(1, e.target.value);
  };
  useEffect(() => {
    //btcall data of categories
    getCategoryList(1);
  }, []);
  return (
    <>
      <Header>
        <div className="header-content text-white rounded">
          <div className="row align-items-center  m-2 p-3">
            <div className="col-md-10">
              <h3 className="px-4">
                <strong>Categories Items !</strong>
              </h3>
              <p className="w-75 px-4">
                You can now add your items that any user can order it from the
                Application and you can edit
              </p>
            </div>
            <div className="col-md-2">
              <div>
                <img src={headerImg} className="headerImg img-fluid" alt="header" />
              </div>
            </div>
          </div>
        </div>
      </Header>

      <div className="row justify-content-between mx-4 p-3 ">
        <div className="col-md-6 px-4">
          <h4>
            <strong>Categories Table Details</strong>
          </h4>
          <p>You can check all details</p>
        </div>
        <div className="col-md-6 text-end">
          <button onClick={showAddModal} className="btn btn-success">
            Add new Category
          </button>
        </div>
        {/* **************** add modal************************** */}
        <Modal show={modalState == "add-modal"} onHide={handleClose}>
          <Modal.Header closeButton>
            <h3>Add Category</h3>
          </Modal.Header>
          <Modal.Body>
            <p>Welcome Back! Please enter your details</p>
            <form id="form5" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter category name"
                  {...register("name", { required: true })}
                />
                {errors.name && errors.name.type === "required" && (
                  <span className="m-2 text-danger">field is required</span>
                )}
              </div>
              <button
                type="submit"
                className={
                  "btn btn-success w-100 my-3" +
                  (showLoading ? " disabled" : " ")
                }
              >
                {showLoading == true ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Save"
                )}
              </button>
            </form>
          </Modal.Body>
        </Modal>
        {/* //add modal */}

        {/* ****************update modal *****************/}
        <Modal show={modalState == "update-modal"} onHide={handleClose}>
          <Modal.Header closeButton>
            <h3>Update Category</h3>
          </Modal.Header>
          <Modal.Body>
            <p>Welcome Back! Please enter your details</p>
            <form id="form6" onSubmit={handleSubmit(updateCategory)}>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter category name"
                  {...register("name", { required: true })}
                />
                {errors.name && errors.name.type === "required" && (
                  <span className="m-2 text-danger">field is required</span>
                )}
              </div>
              <button
                type="submit"
                className={
                  "btn btn-success w-100 my-3" +
                  (showLoading ? " disabled" : " ")
                }
              >
                {showLoading == true ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Update"
                )}
              </button>
            </form>
          </Modal.Body>
        </Modal>
        {/***************** //update modal *****************/}
        {/* ****************delete modal **************** */}
        <Modal show={modalState == "delete-modal"} onHide={handleClose}>
          <Modal.Header closeButton>
            <h3>delete this Category?</h3>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <img src={noData} />
              <p>
                are you sure you want to delete this item ? if you are sure just
                click on delete it
              </p>
            </div>
            <div className="text-end">
              <button
                onClick={deleteCategory}
                className={
                  "btn btn-outline-danger my-3" +
                  (showLoading ? " disabled" : "")
                }
              >
                {showLoading == true ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Delete this item"
                )}
              </button>
            </div>
          </Modal.Body>
        </Modal>
        {/* ****************delete modal *****************/}

        <div>
          {/* search input */}
          <InputGroup className="my-3">
            <InputGroup.Text>
              <i className="fa-solid fa-magnifying-glass"></i>
            </InputGroup.Text>
            <Form.Control
              onChange={getNameValue}
              placeholder="Search by Category name ..."
              type="text"
            />
          </InputGroup>

          {/* //search input */}
          {!showLoading ? (
            <>
              {categoriesList.length > 0 ? (
                <div>
                  <table className="table">
                    <thead className="table-head table-success">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Category Name</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriesList.map((category, index) => (
                        <tr key={category?.id} className="table-light">
                          <th scope="row">{index + 1}</th>
                          <td>{category.name}</td>
                          <td>
                            <i
                              onClick={() => showUpdateModal(category)}
                              className="fa fa-edit  text-success px-2"
                            ></i>
                            <i
                              onClick={() => showDeleteModal(category.id)}
                              className="fa fa-trash  text-danger"
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/******* * pagination *********/}
                  <div className="d-flex justify-content-center align-items-center mt-5">
                    <Pagination>
                      <Pagination.First />
                      <Pagination.Prev />

                      {pagesArray?.map((pageNo) => (
                        <Pagination.Item
                          key={pageNo}
                          onClick={() => getCategoryList(pageNo, searchString)}
                        >
                          {pageNo}
                        </Pagination.Item>
                      ))}

                      <Pagination.Next />
                      <Pagination.Last />
                    </Pagination>
                  </div>

                  {/*******/
                  /* pagination *********/}
                </div>
              ) : (
                <NoData />
              )}
            </>
          ) : (
            <PreLoader />
          )}
        </div>
      </div>
    </>
  );
}
