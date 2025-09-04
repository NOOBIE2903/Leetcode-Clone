import React, { useState, useEffect } from "react";

function CountdownTimer({ endTime }) {
  const calculateTimeLeft = () => {
    const difference = new Date(endTime) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Mins: Math.floor((difference / 1000 / 60) % 60),
        Secs: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval] && (interval === "Days" || interval === "Hours")) {
      return null;
    }
    return (
      <span key={interval} className="text-lg mx-2">
        {String(timeLeft[interval]).padStart(2, "0")}
        <span className="text-xs ml-1">{interval}</span>
      </span>
    );
  });

  const isFinished = !timerComponents.length;
  const statusText = isFinished ? "Contest Finished" : "Time Left:";
  const statusColor = isFinished
    ? "bg-red-800 text-red-200"
    : "bg-gray-700 text-yellow-400";

  return (
    <div
      className={`${statusColor} font-bold p-3 rounded-lg shadow-inner mb-4 text-center`}
    >
      <span className="mr-2">{statusText}</span>
      {!isFinished && timerComponents}
    </div>
  );
}

export default CountdownTimer;
