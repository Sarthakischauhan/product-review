"use client";
import React, { useState } from "react";
import { MdSettingsSuggest, MdInfoOutline, MdArrowBack, MdArrowForward } from "react-icons/md";

const bezel = "/bezel.png";

const importAllImages = () => {
  const images = [];
  for (let i = 1; i <= 5; i++) {
    images.push(`/app-image${i}.png`);
  }
  return images;
};

const AppScreenViewer = () => {
  const appScreens = importAllImages();

  const [currentImage, setCurrentImage] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [feedbackPoints, setFeedbackPoints] = useState(Array(appScreens.length).fill([]).map(() => []));
  const [isDialogOpen, setIsDialogOpen] = useState(null);
  const [currentClick, setCurrentClick] = useState({ x: 0, y: 0 });
  const [feedbackText, setFeedbackText] = useState("");

  const handleNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % appScreens.length);
    setIsDialogOpen(null);
  };

  const handlePrevious = () => {
    setCurrentImage((prevImage) => (prevImage - 1 + appScreens.length) % appScreens.length);
    setIsDialogOpen(null);
  };

  const handleImageClick = (e) => {
    const imgElement = e.target;
    const rect = imgElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentClick({ x, y });
    setFeedbackText("");
    setIsDialogOpen(null);
    setIsDialogOpen({ x, y, new: true });
  };

  const handleSubmitFeedback = () => {
    const updatedPoints = [...feedbackPoints];
    updatedPoints[currentImage].push({ x: currentClick.x, y: currentClick.y, feedback: feedbackText });
    setFeedbackPoints(updatedPoints);
    setFeedbackText("");
    setIsDialogOpen(null);
  };

  const handleOpenDialog = (point) => {
    setFeedbackText(point.feedback);
    setIsDialogOpen({ x: point.x, y: point.y, new: false, point });
  };

  const handleRemoveFeedback = () => {
    const updatedPoints = [...feedbackPoints];
    updatedPoints[currentImage] = updatedPoints[currentImage].filter((p) => p !== isDialogOpen.point);
    setFeedbackPoints(updatedPoints);
    setIsDialogOpen(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: "375px", height: "812px" }}>
        <img
          src={appScreens[currentImage]}
          alt={`App screen ${currentImage + 1}`}
          className="absolute top-0 left-0"
          style={{
            width: "84%",
            height: "92%",
            marginLeft: "8%",
            marginTop: "9%",
            borderRadius: "48px",
            zIndex: 2,
            cursor: "pointer",
          }}
          onClick={handleImageClick}
        />

        <img
          src={bezel}
          alt="iPhone Bezel"
          className="absolute top-0 left-0 w-full h-full"
          style={{
            zIndex: 1,
          }}
        />

        {feedbackPoints[currentImage].map((point, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setHoveredPoint(index)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <MdSettingsSuggest
              onClick={() => handleOpenDialog(point)}
              className="absolute cursor-pointer"
              style={{
                top: `${point.y}px`,
                left: `${point.x}px`,
                zIndex: 4,
                transform: "translate(-50%, -50%)",
                fontSize: "24px",
                color: "#ff4500",
              }}
              title={point.feedback}
            />

            {hoveredPoint === index && (
              <div
                className="absolute bg-white p-2 border rounded shadow-lg text-sm"
                style={{
                  top: `${point.y - 30}px`,
                  left: `${point.x + 10}px`,
                  zIndex: 5,
                }}
              >
                {point.feedback}
              </div>
            )}
          </div>
        ))}

        {isDialogOpen && (
          <div
            className="absolute bg-white p-2 border rounded shadow-lg"
            style={{
              top: `${isDialogOpen.y}px`,
              left: `${isDialogOpen.x + 40}px`,
              zIndex: 5,
              width: "200px",
            }}
          >
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={isDialogOpen.new ? "Enter feedback..." : "Edit your feedback..."}
              className="w-full p-1 border border-gray-300 rounded"
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => setIsDialogOpen(null)}
                className="text-sm text-red-600"
              >
                Cancel
              </button>
              {isDialogOpen.new ? (
                <button
                  onClick={handleSubmitFeedback}
                  className="text-sm text-blue-600"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleRemoveFeedback}
                  className="text-sm text-blue-600"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center mt-4 space-x-2">
        <MdInfoOutline className="text-gray-600" style={{ fontSize: "24px" }} />
        <p className="text-gray-600">
          Click anywhere on the screen to add your feedback.
        </p>
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={handlePrevious}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <MdArrowBack className="mr-2" /> Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center"
        >
          Next <MdArrowForward className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default AppScreenViewer;
