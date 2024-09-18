import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OccupationSwitch.css";

const OccupationSwitch = () => {
  const [occupation, setOccupation] = useState("2D Visualizer");
  const [isZoomed, setIsZoomed] = useState(false);
  const navigate = useNavigate();

  const toggleOccupation = () => {
    setOccupation(occupation === "2D Visualizer" ? "3D Creator" : "2D Visualizer");
  };

  useEffect(() => {
    let clickCount = 0;

    const handleToggle = () => {
      clickCount += 1;

      if (clickCount >= 1) { // Trigger zoom effect after 5 toggles
        setIsZoomed(true);
        setTimeout(() => {
          navigate("/homepage"); // Navigate to homepage after zoom
        }, 1000); // Adjust timing for smoothness
      }
    };

    document.querySelector(".switch__button")?.addEventListener("click", handleToggle);
    
    return () => {
      document.querySelector(".switch__button")?.removeEventListener("click", handleToggle);
    };
  }, [navigate]);

  return (
    <div className={`switch ${isZoomed ? "zoom-effect" : ""}`}>
      <label className="switch__label" htmlFor="occupation" id="visualizer">
        2D Visualizer
      </label>
      <button
        className={`switch__button ${occupation === "3D Creator" ? "switch__button--3d" : ""}`}
        type="button"
        id="occupation"
        title="Switch between 2D Visualizer or 3D Creator"
        aria-live="polite"
        aria-labelledby="visualizer"
        onClick={toggleOccupation}
      >
        <svg className="switch__icon" viewBox="0 0 16 16" width="16px" height="16px" aria-hidden="true">
          <g fill="none" stroke="hsl(223,10%,10%)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <g className="switch__icon1" transform="translate(1,1)">
              <polyline className="switch__icon1-1" points="0 0,6 6" strokeDasharray="8.49 8.49" />
              <polyline className="switch__icon1-2" points="0 0,0 8.49" strokeDasharray="8.49 8.49" transform="rotate(-45) translate(0,8.49) rotate(90)" />
              <polyline className="switch__icon1-3" points="0 0,-6 6" strokeDasharray="16.98 8.49" strokeDashoffset="16.98" transform="rotate(-12)" />
              <polyline className="switch__icon1-4" points="0 0,0 8.49" strokeDasharray="8.49 16.98" strokeDashoffset="16.98" transform="rotate(33) translate(0,8.49) rotate(-57)" />
              <polyline className="switch__icon1-5" points="0 0,0 8" strokeDasharray="16 8" strokeDashoffset="16" />
              <circle className="switch__icon1-6" cx="0" cy="8" r="1" strokeDasharray="6.29 12.57" strokeDashoffset="12.57" />
            </g>
            <g className="switch__icon2" transform="translate(8,15)">
              <polyline className="switch__icon2-1" points="0 0,7 0" />
              <polyline className="switch__icon2-2" points="0 0,0 4" strokeDasharray="4 4" strokeDashoffset="4" />
              <polyline className="switch__icon2-3" points="7 0,7 4" strokeDasharray="4 4" strokeDashoffset="4" />
              <polyline className="switch__icon2-4" points="0 0,7 0" />
            </g>
          </g>
        </svg>
      </button>
      <label className="switch__label" htmlFor="occupation" id="creator">
        3D Creator
      </label>
    </div>
  );
};

export default OccupationSwitch;
