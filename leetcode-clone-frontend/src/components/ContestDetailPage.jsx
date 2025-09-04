import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; 
import apiClient from "../services/app";
import AuthContext from "./context/AuthContext"; 
import CountdownTimer from "./CountdownTimer"; 

function ContestDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await apiClient.get(`/contests/${id}/`);
        setContest(response.data);
        setIsRegistered(response.data.isRegistered);
      } catch (error) {
        console.error("Failed to fetch contest details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      setMessage("You must be logged in to register.");
      return;
    }
    try {
      const response = await apiClient.post(`/contests/${id}/register/`);
      setMessage(response.data.detail);
      setIsRegistered(true);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Registration failed.");
    }
  };

  const getContestStatus = () => {
    if (!contest) return "Loading";
    const startTime = new Date(contest.startTime);
    const endTime = new Date(contest.endTime);

    if (now < startTime) return "Upcoming";
    if (now > endTime) return "Finished";
    return "Live";
  };

  const status = getContestStatus();
  const isLive = status === "Live";

  const handleEnterContest = () => {
    if (!isRegistered) {
      alert("You must be registered for the contest to enter.");
      return; 
    }
    if (!isLive) {
      alert(`The contest is not live. It is currently: ${status}`);
      return; 
    }
    
    navigate(`/contests/${id}/problems`);
  };

  if (loading)
    return (
      <div className="bg-gray-900 min-h-screen text-white text-center p-8">
        Loading contest...
      </div>
    );
  if (!contest)
    return (
      <div className="bg-gray-900 min-h-screen text-red-500 text-center p-8">
        Contest not found.
      </div>
    );

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        {status !== "Upcoming" && <CountdownTimer endTime={contest.endTime} />}

        <h1 className="text-4xl font-bold mt-4 mb-2">{contest.title}</h1>
        <p className="text-gray-400 mb-6">
          From {new Date(contest.startTime).toLocaleString()} to{" "}
          {new Date(contest.endTime).toLocaleString()}
        </p>

        {/* Description and Rules Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-left mb-6 space-y-4">
          {contest.description && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Description</h2>
              <div
                className="text-gray-300 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: contest.description.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          )}
          {contest.rules && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Rules</h2>
              <div
                className="text-gray-300 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: contest.rules.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-x-4">
          {status === "Finished" ? (
            <Link
              to={`/contests/${id}/problems`}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Review Contest
            </Link>
          ) : (
            <>
              <button
                onClick={handleRegister}
                disabled={isRegistered}
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed enabled:hover:bg-blue-700"
              >
                {isRegistered ? "Registered" : "Register for Contest"}
              </button>

              <button
                onClick={handleEnterContest}
                disabled={!isRegistered || !isLive}
                className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed enabled:hover:bg-green-700"
              >
                Enter Contest
              </button>
            </>
          )}
          <Link
            to={`/contests/${id}/leaderboard`}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            View Leaderboard
          </Link>
        </div>

        {message && <p className="mt-4 text-yellow-400">{message}</p>}
      </div>
    </div>
  );
}

export default ContestDetailPage;
