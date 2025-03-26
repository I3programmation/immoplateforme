import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import PrioritySelector from "@/components/Priority";
import DisciplineSelector from "@/components/Discipline";
import TextField from "@mui/material/TextField";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ImCopy } from "react-icons/im";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { TaskFormData, Building, Column } from "../types/types";
import TrashIcons from "@/components/icons/TrashIcons";
import { PiPaperclipHorizontalThin } from "react-icons/pi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskFormData) => void;
  onRemove: (id: string) => void;
  task: TaskFormData | null;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onRemove,
  task,
}) => {
  const [buildings, setBuildings] = useState<Building[]>([]);

  const initialBuildingState: Building = {
    id: "",
    buildingName: "",
    buildingGroup: "",
    subgroup: "",
  };

  const [selectedBuilding, setSelectedBuilding] =
    useState<Building>(initialBuildingState);

  const [isNewBuilding, setIsNewBuilding] = useState(false);

  const [taskFormData, setTaskFormData] = useState<TaskFormData>(
    task || {
      task: {
        id: "",
        content: "",
        priority: "1",
        price: "",
        discipline: "",
        description: "",
        columnId: "",
        tags: [],
      },
      column: {
        id: "",
        title: "",
        year: "2025",
        buildingId: "",
      },
      building: {
        id: "",
        buildingName: "",
        buildingGroup: "",
        subgroup: "",
      },
    }
  );

  // 📌 Charger les bâtiments existants lors de l'ouverture du modal
  useEffect(() => {
    if (isOpen) {
      fetch("/api/buildings")
        .then((res) => res.json())
        .then((data) => setBuildings(data))
        .catch((err) => console.error("Erreur récupération bâtiments:", err));
    }
  }, [isOpen]);

  // 📌 Charger les colonnes lorsque l'immeuble change ou si l'année change
  useEffect(() => {
    if (taskFormData.building.id) {
      fetch(`/api/columns?buildingId=${taskFormData.building.id}`)
        .then((res) => res.json())
        .then((columns: Column[]) => {
          const selectedColumn = columns.find(
            (col) => col.year === taskFormData.column.year
          );
          if (selectedColumn) {
            setTaskFormData((prev) => ({
              ...prev,
              column: { ...selectedColumn },
            }));
          }
        })
        .catch((err) => console.error("Erreur récupération colonnes:", err));
    }
  }, [taskFormData.building.id, taskFormData.column.year]);

  // 📌 Enregistrement
  const handleSave = () => {
    onSave(taskFormData);
    onClose();
  };

  // 📌 Suppression
  const handleRemove = () => {
    if (taskFormData.task.id) {
      onRemove(taskFormData.task.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center gap-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-4 rounded shadow-lg w-auto modal-content gap-5 h-[600px] overflow-y-auto">
        <div className="flex gap-4 mb-4 mt-5">
          <TextField
            sx={{ width: "55%" }}
            value={taskFormData.task.content}
            onChange={(e) =>
              setTaskFormData((prev) => ({
                ...prev,
                task: { ...prev.task, content: e.target.value },
              }))
            }
            label="Titre"
          />
          <PrioritySelector
            priority={taskFormData.task.priority}
            onChange={(priority) =>
              setTaskFormData((prev) => ({
                ...prev,
                task: { ...prev.task, priority },
              }))
            }
          />
          <Box sx={{ minWidth: 130, width: "30%" }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Année de réalisation</InputLabel>
              <Select
                value={taskFormData.column.year}
                onChange={(e) =>
                  setTaskFormData((prev) => ({
                    ...prev,
                    column: { ...prev.column, year: e.target.value },
                  }))
                }
                label="Année de réalisation"
              >
                {["2025", "2026", "2027", "2028", "2029"].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            sx={{ width: "30%" }}
            value={taskFormData.task.price}
            onChange={(e) =>
              setTaskFormData((prev) => ({
                ...prev,
                task: {
                  ...prev.task,
                  price: e.target.value === "" ? "" : e.target.value,
                },
              }))
            }
            label="Prix"
          />
        </div>

        {/* Sélection du bâtiment */}
        <div className="flex flex-col h-[200px]">
          <div className="flex w-full">
            <FormControl
              sx={{
                width: "50%",
                marginBottom: "0.5rem",
              }}
            >
              <InputLabel>Bâtiment</InputLabel>
              <Select
                value={isNewBuilding ? "new" : taskFormData.building.id}
                onChange={(e) => {
                  if (e.target.value === "new") {
                    setIsNewBuilding(true);
                    setSelectedBuilding(initialBuildingState);
                    setTaskFormData((prev) => ({
                      ...prev,
                      building: {
                        id: "",
                        buildingName: "",
                        buildingGroup: "",
                        subgroup: "",
                      },
                    }));
                  } else {
                    setIsNewBuilding(false);
                    const selectedBuilding = buildings.find(
                      (b) => b.id === e.target.value
                    );
                    if (selectedBuilding) {
                      setSelectedBuilding(selectedBuilding);
                      setTaskFormData((prev) => ({
                        ...prev,
                        building: selectedBuilding,
                        column: {
                          ...prev.column,
                          buildingId: selectedBuilding.id,
                        },
                      }));
                    }
                  }
                }}
                label="Bâtiment"
              >
                {buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.buildingName}
                  </MenuItem>
                ))}
                <MenuItem value="new">➕ Ajouter un nouveau bâtiment</MenuItem>
              </Select>
            </FormControl>
            <PiPaperclipHorizontalThin
              size={40}
              style={{ transform: "rotate(90deg)" }}
              className="ml-auto"
              color="gray"
            />
          </div>
          {/* Si "Ajouter un bâtiment" est sélectionné, afficher les champs */}
          {isNewBuilding ? (
            <div className="flex flex-col gap-2 w-[50%] mb-4 ">
              <TextField
                label="Nom du bâtiment"
                value={taskFormData.building.buildingName}
                onChange={(e) =>
                  setTaskFormData((prev) => ({
                    ...prev,
                    building: {
                      ...prev.building,
                      buildingName: e.target.value,
                    },
                  }))
                }
              />
              <div className="flex gap-2 text-black">
                <TextField
                  label="Groupe"
                  value={taskFormData.building.buildingGroup}
                  onChange={(e) =>
                    setTaskFormData((prev) => ({
                      ...prev,
                      building: {
                        ...prev.building,
                        buildingGroup: e.target.value,
                      },
                    }))
                  }
                />
                <TextField
                  label="Sous-groupe"
                  value={taskFormData.building.subgroup}
                  onChange={(e) =>
                    setTaskFormData((prev) => ({
                      ...prev,
                      building: {
                        ...prev.building,
                        subgroup: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          ) : (
            <div className="text-black">
              <h2 className="text-xl font-medium">
                {selectedBuilding.buildingGroup}
              </h2>
              <h4 className="text-sm font-light">
                {selectedBuilding.subgroup}
              </h4>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-end">
          <DisciplineSelector
            discipline={taskFormData.task.discipline}
            onChange={(discipline) =>
              setTaskFormData((prev) => ({
                ...prev,
                task: { ...prev.task, discipline },
              }))
            }
          />

          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": {
                width: "80%",
                paddingRight: "5px",
              },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={2}
                value={taskFormData.task.description}
                onChange={(e) =>
                  setTaskFormData((prev) => ({
                    ...prev,
                    task: { ...prev.task, description: e.target.value },
                  }))
                }
                className="border p-2 w-[80%]"
              />
            </div>
          </Box>

          <TextField
            type="text"
            value={taskFormData.task.tags.join(",")}
            onChange={(e) =>
              setTaskFormData((prev) => ({
                ...prev,
                task: { ...prev.task, tags: e.target.value.split(",") },
              }))
            }
            className="border p-2 w-[79.5%]"
            label="#tags"
          />

          <div className="flex justify-end mt-4">
            <ImCopy size={40} className="mr-auto" color="black" />
            <button onClick={onClose} className="mr-2 p-2 bg-gray-300 rounded">
              ANNULER
            </button>
            <button
              onClick={handleSave}
              className="p-2 bg-blue-500 text-white rounded"
            >
              OK
            </button>

            <div className="ml-20" onClick={handleRemove}>
              <TrashIcons className="size-8" stroke="black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
