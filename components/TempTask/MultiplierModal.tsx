import { MultiplierFormData } from "@/types/types";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface MultiplierModalProps {
  onClose: () => void;
  onAction: (multiplierFormData: MultiplierFormData) => void;
  onDelete?: (multiplierId: string) => void;
  isModifying?: boolean;
  existingMultiplierFormData?: MultiplierFormData | null;
}

const MultiplierModal: React.FC<MultiplierModalProps> = ({
  onClose,
  onAction,
  onDelete,
  isModifying = false,
  existingMultiplierFormData,
}) => {
  const [multiplierFormData, setMultiplierFormData] =
    useState<MultiplierFormData>({
      name: "",
      value: 0,
    });

  useEffect(() => {
    if (isModifying && existingMultiplierFormData) {
      setMultiplierFormData(existingMultiplierFormData);
    } else {
      setMultiplierFormData({
        name: "",
        value: 0,
      });
    }
  }, [existingMultiplierFormData, isModifying]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMultiplierFormData((prev) => ({
      ...prev,
      [name]:
        name === "value"
          ? parseFloat(value)
          : name === "order"
          ? parseInt(value)
          : value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md text-primary">
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="p-4 bg-accent rounded shadow-md">
          <h2 className="mb-4 font-bold text-center">
            {isModifying ? "Modifier" : "Créer"} un multiplicateur
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAction(multiplierFormData);
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
            {isModifying && (
              <>
                <input
                  type="hidden"
                  name="multiplierId"
                  value={multiplierFormData.id}
                />
                <input
                  type="number"
                  placeholder="Ordre du multiplicateur"
                  className="border border-gray-300 p-2 mb-4 w-full"
                  value={multiplierFormData.order}
                  onChange={handleChange}
                  name="order"
                />
                <button
                  className="text-rose-500 py-1 px-3 hover:underline mb-4"
                  onClick={() => {
                    if (multiplierFormData.id && onDelete) {
                      onDelete(multiplierFormData.id);
                      onClose();
                    }
                  }}
                >
                  <Trash />
                </button>
              </>
            )}
            <button
              className="bg-blue-500 text-white py-1 px-4 rounded hover:opacity-90"
              type="submit"
            >
              {isModifying ? "Modifier" : "Créer"}
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

export default MultiplierModal;
