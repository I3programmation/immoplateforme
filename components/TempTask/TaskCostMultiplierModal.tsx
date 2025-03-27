import { Multiplier } from "@/types/types";
import { useEffect, useState } from "react";

interface TaskCostMultiplierModalProps {
  multipliers: Multiplier[];
  currentlySelectedMultipliers?: Multiplier[];
  setCurrentlySelectedMultipliers: React.Dispatch<
    React.SetStateAction<Multiplier[]>
  >;
  handleClose: () => void;
}

const TaskCostMultiplierModal = ({
  multipliers,
  currentlySelectedMultipliers,
  setCurrentlySelectedMultipliers,
  handleClose,
}: TaskCostMultiplierModalProps) => {
  const [checkedMultipliers, setCheckedMultipliers] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const checkedMultipliers: { [key: string]: boolean } = {};
    if (currentlySelectedMultipliers) {
      currentlySelectedMultipliers.forEach((multiplier) => {
        checkedMultipliers[multiplier.id] = true;
      });
    }
    setCheckedMultipliers(checkedMultipliers);
  }, [currentlySelectedMultipliers]);

  const handleCheckboxChange = (multiplier: Multiplier) => {
    setCheckedMultipliers((prev) => ({
      ...prev,
      [multiplier.id]: !prev[multiplier.id],
    }));
  };

  const handleSubmit = () => {
    const selectedMultipliers = multipliers.filter(
      (multiplier) => checkedMultipliers[multiplier.id]
    );
    setCurrentlySelectedMultipliers(selectedMultipliers);
    handleClose();
  };

  const handleCancel = () => {
    setCheckedMultipliers({});
    setCurrentlySelectedMultipliers([]);
    handleClose();
  };

  return (
    <div className="bg-white p-4 rounded border border-black">
      <h2 className="mb-4 font-bold text-center">Calcul des coûts</h2>

      <div className="mb-4">
        {multipliers.map((multiplier) => (
          <div
            key={multiplier.id}
            className="flex items-center justify-between h-10"
          >
            <span className="text-gray-500 w-8">({multiplier.id})</span>
            <label htmlFor={multiplier.id} className="flex-1 mx-2">
              {multiplier.name} ({multiplier.value})
            </label>
            <input
              type="checkbox"
              id={multiplier.id}
              name={multiplier.name}
              className="h-4 w-4"
              checked={checkedMultipliers[multiplier.id] || false}
              onChange={() => handleCheckboxChange(multiplier)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <button className="p-2 rounded border border-gray-300 hover:bg-gray-100">
          +
        </button>
      </div>

      <div className="flex justify-between mt-2">
        <button
          className="text-rose-500 py-1 px-3 hover:underline"
          onClick={handleCancel}
        >
          Annuler
        </button>
        <button
          className="bg-mainBackgroundColor text-white py-1 px-4 rounded hover:opacity-90"
          onClick={handleSubmit}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default TaskCostMultiplierModal;
