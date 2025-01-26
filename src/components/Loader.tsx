// CSS
import "../css/Loader.css";

// React
import React from "react";

const loader: React.FC = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default loader;