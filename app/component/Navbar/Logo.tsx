import React from "react";
import { IoPieChartOutline } from "react-icons/io5";

const Logo = () => {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <IoPieChartOutline className="text-3xl z-50" />
        <span className="font-bold text-xl z-50">QualifAI</span>
      </div>
    </div>
  );
};

export default Logo;
