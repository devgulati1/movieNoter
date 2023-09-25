import { useState } from "react";

export default function StarRating({
  maxStars = 5,
  color = "#FFFF00",
  size = 48,
  onSetUserRating,
  initialRating = 0,
}) {
  const [starNoClick, setStarNoClick] = useState(initialRating);
  const [tempRating, setTempRating] = useState(0);
  const handleStarClick = (num) => {
    setStarNoClick(num + 1);
    onSetUserRating(num + 1);
  };
  const containerDivStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };
  const starDivStyle = {
    display: "flex",
    gap: "4px",
  };
  const textStyle = {
    lineHeight: "1",
    margin: "0",
  };

  return (
    <div style={containerDivStyle}>
      <div style={starDivStyle}>
        {Array.from({ length: maxStars }, (v, i) => (
          <Star
            key={i}
            color={color}
            size={size}
            handleStarClick={handleStarClick}
            i={i}
            full={starNoClick ? starNoClick > i : tempRating > i}
            onMouseIn={(i) => setTempRating(i + 1)}
            onMouseOut={() => setTempRating(0)}
          >
            S{i}
          </Star>
        ))}
      </div>
      <p style={textStyle}>{starNoClick || tempRating || ""}</p>
    </div>
  );
}
function Star({
  i,
  handleStarClick,
  full = false,
  onMouseOut,
  onMouseIn,
  color,
  size,
}) {
  return (
    <span
      onMouseEnter={() => onMouseIn(i)}
      onMouseLeave={onMouseOut}
      onClick={() => handleStarClick(i)}
      style={{ height: `${size}px`, width: `${size}px`, cursor: "pointer" }}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke="#000"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#000"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
