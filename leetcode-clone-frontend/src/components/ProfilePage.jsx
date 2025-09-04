import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/app";
import AuthContext from "./context/AuthContext";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: "",
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const fetchProfileData = async () => {
    try {
      const [profileRes, submissionsRes, statsRes] = await Promise.all([
        apiClient.get("/users/profile/"),
        apiClient.get("/submissions/"),
        apiClient.get("/users/profile/stats/"),
      ]);

      setProfile(profileRes.data);
      setSubmissions(submissionsRes.data);
      setStats(statsRes.data);

      setFormData({
        linkedinUrl: profileRes.data.linkedinUrl || "",
        githubUrl: profileRes.data.githubUrl || "",
        websiteUrl: profileRes.data.websiteUrl || "",
      });
    } catch (err) {
      setError("Failed to fetch profile data. Please try again.");
      console.error("Failed to fetch profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileData();
    } else {
      setLoading(false);
      setError("You must be logged in to view this page.");
    }
  }, [isAuthenticated]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePictureFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();

    dataToSubmit.append("linkedin_url", formData.linkedinUrl);
    dataToSubmit.append("github_url", formData.githubUrl);
    dataToSubmit.append("website_url", formData.websiteUrl);
    if (profilePictureFile) {
      dataToSubmit.append("profile_picture", profilePictureFile);
    }

    try {
      await apiClient.patch("/users/profile/", dataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsEditing(false); 
      fetchProfileData(); 
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div className="bg-gray-900 min-h-screen text-white text-center p-8">
        Loading profile...
      </div>
    );
  if (error)
    return (
      <div className="bg-gray-900 min-h-screen text-red-500 text-center p-8">
        {error}
      </div>
    );
  if (!profile || !stats) return null; 

  const totalSolved = stats.easySolved + stats.mediumSolved + stats.hardSolved;
  const totalProblems = stats.totalEasy + stats.totalMedium + stats.totalHard;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header and Edit Form Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <img
                src={
                  profile.profilePicture ||
                  `https://api.dicebear.com/8.x/bottts/svg?seed=${profile.username}`
                }
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full mr-6 border-4 border-gray-700 bg-gray-600 object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold">{profile.username}</h1>
                <p className="text-gray-400">{profile.email}</p>
                <div className="flex space-x-4 mt-2">
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-2xl text-gray-400 hover:text-white" />
                    </a>
                  )}
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="text-2xl text-gray-400 hover:text-white" />
                    </a>
                  )}
                  {profile.websiteUrl && (
                    <a
                      href={profile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGlobe className="text-2xl text-gray-400 hover:text-white" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {isEditing && (
            <form
              onSubmit={handleFormSubmit}
              className="mt-6 border-t border-gray-700 pt-6"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Picture
                  </label>
                  <div className="mt-1 flex items-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer"
                    >
                      <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center group">
                        <img
                          src={
                            profilePictureFile
                              ? URL.createObjectURL(profilePictureFile)
                              : profile.profilePicture ||
                                `https://api.dicebear.com/8.x/bottts/svg?seed=${profile.username}`
                          }
                          alt="Avatar Preview"
                          className="w-full h-full rounded-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-direction-column items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-sm font-bold">
                            Edit
                          </span>
                        </div>
                      </div>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleFormChange}
                    className="w-full p-2 bg-gray-700 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleFormChange}
                    className="w-full p-2 bg-gray-700 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleFormChange}
                    className="w-full p-2 bg-gray-700 rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* User Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="font-bold text-lg mb-4">Problems Solved</h3>
            <p className="text-4xl font-bold text-green-400">
              {totalSolved}{" "}
              <span className="text-xl text-gray-400">/ {totalProblems}</span>
            </p>
            <div className="flex justify-around mt-4">
              <div>
                <p className="font-bold text-green-500">{stats.easySolved}</p>
                <p className="text-xs">Easy</p>
              </div>
              <div>
                <p className="font-bold text-yellow-500">
                  {stats.mediumSolved}
                </p>
                <p className="text-xs">Medium</p>
              </div>
              <div>
                <p className="font-bold text-red-500">{stats.hardSolved}</p>
                <p className="text-xs">Hard</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-4">Languages</h3>
            <ul className="space-y-2 text-gray-300">
              {Object.keys(stats.languages).length > 0 ? (
                Object.entries(stats.languages).map(([lang, count]) => (
                  <li key={lang} className="flex justify-between">
                    <span className="capitalize">{lang}</span>
                    <span>{count} problems solved</span>
                  </li>
                ))
              ) : (
                <li>No languages used yet.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Submissions History Section */}
        <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <ul className="divide-y divide-gray-700">
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <li
                  key={sub.id}
                  className="p-4 grid grid-cols-3 items-center gap-4"
                >
                  <Link
                    to={`/problems/${sub.problem}`}
                    className="text-blue-400 hover:underline col-span-1"
                  >
                    Problem #{sub.problem}
                  </Link>
                  <span
                    className={`font-semibold text-center col-span-1 ${
                      sub.status === "Accepted"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {sub.status}
                  </span>
                  <span className="text-gray-500 text-sm text-right col-span-1">
                    {new Date(sub.createdAt).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <li className="p-4 text-gray-500">No submissions yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
