"use client";
import { Multiplier, MultiplierFormData } from "@/types/types";
import { Popover } from "@mui/material";
import { useEffect, useState } from "react";
import MultiplierModal from "./MultiplierModal";
import { Pen } from "lucide-react";

interface TaskCostMultiplierModalProps {
  multipliers: Multiplier[];
  currentlySelectedMultipliers?: Multiplier[];
  isCummulative?: boolean;
  setIsCummulative: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentlySelectedMultipliers: React.Dispatch<
    React.SetStateAction<Multiplier[]>
  >;
  setMultipliers: React.Dispatch<React.SetStateAction<Multiplier[]>>;
  handleClose: () => void;
}

const TaskCostMultiplierModal = ({
  multipliers,
  currentlySelectedMultipliers,
  isCummulative,
  setIsCummulative,
  setCurrentlySelectedMultipliers,
  setMultipliers,
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
  const [isCreateMultiplierOpen, setIsCreateMultiplierOpen] = useState(false);
  const [existingMultiplierFormData, setExistingMultiplierFormData] =
    useState<MultiplierFormData | null>(null);

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

  const handleCreateMultiplier = async (
    multiplierFormData: MultiplierFormData
  ) => {
    try {
      const response = await fetch("/api/multipliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(multiplierFormData),
      });
      if (!response.ok) {
        throw new Error("Erreur de création du multiplicateur");
      }
      const data = await response.json();
      setMultipliers((prev) => [...prev, data]);
      setCheckedMultipliers((prev) => ({
        ...prev,
        [data.id]: true,
      }));
    } catch (error) {
      console.error("Erreur de création du multiplicateur:", error);
    }
  };

  const handleModifyMultiplier = async (
    multiplierFormData: MultiplierFormData
  ) => {
    try {
      const response = await fetch(
        `/api/multipliers/${existingMultiplierFormData?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(multiplierFormData),
        }
      );
      if (!response.ok) {
        throw new Error("Erreur de modification du multiplicateur");
      }
      const newMultiplier = await response.json();

      const allMultipliers = await fetch("/api/multipliers");
      if (!allMultipliers.ok) {
        throw new Error("Erreur de récupération des multiplicateurs");
      }
      const data = await allMultipliers.json();
      setMultipliers(data);
      setCheckedMultipliers((prev) => ({
        ...prev,
        [newMultiplier.id]: true,
      }));
      setExistingMultiplierFormData(null);
    } catch (error) {
      console.error("Erreur de modification du multiplicateur:", error);
    }
  };

  const handleDeleteMultiplier = async (multiplierId: string) => {
    try {
      const response = await fetch(`/api/multipliers/${multiplierId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Erreur de suppression du multiplicateur");
      }
      setMultipliers((prev) =>
        prev.filter((multiplier) => multiplier.id !== multiplierId)
      );
    } catch (error) {
      console.error("Erreur de suppression du multiplicateur:", error);
    }
  };

  return (
    <div className="bg-accent text-primary p-4 rounded relative">
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
        slotProps={{
          paper: {
            style: {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <div className="p-4 rounded shadow-md bg-accent text-primary ">
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
          <div key={multiplier.id} className="flex items-center  h-10">
            <span className="text-gray-500 w-8">({multiplier.order})</span>
            <div className="flex-1 flex gap-2 mx-2">
              <Pen
                onClick={() => setExistingMultiplierFormData(multiplier)}
                className="mr-auto cursor-pointer hover:text-blue-500"
              />
              <label htmlFor={multiplier.id} className="cursor-pointer">
                <span>{multiplier.name}</span>
                <span className="text-gray-500"> ({multiplier.value})</span>
              </label>
            </div>

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

        {existingMultiplierFormData && (
          <MultiplierModal
            onClose={() => setExistingMultiplierFormData(null)}
            onAction={handleModifyMultiplier}
            onDelete={handleDeleteMultiplier}
            existingMultiplierFormData={existingMultiplierFormData}
            isModifying={true}
          />
        )}
      </div>

      <div className="flex justify-center mb-4">
        <button
          className="p-2 rounded border border-gray-300 hover:opacity-40 w-full"
          onClick={() => setIsCreateMultiplierOpen(true)}
        >
          +
        </button>
        {isCreateMultiplierOpen && (
          <MultiplierModal
            onClose={() => setIsCreateMultiplierOpen(false)}
            onAction={handleCreateMultiplier}
          />
        )}
      </div>

      <div className="flex justify-between mt-2">
        <button
          className="text-rose-500 py-1 px-3 hover:underline"
          onClick={handleClear}
        >
          Rénitialiser
        </button>
        <button
          className="bg-background text-primary py-1 px-4 rounded hover:opacity-40"
          onClick={handleSubmit}
        >
          Appliquer
        </button>
      </div>
    </div>
  );
};

export default TaskCostMultiplierModal;
