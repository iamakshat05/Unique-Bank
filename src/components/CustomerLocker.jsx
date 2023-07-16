import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import "./PersonalProfile.css"; // Import the new CSS file
import {
  getUsernameFromToken,
  getToken,
} from "../services/LocalStorageService";
import {
  getCustomerAccountsByUserId,
  getCustomerLoansByUserId,
  getCustomerLockersByUserId,
  getUsersByUsername,
  payDue
} from "../services/userService";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import UpdateCustomer from "./UpdateCustomer";
import CustomerSidebar from "./CustomerSidebar";
import ApplyLoan from "./ApplyLoan";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function CustomerLoan() {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  const getUsername = () => {
    const username = getUsernameFromToken();
    console.log(username);
    return username;
  };

  const handleEditClick = (user) => {

    console.log(user, "user");
    setEditedUser(user);
    setOpenEditDialog(true);
  };

  const config = {
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUsersByUsername(getUsername(), config);
        console.log(userResponse.data.id, "responseData");
        const response = await getCustomerLockersByUserId(
          userResponse.data.id,
          config
        );
        console.log("Locker data ", response.data);
        setData(response.data);
        setUserData(userResponse.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate;
  };

  const avatarStyles = {
    width: "50px",
    height: "50px",
    fontSize: "20px",
    backgroundColor: "#FF9300",
    color: "white",
    textAlign: "center",
    margin: "auto 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const buttonStyles = {
    color: "black",
    margin: "1rem",
    width: "10rem",
    borderColor: "Golden",
    borderWidth: "2px",
    borderStyle: "solid",
    borderRadius: "4px",
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <CustomerSidebar />
        <section className="vh-100 personal-profile-section">
  <div className="py-5 h-100 personal-profile-container">
    <div className="justify-content-center align-items-center h-100">
      <div className="mb-4 mb-lg-0">
        <div className="mb-3 personal-profile-card">
          <div className="gradient-custom text-center text-white personal-profile-card-header">
            <div className="avatar-container" style={{ margin: "1rem" }}>
              <Avatar style={avatarStyles}></Avatar>
            </div>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {userData.username}
            </Typography>
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              {userData.name}
            </Typography>
          </div>

          {data.length > 0 ? (
            <div
              className="personal-profile-card-body"
              style={{ maxWidth: "600px", margin: "0 auto" }}
            >
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Locker Information
              </Typography>
              <hr className="mt-0 mb-4" />

              {data.map((locker) => (
                <div className="pt-1" key={locker.id}>
                  <Card className="loan-card">
                    <CardContent>
                      <div className="loan-info-row">
                        <div className="loan-info-column">
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold" }}
                          >
                            Locker Number
                          </Typography>
                          <Typography
                            variant="body2"
                            className="text-muted"
                          >
                            {locker.lockerNumber}
                          </Typography>
                        </div>
                        <div className="loan-info-column">
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold" }}
                          >
                            Locker Occupied
                          </Typography>
                          <Typography
                            variant="body2"
                            className="text-muted"
                          >
                            {locker.occupied ? "Yes" : "No"}
                          </Typography>
                        </div>
                        <div className="loan-info-column">
                          <Typography
                            variant="h6"
                            style={{ fontWeight: "bold" }}
                          >
                            User Id
                          </Typography>
                          <Typography
                            variant="body2"
                            className="text-muted"
                          >
                            {locker.userId}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) 
          : (
            <Card>
              <CardContent>
              <div className="personal-profile-card-body">
            <Typography variant="h6" className="text-muted">
              No lockers found
            </Typography>
            </div>
            </CardContent>
            </Card>
          )
          }
        </div>
      </div>
    </div>
  </div>
</section>

      </div>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <UpdateCustomer user={editedUser} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Loan Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Apply Loan</DialogTitle>
        <DialogContent>
          <ApplyLoan />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
