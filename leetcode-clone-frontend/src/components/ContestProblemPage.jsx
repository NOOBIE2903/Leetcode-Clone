import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/app';
import CountdownTimer from './CountdownTimer';

function ContestProblemsPage() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContestProblems = async () => {
      try {
        const response = await apiClient.get(`/contests/${id}/`);
        setContest(response.data);
      } catch (error) {
        console.error("Failed to fetch contest problems", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContestProblems();
  }, [id]);

  if (loading) return <div className="bg-gray-900 min-h-screen text-white text-center p-8">Loading problems...</div>;
  if (!contest) return <div className="bg-gray-900 min-h-screen text-red-500 text-center p-8">Contest not found.</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        {contest && <CountdownTimer endTime={contest.endTime} />}
        <h1 className="text-4xl font-bold mb-6 text-center">{contest.title} - Problems</h1>
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <ul className="divide-y divide-gray-700">
            {contest.problems.map(problem => (
              <li key={problem.id} className="p-4 flex justify-between items-center hover:bg-gray-700 transition-colors">
                <Link to={`/problems/${problem.id}`} className="text-lg text-blue-400 hover:underline">
                  {problem.title}
                </Link>
                <span className="text-yellow-400 font-bold">{problem.points} Points</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ContestProblemsPage;