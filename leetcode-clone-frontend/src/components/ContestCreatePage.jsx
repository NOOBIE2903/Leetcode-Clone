import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/app";

function ContestCreatePage() {
  const [contest, setContest] = useState(() => {
    const savedContest = localStorage.getItem("contestFormData");
    return savedContest
      ? JSON.parse(savedContest)
      : {
          title: "",
          description: "",
          rules: "",
          start_time: "",
          end_time: "",
        };
  });

  const [problems, setProblems] = useState(() => {
    const savedProblems = localStorage.getItem("problemsFormData");
    return savedProblems
      ? JSON.parse(savedProblems)
      : [
          {
            title: "",
            description: "",
            constraints: "",
            input_format: "",
            output_format: "",
            difficulty: "Easy",
            points: 100,
            testCases: [
              { input_data: "", expected_output: "", is_hidden: false },
            ],
          },
        ];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("contestFormData", JSON.stringify(contest));
  }, [contest]);

  useEffect(() => {
    localStorage.setItem("problemsFormData", JSON.stringify(problems));
  }, [problems]);

  const handleContestChange = (e) => {
    setContest({ ...contest, [e.target.name]: e.target.value });
  };

  const handleProblemChange = (index, e) => {
    const newProblems = [...problems];
    newProblems[index][e.target.name] = e.target.value;
    setProblems(newProblems);
  };

  const handleTestCaseChange = (problemIndex, testCaseIndex, e) => {
    const newProblems = [...problems];
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    newProblems[problemIndex].testCases[testCaseIndex][target.name] = value;
    setProblems(newProblems);
  };

  const addProblem = () => {
    setProblems([
      ...problems,
      {
        title: "",
        description: "",
        constraints: "",
        input_format: "",
        output_format: "",
        difficulty: "Easy",
        points: 100,
        testCases: [{ input_data: "", expected_output: "", is_hidden: false }],
      },
    ]);
  };

  const addTestCase = (problemIndex) => {
    const newProblems = [...problems];
    newProblems[problemIndex].testCases.push({
      input_data: "",
      expected_output: "",
      is_hidden: false,
    });
    setProblems(newProblems);
  };

  const removeTestCase = (problemIndex, testCaseIndex) => {
    const newProblems = [...problems];
    if (newProblems[problemIndex].testCases.length > 1) {
      newProblems[problemIndex].testCases.splice(testCaseIndex, 1);
      setProblems(newProblems);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const contestDataForAPI = {
        ...contest,
        startTime: new Date(contest.start_time).toISOString(),
        endTime: new Date(contest.end_time).toISOString(),
      };

      const contestResponse = await apiClient.post(
        "/contests/create/",
        contestDataForAPI
      );
      const contestId = contestResponse.data.id;

      for (const problem of problems) {
        await apiClient.post("/problems/create/", {
          ...problem,
          contest: contestId,
        });
      }

      localStorage.removeItem("contestFormData");
      localStorage.removeItem("problemsFormData");

      setMessage("Contest created successfully!");
      navigate(`/contests/${contestId}`);
    } catch (error) {
      setMessage("Failed to create contest. Please check all fields.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Create a New Contest
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          {/* Contest Details Section */}
          <fieldset className="space-y-4 p-4 border border-gray-700 rounded-md">
            <legend className="text-2xl font-semibold px-2">
              Contest Details
            </legend>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                value={contest.title}
                onChange={handleContestChange}
                placeholder="Contest Title"
                required
                className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={contest.description}
                onChange={handleContestChange}
                placeholder="A brief summary of the contest"
                required
                rows="3"
                className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="rules"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Rules
              </label>
              <textarea
                id="rules"
                name="rules"
                value={contest.rules}
                onChange={handleContestChange}
                placeholder="List the rules for participation"
                required
                rows="3"
                className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full">
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Start Time
                </label>
                <input
                  id="start_time"
                  type="datetime-local"
                  name="start_time"
                  value={contest.start_time}
                  onChange={handleContestChange}
                  required
                  className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="end_time"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  End Time
                </label>
                <input
                  id="end_time"
                  type="datetime-local"
                  name="end_time"
                  value={contest.end_time}
                  onChange={handleContestChange}
                  required
                  className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </fieldset>

          {/* Problems Section */}
          {problems.map((problem, problemIndex) => (
            <fieldset
              key={problemIndex}
              className="space-y-4 p-4 border border-gray-700 rounded-md"
            >
              <legend className="text-xl font-semibold px-2">
                Problem {problemIndex + 1}
              </legend>
              <input
                name="title"
                value={problem.title}
                onChange={(e) => handleProblemChange(problemIndex, e)}
                placeholder="Problem Title"
                required
                className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
              />
              <textarea
                name="description"
                value={problem.description}
                onChange={(e) => handleProblemChange(problemIndex, e)}
                placeholder="Problem Statement"
                required
                rows="4"
                className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
              />
              <textarea
                name="input_format"
                value={problem.input_format}
                onChange={(e) => handleProblemChange(problemIndex, e)}
                placeholder="Input Format"
                rows="2"
                className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
              />
              <textarea
                name="output_format"
                value={problem.output_format}
                onChange={(e) => handleProblemChange(problemIndex, e)}
                placeholder="Output Format"
                rows="2"
                className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
              />
              <textarea
                name="constraints"
                value={problem.constraints}
                onChange={(e) => handleProblemChange(problemIndex, e)}
                placeholder="Constraints (e.g., 1 <= n <= 100)"
                required
                rows="2"
                className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
              />
              <div className="flex space-x-4">
                <select
                  name="difficulty"
                  value={problem.difficulty}
                  onChange={(e) => handleProblemChange(problemIndex, e)}
                  className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
                <input
                  type="number"
                  name="points"
                  value={problem.points}
                  onChange={(e) => handleProblemChange(problemIndex, e)}
                  placeholder="Points"
                  required
                  className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
                />
              </div>

              {/* Test Cases Section */}
              <div className="space-y-2 pt-2">
                <h3 className="text-lg font-medium text-gray-300">
                  Test Cases
                </h3>
                {problem.testCases.map((testCase, testCaseIndex) => (
                  <div
                    key={testCaseIndex}
                    className="p-3 bg-gray-900/50 rounded-md"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      <textarea
                        name="input_data"
                        value={testCase.input_data}
                        onChange={(e) =>
                          handleTestCaseChange(problemIndex, testCaseIndex, e)
                        }
                        placeholder={`Input for Test Case ${testCaseIndex + 1}`}
                        required
                        className="w-full p-2 bg-gray-600 rounded-md border border-gray-500 h-20"
                      />
                      <textarea
                        name="expected_output"
                        value={testCase.expected_output}
                        onChange={(e) =>
                          handleTestCaseChange(problemIndex, testCaseIndex, e)
                        }
                        placeholder={`Expected Output for Test Case ${
                          testCaseIndex + 1
                        }`}
                        required
                        className="w-full p-2 bg-gray-600 rounded-md border border-gray-500 h-20"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center space-x-2 text-gray-400">
                        <input
                          type="checkbox"
                          name="is_hidden"
                          checked={testCase.is_hidden}
                          onChange={(e) =>
                            handleTestCaseChange(problemIndex, testCaseIndex, e)
                          }
                          className="form-checkbox bg-gray-700 border-gray-600 rounded"
                        />
                        <span>Is Hidden?</span>
                      </label>
                      {problem.testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeTestCase(problemIndex, testCaseIndex)
                          }
                          className="text-red-500 hover:text-red-400 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addTestCase(problemIndex)}
                  className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm"
                >
                  Add Test Case
                </button>
              </div>
            </fieldset>
          ))}

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={addProblem}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Add Another Problem
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md text-lg disabled:bg-gray-500"
            >
              {isSubmitting ? "Creating..." : "Create Contest"}
            </button>
          </div>

          {message && (
            <p className="text-center text-yellow-400 mt-4">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ContestCreatePage;
