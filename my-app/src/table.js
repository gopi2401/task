import { useState, useEffect } from "react";

function Table() {
    const [users, setUsers] = useState({ data: [], loading: true });

    useEffect(() => {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const id = params.get('id')
        async function fetchUsers() {
            try {
                const response = await fetch(`http://localhost:3001/organizations/users/${id}`, {
                    method: 'GET',
                    headers: {
                        "authorization": "Bearer " + localStorage.getItem('token')
                    },
                });
                const usersData = await response.json();
                setUsers({ data: usersData, loading: false });
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers();
    }, []);

    return (
        <div className='w-full'>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full py-2">
                        <div className="overflow-hidden">
                            <table className="min-w-full text-left text-sm font-light">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr className=' bg-gray-100'>
                                        <th scope="col" className="px-6 py-4">S.NO</th>
                                        <th scope="col" className="px-6 py-4">Name</th>
                                        <th scope="col" className="px-6 py-4">Email</th>
                                        <th scope="col" className="px-6 py-4">Organization</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.loading ? (
                                        <tr>
                                            <td colSpan="4">Loading...</td>
                                        </tr>
                                    ) : (
                                        users.data.map((user, i) => (
                                            <tr key={i + 1} className="border-b dark:border-neutral-500">
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">{i + 1}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{user.username}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{user.organization}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Table;
