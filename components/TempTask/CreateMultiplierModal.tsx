import { MultiplierFormData } from "@/types/types";
import { useState } from "react";

interface CreateMultiplierModalProps {
  onClose: () => void;
  onCreate: (multiplierFormData: MultiplierFormData) => void;
}

const CreateMultiplierModal: React.FC<CreateMultiplierModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [multiplierFormData, setMultiplierFormData] =
    useState<MultiplierFormData>({
      name: "",
      value: 0,
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMultiplierFormData((prev) => ({
      ...prev,
      [name]: name === "value" ? parseFloat(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md text-white">
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="p-4 bg-white rounded shadow-md">
          <h2 className="mb-4 font-bold text-center">
            Créer un multiplicateur
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onCreate(multiplierFormData);
              onClose();
            }}
          >
            <input
              type="text"
              placeholder="Nom du multiplicateur"
              className="border border-gray-300 p-2 mb-4 w-full"
              value={multiplierFormData.name}
              onChange={handleChange}
              name="name"
            />
            <input
              type="number"
              placeholder="Valeur"
              className="border border-gray-300 p-2 mb-4 w-full"
              value={multiplierFormData.value}
              onChange={handleChange}
              name="value"
            />
            <button
              className="bg-blue-500 text-white py-1 px-4 rounded hover:opacity-90"
              type="submit"
            >
              Créer
            </button>
            <button
              className="text-rose-500 py-1 px-3 hover:underline"
              onClick={onClose}
            >
              Annuler
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMultiplierModal;
