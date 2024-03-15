import { useState, useEffect } from "react";
import img from "./logo.svg"
function User() {
    const [users, setUsers] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUsers(JSON.parse(storedUser));
        }
    }, {});

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-96 px-6 py-6 text-center bg-gray-800 rounded-lg lg:mt-0 xl:px-10">
                <div className="space-y-4 xl:space-y-6">
                    <img className="mx-auto rounded-full h-36 w-36" src={img} alt="author avatar" />
                    <div className="space-y-2">
                        <div className="flex justify-center items-center flex-col space-y-3 text-lg font-medium leading-6">
                            <h3 className="text-white">User Name : {users.username}</h3>
                            <p className="text-indigo-300">Email : {users?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;
