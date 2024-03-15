import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OrgTable() {
    const navigate = useNavigate();
    const [org, setOrg] = useState({ data: [], loading: true });

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch('http://localhost:3001/organizations', {
                    method: 'GET',
                    headers: {
                        "authorization": "Bearer " + localStorage.getItem('token')
                    },
                });
                const org = await response.json();
                setOrg({ data: org, loading: false });
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchUsers();
    }, []);
    const userpage = (id) => {
        navigate(`/table/?id=${id}`)
    }
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
                                        <th scope="col" className="px-6 py-4">Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {org.loading ? (
                                        <tr>
                                            <td colSpan="4">Loading...</td>
                                        </tr>
                                    ) : (
                                        org.data.map((organizations, i) => (
                                            <tr onClick={() => userpage(organizations._id)} key={i + 1} className="border-b dark:border-neutral-500">
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">{i + 1}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{organizations.name}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{organizations.address}</td>
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

export default OrgTable;
