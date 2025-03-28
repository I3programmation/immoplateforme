import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

interface PrioritySelectorProps {
  priority: string;
  onChange: (priority: string) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  priority,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPriorityColor = (priority: number) => {
    if (priority >= 1 && priority <= 6) {
      return "bg-green-500";
    } else if (priority >= 7 && priority <= 11) {
      return "bg-orange-500";
    } else if (priority >= 12 && priority <= 15) {
      return "bg-red-500";
    } else {
      return "bg-gray-300"; // Default color
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
    setIsOpen(false);
  };

  return (
    <div onClick={() => setIsOpen(!isOpen)} className="relative border border-gray-300 rounded-md p-2 w-[5rem] justify-between flex items-center">
      <div
        className={`w-6  h-6 rounded-full flex items-center justify-center cursor-pointer ${getPriorityColor(
          parseInt(priority, 10)
        )}`}

        style={{
          fontSize: "13px",
          color: "black",
          fontWeight: "bold",
          lineHeight: "1",
        }}
      >
        {priority}

      </div>
      <ChevronDown size={16} />
      {isOpen && (
        <select
          value={priority}
          onChange={handleSelect}
          className="absolute top-12 left-0 border p-2 bg-white z-50 w-[5rem]"
          size={15}
        >
          {[...Array(15).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default PrioritySelector;
