import React from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface DisciplineSelectorProps {
  discipline: string;
  onChange: (discipline: string) => void;
}

const disciplines = [
  { value: "1", label: "Architecture extérieur" },
  { value: "2", label: "Architecture intérieur" },
  { value: "3", label: "Mécanique électrique" },
  { value: "4", label: "Civil/structure" },
  { value: "5", label: "Paysage" },
  { value: "6", label: "Autre" },
];

const DisciplineSelector: React.FC<DisciplineSelectorProps> = ({
  discipline,
  onChange,
}) => {
  return (
    <div className="flex w-full mb-4 text-black">
      <FormControl>
        <RadioGroup
          aria-label="discipline"
          name="discipline"
          value={discipline}
          onChange={(e) => onChange(e.target.value)}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.5rem",
          }}
        >
          {disciplines.map((d) => (
            <FormControlLabel
              key={d.value}
              value={d.value}
              control={<Radio size="medium" />}
              label={<span style={{ fontSize: "12px" }}>{d.label}</span>}
              className="-my-2 w-[10rem]"
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};
export default DisciplineSelector;
