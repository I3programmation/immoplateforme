"use client";
import { Multiplier } from "@/types/types";
import { Popover } from "@mui/material";
import { useEffect, useState } from "react";

interface TaskCostMultiplierModalProps {
  multipliers: Multiplier[];
  currentlySelectedMultipliers?: Multiplier[];
  isCummulative?: boolean;
  setIsCummulative: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentlySelectedMultipliers: React.Dispatch<
    React.SetStateAction<Multiplier[]>
  >;
  handleClose: () => void;
}

const TaskCostMultiplierModal = ({
  multipliers,
  currentlySelectedMultipliers,
  isCummulative,
  setIsCummulative,
  setCurrentlySelectedMultipliers,
  handleClose,
}: TaskCostMultiplierModalProps) => {
  const [checkedMultipliers, setCheckedMultipliers] = useState<{
    [key: string]: boolean;
  }>({});
  const [
    isChangeCostCalculationMethodOpen,
    setIsChangeCostCalculationMethodOpen,
  ] = useState(false);
  const [isCummulativeChecked, setIsCummulativeChecked] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const checkedMultipliers: { [key: string]: boolean } = {};
    if (currentlySelectedMultipliers) {
      currentlySelectedMultipliers.forEach((multiplier) => {
        checkedMultipliers[multiplier.id] = true;
      });
    }
    setCheckedMultipliers(checkedMultipliers);
  }, [currentlySelectedMultipliers]);

  useEffect(() => {
    if (isCummulative) {
      setIsCummulativeChecked(isCummulative);
    }
  }, [isCummulative]);

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
    handleClose();
  };

  const handleClear = () => {
    setCheckedMultipliers({});
    setCurrentlySelectedMultipliers([]);
  };

  const handleOpenChangeCostCalculationMethod = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
    setIsChangeCostCalculationMethodOpen(true);
  };

  const handleCloseChangeCostCalculationMethod = () => {
    setAnchorEl(null);
    setIsChangeCostCalculationMethodOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded border border-black relative">
      <button
        className="absolute top-3 right-3"
        onClick={handleCancel}
        aria-label="Close"
      >
        X
      </button>
      <button
        className="absolute top-3 left-3"
        aria-label="Close"
        onClick={handleOpenChangeCostCalculationMethod}
        title="Changer la méthode de calcul"
      >
        %
      </button>
      <Popover
        open={isChangeCostCalculationMethodOpen}
        onClose={handleCloseChangeCostCalculationMethod}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="p-4 bg-white rounded shadow-md">
          <h2 className="mb-4 font-bold text-center">Méthode de calcul</h2>
          <fieldset className="flex gap-4">
            <input
              type="radio"
              name="methodeCalcul"
              id="cummulatif"
              value="cummulatif"
              checked={isCummulativeChecked}
              onChange={() => {
                setIsCummulativeChecked(true);
                setIsCummulative(true);
              }}
            />
            <label htmlFor="">Cummulatif</label>
            <input
              type="radio"
              name="methodeCalcul"
              id="additif"
              value="additif"
              checked={!isCummulativeChecked}
              onChange={() => {
                setIsCummulativeChecked(false);
                setIsCummulative(false);
              }}
            />
            <label htmlFor="">Additif</label>
          </fieldset>
        </div>
      </Popover>

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
          onClick={handleClear}
        >
          Rénitialiser
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
