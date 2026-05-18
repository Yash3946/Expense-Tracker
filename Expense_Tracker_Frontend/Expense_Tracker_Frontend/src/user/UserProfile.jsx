import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-toastify'

export const UserProfile = () => {

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    const getProfile = async () => {
        try {

            const res = await axiosInstance.get("/user/profile")

            setUser(res.data.data)

        } catch (error) {

            console.log(error)

            toast.error("Failed to load profile")

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProfile()
    }, [])

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                    fontSize: "24px",
                    fontWeight: "bold"
                }}
            >
                Loading...
            </div>
        )
    }

    return (

        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f3f4f6",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "700px",
                    backgroundColor: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }}
            >

                {/* Top Banner */}
                <div
                    style={{
                        height: "150px",
                        background: "linear-gradient(to right, #4f46e5, #7c3aed)"
                    }}
                ></div>

                {/* Profile Section */}
                <div
                    style={{
                        padding: "20px",
                        marginTop: "-70px",
                        textAlign: "center"
                    }}
                >

                    {
                        user.profilePic ? (
                            <img
                                src={user.profilePic}
                                alt="profile"
                                style={{
                                    width: "130px",
                                    height: "130px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "5px solid white"
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "130px",
                                    height: "130px",
                                    borderRadius: "50%",
                                    backgroundColor: "#e0e7ff",
                                    color: "#4338ca",
                                    fontSize: "48px",
                                    fontWeight: "bold",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "auto",
                                    border: "5px solid white"
                                }}
                            >
                                {user.firstName?.charAt(0)}
                            </div>
                        )
                    }

                    <h1
                        style={{
                            marginTop: "15px",
                            fontSize: "28px",
                            fontWeight: "bold",
                            color: "#111827"
                        }}
                    >
                        {user.firstName} {user.lastName}
                    </h1>


                    {/* Info Cards */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "20px",
                            marginTop: "30px"
                        }}
                    >

                        {/* Personal Info */}
                        <div
                            style={{
                                backgroundColor: "#f9fafb",
                                padding: "20px",
                                borderRadius: "15px",
                                textAlign: "left"
                            }}
                        >

                            <h2
                                style={{
                                    marginBottom: "15px",
                                    color: "#4f46e5"
                                }}
                            >
                                Personal Information
                            </h2>

                            <p>
                                <strong>First Name :</strong> {user.firstName}
                            </p>

                            <p style={{ marginTop: "10px" }}>
                                <strong>Last Name :</strong> {user.lastName}
                            </p>

                            <p style={{ marginTop: "10px" }}>
                                <strong>Email :</strong> {user.email}
                            </p>

                        </div>

                        {/* Other Info */}
                        <div
                            style={{
                                backgroundColor: "#f9fafb",
                                padding: "20px",
                                borderRadius: "15px",
                                textAlign: "left"
                            }}
                        >

                            <h2
                                style={{
                                    marginBottom: "15px",
                                    color: "#4f46e5"
                                }}
                            >
                                Other Details
                            </h2>

                            <p>
                                <strong>Age :</strong> {user.age || "Not Added"}
                            </p>

                            <p style={{ marginTop: "10px" }}>
                                <strong>Gender :</strong> {user.gender || "N/A"}
                            </p>

                            <p style={{ marginTop: "10px" }}>
                                <strong>Role :</strong> {user.role || "User"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}