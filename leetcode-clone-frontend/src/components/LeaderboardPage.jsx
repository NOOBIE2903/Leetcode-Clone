import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/app';

function LeaderboardPage() {
  const { id } = useParams(); 
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const response = await apiClient.get(`/contests/${id}/leaderboard/`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 20000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="bg-gray-900 min-h-screen text-white text-center p-8">Loading Leaderboard...</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Live Leaderboard</h1>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {leaderboard.map((participant, index) => (
                <tr key={participant.username} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-lg font-bold">{index + 1}</td>
                  <td className="px-6 py-4 text-lg">{participant.username}</td>
                  <td className="px-6 py-4 text-lg text-yellow-400">{participant.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;