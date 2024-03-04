import React, { useEffect, useState } from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import headerImg from "../../../assets/images/head1.png";
import NoData from "../../../SharedModule/Components/NoData/NoData";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import noData from "../../../assets/images/nodata.png";
import recipeAlt from "../../../assets/images/recipe.png";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Pagination from "react-bootstrap/Pagination";
import PreLoader from "../../../SharedModule/Components/PreLoader/PreLoader";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function RecipesList() {
  // *************preloader*******************
  const [showLoading, setShowLoading] = useState(false);
  // ***********pagination***************
  const [pagesArray, setPagesArray] = useState([]);
  //  ***************************************
  let [recipesList, setRecipesList] = useState([]);
  let [recipe, setRecipe] = useState({});
  let [itemId, setItemId] = useState(0);
  let [categoriesList, setCategoriesList] = useState([]);
  let [tagList, setTagList] = useState([]);
  // *************filtration**************
  let [searchString, setSearchString] = useState("");
  let [selectedTagId, setSelectedTagId] = useState(0);
  let [selectedCategoryId, setSelectedCategoryId] = useState(0);
  //*****************validation using useform***********************
  let {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // **********to use more than one modal in same component**********
  const [modalState, setModalState] = useState("close");
  // ********to show add modal*******************
  const showAddModal = () => {
    reset();
    setValue("tagId", null);
    setValue("categoriesIds", null);
    setValue("recipeImage", null);
    setModalState("add-modal");
  };

  // ********to show delete modal*******************

  const showDeleteModal = (id) => {
    setItemId(id);
    setModalState("delete-modal");
  };
  // ********to show update modal*******************
  const showUpdateModal = (item) => {
    console.log(item);
    setValue("name", item?.name);
    setValue("price", item?.price);
    setValue("description", item?.description);
    setValue("tagId", item?.tag?.id);
    setValue("categoriesIds", item?.category[0]?.id);
    setValue("imagePath", item?.imagePath);

    setItemId(item.id);
    setRecipe(item);
    setModalState("update-modal");
  };
  // ********to close modal*******************
  const handleClose = () => setModalState("close");

  //************* to get categories list *******************
  const getCategoryList = () => {
    //get categ
    axios
      .get(
        "https://upskilling-egypt.com:443/api/v1/Category/?pageSize=10&pageNumber=1",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setCategoriesList(response?.data?.data);
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
      });
  };
  //************to get all tags*************************
  const getAllTags = () => {
    //get tags
    axios
      .get("https://upskilling-egypt.com:443/api/v1/tag/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        setTagList(response?.data);
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
      });
  };

  //****************delete Recipe****************************
  const deleteRecipe = () => {
    setShowLoading(true);
    axios
      .delete(`https://upskilling-egypt.com:443/api/v1/Recipe/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log(response);
        handleClose();
        setShowLoading(false);
        getAllRecipes();
        toast.success(
          response?.data?.message || "Recipe deleted successfully",
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
  // ************update recipe****************
  const updateRecipe = (data) => {
    console.log("update data", data);
    setShowLoading(true);
    axios
      .put(
        `https://upskilling-egypt.com:443/api/v1/Recipe/${itemId}`,
        { ...data, recipeImage: data?.recipeImage[0] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response);
        handleClose();
        setShowLoading(false);
        getAllRecipes();
        toast.success(
          response?.data?.message || "Recipe updated successfully",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      })
      .catch((error) => {
        console.log(response);

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

  //****************get all Recipe****************************
  const getAllRecipes = (pageNo, name, tagId, categoryId) => {
    setShowLoading(true);
    axios
      .get("https://upskilling-egypt.com:443/api/v1/Recipe/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        params: {
          pageSize: 5,
          pageNumber: pageNo,
          name: name,
          tagId: tagId,
          categoryId: categoryId,
        },
      })
      .then((response) => {
        console.log(response);
        setRecipesList(response?.data?.data);
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
  //****************add new Recipe****************************
  const addRecipe = (data) => {
    console.log("add recipe obj", data);
    setShowLoading(true);
    axios
      .post(
        "https://upskilling-egypt.com:443/api/v1/Recipe/",
        { ...data, recipeImage: data.recipeImage[0] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response);
        handleClose();
        setShowLoading(false);
        getAllRecipes();
        toast.success(response?.data?.message || "Recipe added successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(response);

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
    getAllRecipes(1, e.target.value, selectedTagId, selectedCategoryId);
  };
  const getTagValue = (e) => {
    setSelectedTagId(e.target.value);
    getAllRecipes(1, searchString, e.target.value, selectedCategoryId);
  };
  const getCategoryValue = (e) => {
    setSelectedCategoryId(e.target.value);
    getAllRecipes(1, searchString, selectedTagId, e.target.value);
  };

  useEffect(() => {
    getAllTags();
    getCategoryList();
    getAllRecipes();
  }, []);

  return  (
    <>
      <Header>
        <div className="header-content text-white rounded">
          <div className="row align-items-center  m-2 p-3">
            <div className="col-md-10">
              <h3 className="px-4">
                <strong>Recipes Items</strong>
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
            <strong>Recipes Table Details</strong>
          </h4>
          <p>You can check all details</p>
        </div>
        <div className="col-md-6 text-end">
          <button onClick={showAddModal} className="btn btn-success">
            Add new Recipe
          </button>
        </div>
        <div></div>
        {/* ******************** add modal ***************************/}
        <Modal show={modalState == "add-modal"} onHide={handleClose}>
          <Modal.Header closeButton>
            <h3>Add New Recipe</h3>
          </Modal.Header>
          <Modal.Body>
            <p>Welcome Back! Please enter your details</p>
            <form id="form7" onSubmit={handleSubmit(addRecipe)}>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter Recipe name"
                  {...register("name", { required: true })}
                />
                {errors.name && errors.name.type === "required" && (
                  <span className="m-2 text-danger">field is required</span>
                )}
              </div>

              <select
                className="form-select my-1"
                aria-label="Default select example"
                {...register("tagId", { required: true, valueAsNumber: true })}
              >
                <option className="text-muted" value="">
                  Choose Tag
                </option>

                {tagList?.map((tag) => (
                  <option key={tag?.id} value={tag?.id}>
                    {tag?.name}
                  </option>
                ))}
              </select>

              {errors.tagId && errors.tagId.type === "required" && (
                <span className="m-2 text-danger">field is required</span>
              )}

              <select
                className="form-select my-1"
                aria-label="Default select example"
                {...register("categoriesIds", { valueAsNumber: true })}
              >
                <option className="text-muted" value="">
                  Choose Category
                </option>
                {categoriesList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.id}
                  </option>
                ))}
              </select>

              <div className="form-group">
                <input
                  className="form-control my-2"
                  type="number"
                  placeholder="Price"
                  {...register("price", { required: true })}
                />
                {errors.price && errors.price.type === "required" && (
                  <span className="m-2 text-danger">field is required</span>
                )}
              </div>

              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="description"
                  id="w3review"
                  name="w3review"
                  rows="4"
                  cols="50"
                  {...register("description", { required: true })}
                ></textarea>
                {errors.description &&
                  errors.description.type === "required" && (
                    <span className="m-2 text-danger">field is required</span>
                  )}
              </div>

              <div className="form-group my-2 ">
                <input
                  type="file"
                  className="form-control my-1 "
                  
                  {...register("recipeImage")}
                />
              </div>
             

              <div className="text-end">
              <button
                type="submit"
                className={
                  "btn btn-success" + (showLoading ? " disabled" : " ")
                }
              >
                {showLoading == true ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Add Recipe"
                )}
              </button>
              
              </div>
            </form>
          </Modal.Body>
        </Modal>
        {/* //*****************add modal******************** */}
        {/* **************** * delete modal *****************/}
        <Modal show={modalState == "delete-modal"} onHide={handleClose}>
          <Modal.Header closeButton>
            <h3>delete this Recipe?</h3>
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
                onClick={deleteRecipe}
                className={
                  "btn btn-outline-danger my-3" + (showLoading ? " disabled" : "")
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
        {/************************* * //delete modal*************** */}
        {/* ******************** update modal ***************************/}
        <Modal show={modalState == "update-modal"} onHide={handleClose}>
          <Modal.Header closeButton>
            <h3>Update Recipe</h3>
          </Modal.Header>
          <Modal.Body>
            <p>Welcome Back! Please enter your details</p>
            <form id="form8" onSubmit={handleSubmit(updateRecipe)}>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter Recipe name"
                  {...register("name", { required: true })}
                />
                {errors.name && errors.name.type === "required" && (
                  <span className="m-2 text-danger">field is required</span>
                )}
              </div>
              <label>Tag</label>
              <select
                className="form-select"
                aria-label="Default select example"
                {...register("tagId", { required: true, valueAsNumber: true })}
              >
                {tagList?.map((tag) => (
                  <option key={tag?.id} value={tag?.id}>
                    {tag?.name}
                  </option>
                ))}
              </select>

              {errors.tagId && errors.tagId.type === "required" && (
                <span className="m-2 text-danger">field is required</span>
              )}

              <label>Category</label>
              <select
                className="form-select my-1"
                aria-label="Default select example"
                {...register("categoriesIds", { valueAsNumber: true })}
              >
                {categoriesList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.id}
                  </option>
                ))}
              </select>

              <div className="form-group">
                <input
                  className="form-control my-2"
                  type="number"
                  placeholder="Price"
                  {...register("price", { required: true })}
                />
                {errors.price && errors.price.type === "required" && (
                  <span className="m-2 text-danger">field is required</span>
                )}
              </div>

              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="description"
                  id="w3review"
                  name="w3review"
                  rows="4"
                  cols="50"
                  {...register("description", { required: true })}
                ></textarea>
                {errors.description &&
                  errors.description.type === "required" && (
                    <span className="m-2 text-danger">field is required</span>
                  )}
              </div>

              <div className="form-group ">
                <input
                  type="file"
                  className="form-control my-1 "
                  {...register("recipeImage")}
                />
                {/* update */}
                {recipe?.imagePath ? (
                  <img
                    className="w-25"
                    src={
                      `https://upskilling-egypt.com:443/` + recipe?.imagePath
                    }
                  />
                ) : (
                  <img className="w-25" src={recipeAlt} />
                )}
              </div>

              <div className="text-end">
              <button
                type="submit"
                className={
                  "btn btn-success" + (showLoading ? " disabled" : " ")
                }
              >
                {showLoading == true ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Update Recipe"
                )}
              </button>
              
              </div>
            </form>
          </Modal.Body>
        </Modal>
        {/* //*****************update modal******************** */}
        {/* ****************start filtration********************** */}
        <div className="filtration-group my-3">
          <div className="row">
            <div className="col-md-6">
              {/* search input */}
              <InputGroup>
                <InputGroup.Text>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </InputGroup.Text>
                <Form.Control
                  onChange={getNameValue}
                  placeholder="Search by name ..."
                  type="text"
                />
              </InputGroup>
              {/* //search input */}
            </div>
            <div className="col-md-3">
              {/* filter tag select */}
              <select
                onChange={getTagValue}
                className="form-select "
                aria-label="Default select example"
              >
                <option className="text-muted" value="">
                  Tag Filter
                </option>

                {tagList?.map((tag) => (
                  <option key={tag?.id} value={tag?.id}>
                    {tag?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                onChange={getCategoryValue}
                className="form-select "
                aria-label="Default select example"
              >
                <option className="text-muted" value="">
                  Category Filter
                </option>

                {categoriesList?.map((category) => (
                  <option key={category?.id} value={category?.id}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {!showLoading ? (
          <>
            {recipesList?.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead className="table-head table-success">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Recipe Name</th>
                      <th scope="col">image</th>
                      <th scope="col">price</th>
                      <th scope="col">description</th>
                      <th scope="col">Category</th>
                      <th scope="col">Tag</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipesList.map((recipe, index) => (
                      <tr key={recipe?.id} className="table-light">
                        <th scope="row">{index + 1}</th>
                        <td>{recipe?.name}</td>
                        <td>
                          <div className="rec-image-container">
                            {recipe?.imagePath ? (
                              <img
                                className="w-100"
                                src={
                                  `https://upskilling-egypt.com:443/` +
                                  recipe?.imagePath
                                }
                              />
                            ) : (
                              <img className="w-100" src={recipeAlt} />
                            )}
                          </div>
                        </td>
                        <td>{recipe?.price}</td>
                        <td className="w-25">{recipe?.description}</td>
                        <td>{recipe?.category[0]?.name}</td>
                        <td>{recipe?.tag?.name}</td>
                        <td>
                          <i
                            onClick={() => showUpdateModal(recipe)}
                            className="fa fa-edit  text-success px-2"
                          ></i>
                          <i
                            onClick={() => showDeleteModal(recipe.id)}
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
                        onClick={() => getAllRecipes(pageNo, searchString)}
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
    </>
  );
}
