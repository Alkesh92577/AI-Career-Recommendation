import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Report() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const academic = JSON.parse(
        localStorage.getItem("academicDetails")
    );

    return (

        <div className="app-layout">

            <Sidebar />

            <div className="main-area">

                <Navbar />

                <main className="page-container">

                    <div className="page-header">

                        <h1>📄 Career Report</h1>

                        <p>
                            Your career recommendation summary.
                        </p>

                    </div>

                    <div className="report-card">

                        <h2>
                            Student Information
                        </h2>

                        <div className="report-row">

                            <span>Name</span>

                            <strong>
                                {user?.name || "-"}
                            </strong>

                        </div>

                        <div className="report-row">

                            <span>Email</span>

                            <strong>
                                {user?.email || "-"}
                            </strong>

                        </div>

                        {academic && (

                            <>
                                <h2 className="report-section">
                                    Academic Details
                                </h2>

                                <div className="report-row">

                                    <span>Course</span>

                                    <strong>
                                        {academic.course || "-"}
                                    </strong>

                                </div>

                                <div className="report-row">

                                    <span>College</span>

                                    <strong>
                                        {academic.college || "-"}
                                    </strong>

                                </div>

                                <div className="report-row">

                                    <span>Marks</span>

                                    <strong>
                                        {academic.marks || "-"}%
                                    </strong>

                                </div>
                            </>
                        )}

                        <h2 className="report-section">
                            Recommendation
                        </h2>

                        <div className="recommendation-box">

                            🎯

                            <div>

                                <h2>
                                    Complete your assessment
                                </h2>

                                <p>
                                    Take the career prediction
                                    test to generate your
                                    personalized recommendation.
                                </p>

                            </div>

                        </div>

                        <button
                            className="main-button"
                            onClick={() =>
                                window.print()
                            }
                        >
                            Print / Save Report
                        </button>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Report;