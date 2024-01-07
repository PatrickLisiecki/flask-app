import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "./CardComponent";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserInterfaceProps {
  serverName: string;
}

const UserInterface: React.FC<UserInterfaceProps> = ({ serverName }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [updateUser, setUpdateUser] = useState({ id: "", name: "", email: "" });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const backgroundColors: { [key: string]: string } = {
    flask: "bg-blue-500",
  };

  const buttonColors: { [key: string]: string } = {
    flask: "bg-blue-700 hover:bg-blue-600",
  };

  const bgColor =
    backgroundColors[serverName as keyof typeof backgroundColors] ||
    "bg-gray-200";

  const btnColor =
    buttonColors[serverName as keyof typeof buttonColors] ||
    "bg-gray-500 hover:bg-gray-600";

  // Get users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/${serverName}/users`);
        setUsers(response.data.reverse());
      } catch (err) {
        console.error("Error fetching users: ", err);
      }
    };

    fetchData();
  }, [serverName, apiUrl]);

  {
    /* Creating a new user */
  }
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiUrl}/api/${serverName}/users`,
        newUser,
      );
      setUsers([response.data, ...users]);
      setNewUser({ name: "", email: "" });
    } catch (err) {
      console.error("Error creating user: ", err);
    }
  };

  {
    /* Updating a new user */
  }
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.put(`${apiUrl}/api/${serverName}/users/${updateUser.id}`, {
        name: updateUser.name,
        email: updateUser.email,
      });
      setUpdateUser({ id: "", name: "", email: "" });
      setUsers(
        users.map((user) => {
          if (user.id === parseInt(updateUser.id)) {
            return { ...user, name: updateUser.name, email: updateUser.email };
          }
          return user;
        }),
      );
    } catch (err) {
      console.error("Error updating user: ", err);
    }
  };

  return (
    <div
      className={`user-interface ${bgColor} ${serverName} h-full m-4 p-4 rounded shadow`}
    >
      <img
        src={`/${serverName}logo.svg`}
        alt={`${serverName} Logo`}
        className="w-20 h-20 mb-6 mx-auto"
      />
      <h2 className="text-xl font-bold text-center text-white mb-6">{`${
        serverName.charAt(0).toUpperCase() + serverName.slice(1)
      } Backend`}</h2>

      {/* Create User */}
      <form
        onSubmit={createUser}
        className="w-1/2 mb-6 p-4 bg-blue-100 rounded shadow mx-auto"
      >
        <input
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </form>

      {/* Update User */}
      <form
        onSubmit={handleUpdateUser}
        className="w-1/2 mb-6 p-4 bg-blue-100 rounded shadow mx-auto"
      >
        <input
          placeholder="User Id"
          value={updateUser.id}
          onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="New Name"
          value={updateUser.name}
          onChange={(e) =>
            setUpdateUser({ ...updateUser, name: e.target.value })
          }
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="New Email"
          value={updateUser.email}
          onChange={(e) =>
            setUpdateUser({ ...updateUser, email: e.target.value })
          }
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Update User
        </button>
      </form>

      {/* Display Users */}
      <div className="space-y-4 flex flex-col items-center justify-center">
        {users.map((user, index) => (
          <div
            className="flex w-1/2 items-center justify-between space-x-2 bg-white p-4 rounded-md"
            key={index}
          >
            <CardComponent card={user} />
            <button
              onClick={() => deleteUser(user.id)}
              className={`${btnColor} text-white min-w-[150px] min-h-[75px]`}
            >
              Delete User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInterface;
