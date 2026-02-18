import { useEffect, useState, useContext } from "react";
import { db } from "./firebase";
import {
    collection,
    getDocs,
    query,
    orderBy,
    updateDoc,
    serverTimestamp,
    doc
} from "firebase/firestore";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import "./UserViewForms.css";

function UserViewForms() {
    const [maintenanceForms, setMaintenanceForms] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const q = query(
                    collection(db, "molds"),
                    orderBy("submittedAt", "desc")
                );
                const querySnapShot = await getDocs(q);
                const formData = querySnapShot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMaintenanceForms(formData);
            } catch (err) {
                console.error("Error fetching forms:", err);
            }
        };

        fetchForms();
    }, []);

    // ✅ Normalize Firestore Timestamp OR JS Date
    const getDate = (value) => {
        if (!value) return null;
        if (typeof value.toDate === "function") return value.toDate();
        return value; // already a JS Date
    };

    // ⏱️ Calculate time difference
    const calTimeDiff = (submittedAt, fixedAt) => {
        if (!submittedAt || !fixedAt) return "-";

        const diffMs = fixedAt - submittedAt;
        const mins = Math.floor(diffMs / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day(s)`;
        if (hours > 0) return `${hours} hour(s)`;
        return `${mins} minute(s)`;
    };

    const markFixed = async (formId) => {
        if (!user) return;

        const fixedByName = `${user.firstName} ${user.lastName}`;

        try {
            const formRef = doc(db, "molds", formId);

            await updateDoc(formRef, {
                status: "fixed",
                fixedBy: fixedByName,
                fixedAt: serverTimestamp(),
            });

            // ✅ Optimistic UI update
            setMaintenanceForms(prev =>
                prev.map(form =>
                    form.id === formId
                        ? {
                            ...form,
                            status: "fixed",
                            fixedBy: fixedByName,
                            fixedAt: new Date(),
                        }
                        : form
                )
            );
        } catch (error) {
            console.error("Failed to mark form as fixed:", error);
        }
    };

    return (
        <>
        <div className="page-container">
            <ul className="nav-list">
                <li onClick={() => navigate("/home")} style={{ cursor: "pointer", color: "blue" }}>
                    Profile Page
                </li>

                {user?.role === "admin" && (
                    <li onClick={() => navigate("/createForm")} style={{ cursor: "pointer", color: "blue" }}>
                        Submit Mold Request Form
                    </li>
                )}

                {(user?.role === "admin" || user?.role === "maintenance") && (
                    <li onClick={() => navigate("/userViewAll")} style={{ cursor: "pointer", color: "blue" }}>
                        View All Request
                    </li>
                )}

                {user?.role === "maintenance" && (
                    <li onClick={() => navigate("/myCompletedTask")} style={{ cursor: "pointer", color: "blue" }}>
                        My Completed Task
                    </li>
                )}
            </ul>
            
            <h2>Maintenance Needs</h2>

            <table border="1">
                <thead>
                    <tr>
                        <th>Machine</th>
                        <th>Message</th>
                        <th>Time Submitted</th>
                        <th>Time Pending</th>
                        <th>Time Completed</th>
                        <th>Fixed By</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {maintenanceForms.map(form => {
                        const submitted = getDate(form.submittedAt);
                        const fixed = getDate(form.fixedAt);

                        return (
                            <tr key={form.id}>
                                <td>{form.machine}</td>
                                <td>{form.machineMessage}</td>

                                {/* ✅ Submitted time */}
                                <td>{submitted ? submitted.toLocaleString() : "-"}</td>

                                {/* ✅ Pending duration */}
                                <td>
                                    {submitted
                                        ? form.status === "fixed"
                                            ? calTimeDiff(submitted, fixed)
                                            : calTimeDiff(submitted, new Date())
                                        : "-"}
                                </td>

                                {/* ✅ Completed time */}
                                <td>{fixed ? fixed.toLocaleString() : "-"}</td>

                                <td>{form.fixedBy || "-"}</td>

                                <td>
                                    {form.status !== "fixed" && user && (
                                        <button onClick={() => markFixed(form.id)}>
                                            Mark as Fixed
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
        </>
        
    );
}

export default UserViewForms;