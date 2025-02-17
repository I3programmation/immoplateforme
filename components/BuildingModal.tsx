import React, { useState, useRef, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (buildingData: {
    buildingName: string;
    buildingGroup: string;
    subgroup: string;
  }) => void;
}

const BuildingModal: React.FC<BuildingModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [buildingData, setBuildingData] = useState({
    buildingName: "",
    buildingGroup: "",
    subgroup: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuildingData({ ...buildingData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(buildingData);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Nom du bâtiment"
          name="buildingName"
          value={buildingData.buildingName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Groupe du bâtiment"
          name="buildingGroup"
          value={buildingData.buildingGroup}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Sous-groupe"
          name="subgroup"
          value={buildingData.subgroup}
          onChange={handleChange}
          fullWidth
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSave} color="primary">
            Enregistrer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BuildingModal;
