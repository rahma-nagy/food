import React, { useEffect, useState } from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import headerImg from "../../../assets/images/head1.png";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import noData from "../../../assets/images/nodata.png";
import NoData from "../../../SharedModule/Components/NoData/NoData";
import { toast } from "react-toastify";
import PreLoader from "../../../SharedModule/Components/PreLoader/PreLoader";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Pagination from "react-bootstrap/Pagination";
export default function UsersList() {
  let [usersList, setUsersList] = useState([]);
  let [itemId, setItemId] = useState(0);
  // ***********filtration****************
  const [searchByName, setSearchByName] = useState("");
  const [searchByEmail, setSearchByEmail] = useState("");
  // *************preloader*******************
  const [showLoading, setShowLoading] = useState(false);
  // ***********pagination***************
  const [pagesArray, setPagesArray] = useState([]);
  // //**************** to use more than one modal in same component**********
  const [modalState, setModalState] = useState("close");
  const showDeleteModal = (id) => {
    setItemId(id);
    setModalState("delete-modal");
  };

  const handleClose = () => setModalState("close");

  //****************delete user ***************************

  const deleteUser = () => {
    setShowLoading(true);
    axios
      .delete(`https://upskilling-egypt.com:443/api/v1/Users/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log(response);
        handleClose();
        setShowLoading(false);
        getAllUsers();
        toast.success(response?.data?.message || "user deleted successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
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

  //****************get all user************************
  const getAllUsers = (pageNo, userName, email) => {
    setShowLoading(true);
    //get user
    axios
      .get("https://upskilling-egypt.com:443/api/v1/Users/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        params: {
          pageSize: 5,
          pageNumber: pageNo,
          userName: userName,
          email: email,
        },
      })
      .then((response) => {
        console.log("userslist", response?.data?.data);
        setPagesArray(
          Array(response?.data?.totalNumberOfPages)
            .fill()
            .map((_, i) => i + 1)
        );
        setShowLoading(false);
        setUsersList(response?.data?.data);
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
  const getUserNameValue = (e) => {
    setSearchByName(e.target.value);
    getAllUsers(1, e.target.value, searchByEmail);
  };
  const getEmailValue = (e) => {
    setSearchByEmail(e.target.value);
    getAllUsers(1, searchByName, e.target.value);
  };
  useEffect(() => {
    const timerId = setTimeout(()=>{
      getAllUsers();
    },500)
    return ()=> clearTimeout(timerId)
    
  }, []);
  return(  <>
      <Header>
        <div className="header-content text-white rounded">
          <div className="row align-items-center  m-2 p-3">
            <div className="col-md-10">
              <h3 className="px-4">
                <strong>Users Items</strong>
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
            <strong>Users Table Details</strong>
          </h4>
          <p>You can check all details</p>
        </div>

        {/* ****************delete modal **************** */}
        <Modal show={modalState == "delete-modal"} onHide={handleClose}>
          <Modal.Header closeButton>
            <h3>delete this user?</h3>
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
                onClick={deleteUser}
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
        {/* //****************delete modal *****************/}

        <div>
          {/* filtration */}
          <div className="filtration-group my-3">
            <div className="row">
              <div className="col-md-6">
                {/* search name input */}
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fa-regular fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    onChange={getUserNameValue}
                    placeholder="Search by name ..."
                    type="text"
                  />
                </InputGroup>
                {/* //search by name input */}
              </div>
              <div className="col-md-6">
                {/* filter by mail */}
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fa-solid fa-envelope-open-text"></i>
                  </InputGroup.Text>
                  <Form.Control
                    onChange={getEmailValue}
                    placeholder="Search by email ..."
                    type="text"
                  />
                </InputGroup>
              </div>
            </div>
          </div>

           {!showLoading ?
           <>
             {usersList.length > 0 ? (
              <div>
                <table className="table">
                  <thead className="table-head table-success">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">User Name</th>
                      <th scope="col">Image</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Email</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user, index) => (
                      <tr key={user?.id} className="table-light">
                        <th scope="row">{index + 1}</th>
                        <td>{user?.userName}</td>
  
                        <td>
                          <div className="image-container">
                            {user?.imagePath ? (
                              <img
                                className="w-100"
                                src={
                                  `https://upskilling-egypt.com/` +
                                  user?.imagePath
                                }
                              />
                            ) : (
                              <img className="w-100" src={noData} />
                            )}
                          </div>
                        </td>
  
                        <td>{user?.phoneNumber}</td>
                        <td>{user?.email}</td>
                        <td>
                          <i
                            onClick={() => showDeleteModal(user.id)}
                            className="fa fa-trash  text-danger"
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* ****** * pagination ******** */}
                <div className="d-flex justify-content-center align-items-center mt-5">
                  <Pagination>
                    <Pagination.First />
                    <Pagination.Prev/>
  
                    {pagesArray?.map((pageNo) => (
                      <Pagination.Item
                        key={pageNo}
                        onClick={() =>
                          getAllUsers(pageNo, searchByName, searchByEmail)
                        }
                      >
                        {pageNo}
                      </Pagination.Item>
                    ))}
  
                    <Pagination.Next/>
                    <Pagination.Last />
                  </Pagination>
                </div>
  
                {/*******/
                /* pagination *********/}
              </div>
            ) : (
              <NoData />
            )
            }
            </>
          :<PreLoader/>
          }
        
        
         
        </div>
      </div>
    </>
  );
}
