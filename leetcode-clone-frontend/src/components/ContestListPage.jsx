import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/app";

function ContestListPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await apiClient.get("/contests/");
        setContests(response.data);
      } catch (error) {
        console.error("Failed to fetch contests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const getContestStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return { text: "Upcoming", color: "bg-blue-600" };
    if (now > end) return { text: "Finished", color: "bg-gray-600" };
    return { text: "Live", color: "bg-green-600" };
  };

  if (loading)
    return (
      <div className="bg-gray-900 min-h-screen text-white text-center p-8">
        Loading contests...
      </div>
    );

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Contests</h1>
          <Link
            to="/contests/create"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Contest
          </Link>
        </div>
        <div className="space-y-4">
          {contests.map((contest) => {
            const status = getContestStatus(contest.startTime, contest.endTime);
            const startTime = new Date(contest.startTime);

            return (
              <Link
                to={`/contests/${contest.id}`}
                key={contest.id}
                className="block bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{contest.title}</h2>
                    {status.text === "Finished" ? (
                      <p className="text-gray-500">Contest has ended</p>
                    ) : (
                      <p className="text-gray-400">
                        Starts: { !isNaN(startTime) ? startTime.toLocaleString() : "Invalid Date" }
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full ${status.color}`}
                  >
                    {status.text}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ContestListPage;