import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { db, auth } from "../firebase";
import { deleteUser as deleteAuthUser } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: "", email: "" });
  const [globalFilter, setGlobalFilter] = useState("");
  const [multiSortMeta, setMultiSortMeta] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserLogin = () => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setLoggedIn(true);
          fetchUsers();
        } else {
          setLoggedIn(false);
        }
      });

      return () => unsubscribe();
    };

    checkUserLogin();
  }, []);

  const fetchUsers = async () => {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);

    const userData = [];
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      userData.push({
        id: doc.id,
        username: user.displayName,
        email: user.email,
        createdAt: user.createdAt.toDate().toLocaleDateString(),
      });
    });

    setUsers(userData);
  };

  const handleEdit = (rowData) => {
    setSelectedUser(rowData);
    setDisplayDialog(true);
  };

  const handleUsernameChange = (e) => {
    setNewUser((prevUser) => ({ ...prevUser, username: e.target.value }));
  };

  const handleEmailChange = (e) => {
    setNewUser((prevUser) => ({ ...prevUser, email: e.target.value }));
  };

  const addUser = async () => {
    try {
      const userRef = await addDoc(collection(db, "users"), {
        displayName: newUser.username,
        email: newUser.email,
        createdAt: new Date(),
      });

      const newUserObject = {
        id: userRef.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toLocaleDateString(),
      };

      setUsers([...users, newUserObject]);
      setNewUser({ username: "", email: "" });
      setDisplayDialog(false);
    } catch (error) {
      console.error("Error adding user:", error.message);
    }
  };

  const editUser = async () => {
    try {
      const userRef = doc(db, "users", selectedUser.id);

      // Update selectedUser object before calling updateDoc
      setSelectedUser((prevUser) => ({
        ...prevUser,
        username: newUser.username,
        email: newUser.email,
      }));

      await updateDoc(userRef, {
        displayName: newUser.username,
        email: newUser.email,
      });

      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              username: selectedUser.username,
              email: selectedUser.email,
            }
          : user
      );

      setUsers(updatedUsers);
      setDisplayDialog(false);
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  const deleteUser = async (userToDelete) => {
    try {
      // Construct a document reference using the user's ID
      const userRef = doc(db, "users", userToDelete.id);

      // Delete the document
      await deleteDoc(userRef);

      // Delete user from Firebase Authentication

      // Update the state after successful deletion
      const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const handleStatusChange = async (rowData) => {
    try {
      const userRef = doc(db, "users", rowData.id);
      const updatedStatus = rowData.status === "active" ? "inactive" : "active";

      await updateDoc(userRef, { status: updatedStatus });

      const updatedUsers = users.map((user) =>
        user.id === rowData.id ? { ...user, status: updatedStatus } : user
      );

      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user status:", error.message);
    }
  };

  return (
    <div className="card flex items-center justify-center bg-gray-100 p-8">
      {loggedIn ? (
        <DataTable
          value={users}
          tableStyle={{ minWidth: "50rem" }}
          globalFilter={globalFilter}
          multiSortMeta={multiSortMeta}
          onSort={(e) => setMultiSortMeta(e.multiSortMeta)}
          className="w-full p-4 bg-white shadow-md rounded-lg overflow-hidden"
        >
          {/* Username Column */}
          <Column
            field="username"
            header="Username"
            filter
            filterMatchMode="contains"
            filterType="text"
            className="p-2 border border-black"
          ></Column>

          {/* Added Date Column */}
          <Column
            field="createdAt"
            header="Added Date"
            filter
            filterElement={
              <DatePicker
                dateFormat="MM/dd/yyyy"
                selected={filterDate}
                onChange={(date) => setFilterDate(date)}
              />
            }
            className="p-2 border border-black"
          ></Column>

          {/* Actions Column */}
          <Column
            header="Actions"
            body={(rowData) => (
              <div className="flex space-x-2">
                <Button
                  icon="pi pi-pencil"
                  className="rounded p-1 p-button-success bg-green-500 text-white"
                  onClick={() => handleEdit(rowData)}
                >
                  Edit User
                </Button>
                <Button
                  icon="pi pi-trash"
                  className="rounded p-1 p-button-danger bg-red-500 text-white"
                  onClick={() => deleteUser(rowData)}
                >
                  Delete User
                </Button>
              </div>
            )}
            className="p-2 border border-black"
          />

          {/* Status Column */}
          <Column
  header="Status"
  body={(rowData) => (
    <Button
      label={rowData.status === "active" ? "Active" : "Inactive"}
      className={`p-button-rounded ${
        rowData.status === "active"
          ? "p-button-success text-white"
          : "p-button-warning text-white"
      } text-black`}
      onClick={() => handleStatusChange(rowData)}
    />
  )}
  className="p-2 border border-black"
/>
        </DataTable>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome, Log in first!</h1>
          {/* Add your login button or redirect to the login page here */}
        </div>
      )}

      <Dialog
        visible={displayDialog}
        onHide={() => setDisplayDialog(false)}
        className="max-w-md"
      >
        <div className="border p-4 bg-white rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-4">
            {selectedUser ? "Edit User" : "Add User"}
          </h2>
          <label htmlFor="username" className="block mb-2">
            Username:
          </label>
          <InputText
            id="username"
            value={selectedUser ? selectedUser.username : newUser.username}
            onChange={(e) => handleUsernameChange(e)}
            className="p-inputtext-sm w-full mb-4 border rounded-md p-2"
          />
          <label htmlFor="email" className="block mb-2">
            Email:
          </label>
          <InputText
            id="email"
            value={selectedUser ? selectedUser.email : newUser.email}
            onChange={(e) => handleEmailChange(e)}
            className="p-inputtext-sm w-full mb-4 border rounded-md p-2"
          />
          <Button
            label={selectedUser ? "Edit User" : "Add User"}
            onClick={selectedUser ? editUser : addUser}
            className="p-button-sm bg-blue-500 text-white px-4 py-2 rounded-md"
          />
        </div>
      </Dialog>
    </div>
  );
}
