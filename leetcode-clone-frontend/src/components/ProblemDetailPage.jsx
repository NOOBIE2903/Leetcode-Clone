import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import apiClient from "../services/app";
import AuthContext from "./context/AuthContext";
import Comment from "./Comment";
import CountdownTimer from "./CountdownTimer";
import Latex from "react-latex";

const languageBoilerplate = {
  cpp: `#include <iostream>
#include <vector>
#include <string>

// Use std namespace to avoid typing std:: everywhere
using namespace std;

int main() {
    // Read input from stdin
    cout << "Hello from C++" << endl;
    return 0;
}`,
  python: `# Write your solution here
def solve():
  print("Hello from Python")

solve()`,
  javascript: `// Write your solution here
function main() {
    console.log("Hello from JavaScript");
}

main();`,
};

function ProblemDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);

  const [problem, setProblem] = useState(null);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const [code, setCode] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(`code-problem-${id}-${language}`, code);
  }, [code, id, language]);

  const handleLanguageChange = async (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    if (isAuthenticated) {
      try {
        const response = await apiClient.get(
          `/users/drafts/problem/${id}/language/${newLanguage}/`
        );
        setCode(response.data.code);
      } catch (error) {
        setCode(languageBoilerplate[newLanguage]);
      }
    } else {
      setCode(languageBoilerplate[newLanguage]);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsResponse = await apiClient.get(`/problems/${id}/comments/`);
      setComments(commentsResponse.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const problemResponse = await apiClient.get(`/problems/${id}/`);
        setProblem(problemResponse.data);

        if (problemResponse.data.contest) {
          const contestResponse = await apiClient.get(
            `/contests/${problemResponse.data.contest}/`
          );
          setContest(contestResponse.data);
        }

        await fetchComments();

        if (isAuthenticated) {
          try {
            const draftResponse = await apiClient.get(
              `/users/drafts/problem/${id}/language/${language}/`
            );
            setCode(draftResponse.data.code);
          } catch (error) {
            setCode(languageBoilerplate[language]);
          }
        } else {
          setCode(languageBoilerplate[language]);
        }
      } catch (err) {
        setError("Failed to load the problem data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, isAuthenticated]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);
    try {
      const response = await apiClient.post("/submissions/create/", {
        problem: id,
        language: language,
        code: code,
      });
      setSubmissionResult(response.data);
      if (response.data.status === "Accepted") {
        setProblem((prevProblem) => ({ ...prevProblem, isSolved: true }));
        alert("Congratulations! Problem solved correctly.");
        // navigate('/');
      }
    } catch (err) {
      setSubmissionResult({
        status: "Error",
        output: "Failed to submit. Please log in.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (e, parentId = null) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      alert("You must be logged in to comment.");
      return;
    }
    try {
      await apiClient.post(`/problems/${id}/comments/`, {
        content: newComment,
        parent: parentId,
      });
      setNewComment("");
      setReplyingTo(null);
      await fetchComments();
    } catch (error) {
      console.error("Failed to post comment", error);
      alert("Failed to post comment.");
    }
  };

  useEffect(() => {
    if (
      !isAuthenticated ||
      !problem ||
      code === languageBoilerplate[language]
    ) {
      return;
    }

    const handler = setTimeout(() => {
      apiClient.post(`/users/drafts/problem/${id}/language/${language}/`, {
        code,
      });
    }, 1500);

    return () => clearTimeout(handler);
  }, [code, id, language, isAuthenticated, problem]);

  if (loading)
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  if (!problem) return null;

  console.log(problem);
  console.log(submissionResult);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white font-sans">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto">
        {contest && new Date(contest.endTime) > new Date() && (
          <CountdownTimer endTime={contest.endTime} />
        )}

        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-bold">{problem.title}</h1>
          {problem.isSolved && (
            <div className="flex items-center ml-4 bg-green-800 text-green-200 text-sm font-bold px-3 py-1 rounded-full">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Solved
            </div>
          )}
        </div>

        <div className="flex items-center mb-4 space-x-4">
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              problem.difficulty === "Easy"
                ? "bg-green-800 text-green-200"
                : problem.difficulty === "Medium"
                ? "bg-yellow-800 text-yellow-200"
                : "bg-red-800 text-red-200"
            }`}
          >
            {problem.difficulty}
          </span>
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-700 px-2 py-1 text-xs rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div
          className="prose prose-invert max-w-none text-gray-300 mb-6"
          dangerouslySetInnerHTML={{
            __html: problem.description?.replace(/\n/g, "<br/>") ?? "",
          }}
        />

        <h2 className="text-xl font-semibold mt-6 mb-2">Input Format</h2>
        <div
          className="prose prose-invert max-w-none text-gray-300 mb-6"
          dangerouslySetInnerHTML={{
            __html: problem.inputFormat?.replace(/\n/g, "<br/>") ?? "",
          }}
        />

        <h2 className="text-xl font-semibold mt-6 mb-2">Output Format</h2>
        <div
          className="prose prose-invert max-w-none text-gray-300 mb-6"
          dangerouslySetInnerHTML={{
            __html: problem.outputFormat?.replace(/\n/g, "<br/>") ?? "",
          }}
        />

        <h2 className="text-xl font-semibold mt-6 mb-2">Constraints</h2>
        <div
          className="prose prose-invert max-w-none text-gray-300 mb-6"
          // dangerouslySetInnerHTML={{
          //   __html: problem.constraints?.replace(/\n/g, "<br/>") ?? "",
          // }}
        >
          <Latex>{`$${
            problem.constraints?.replace(/\n/g, "<br/>") ?? ""
          }$`}</Latex>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2">Examples</h2>
        <div className="space-y-4">
          {problem.testCases &&
            problem.testCases.map((tc, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <p className="font-semibold mb-2 text-gray-300">
                  Example {index + 1}:
                </p>
                <div className="text-sm font-mono space-y-1">
                  <p>
                    <strong className="text-gray-400">Input:</strong>{" "}
                    <code className="bg-gray-700 p-1 rounded-md text-white whitespace-pre-wrap">
                      {tc.inputData}
                    </code>
                  </p>
                  <p>
                    <strong className="text-gray-400">Output:</strong>{" "}
                    <code className="bg-gray-700 p-1 rounded-md text-white">
                      {tc.expectedOutput}
                    </code>
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Discussion Section */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Discussion</h2>
          {problem.isInActiveContest ? (
            // If yes, show the locked message
            <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
              <p>Discussions are locked for the duration of the contest.</p>
            </div>
          ) : (
            // If no, show the regular comment form and list
            <>
              <form onSubmit={(e) => handleCommentSubmit(e)} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Post Comment
                </button>
              </form>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <Comment
                      comment={comment}
                      onReply={setReplyingTo}
                      isTopLevel={true}
                    />
                    {replyingTo === comment.id && (
                      <form
                        onSubmit={(e) => handleCommentSubmit(e, comment.id)}
                        className="mt-2 ml-12"
                      >
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={`Replying to ${comment.author}...`}
                          className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"
                          rows="2"
                          autoFocus
                        ></textarea>
                        <div className="flex space-x-2 mt-2">
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded-md"
                          >
                            Submit Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => setReplyingTo(null)}
                            className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold py-1 px-3 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Panel: Code Editor and Submission */}
      <div className="w-full md:w-1/2 flex flex-col p-4 bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="flex-grow border border-gray-700 rounded-lg overflow-hidden">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        </div>

        <div className="mt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        {submissionResult && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-bold mb-2">
              Result:
              <span
                className={
                  submissionResult.status === "Accepted"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {" "}
                {submissionResult.status}
              </span>
            </h3>

            {/* If the answer is wrong, show the test case details */}
            {submissionResult.status === "Wrong Answer" && (
              <div className="font-mono text-sm space-y-2 mt-2">
                <div>
                  <p className="text-gray-400">Input:</p>
                  <pre className="bg-gray-900 p-2 rounded whitespace-pre-wrap">
                    <code>{submissionResult.failingInput}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-gray-400">Your Output:</p>
                  <pre className="bg-gray-900 p-2 rounded whitespace-pre-wrap">
                    <code>{submissionResult.output}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-gray-400">Expected Output:</p>
                  <pre className="bg-gray-900 p-2 rounded whitespace-pre-wrap">
                    <code>{submissionResult.expectedOutput}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* For other statuses, show the standard output */}
            {submissionResult.status !== "Wrong Answer" && (
              <pre className="bg-gray-900 p-3 rounded-md text-sm whitespace-pre-wrap font-mono">
                <code>{submissionResult.output || "No output."}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemDetailPage;
