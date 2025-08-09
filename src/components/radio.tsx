import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

type props = {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

const Radio = ({ options, onChange }: props) => {
  return (
    <RadioGroup onValueChange={onChange}>
      {options.map(({ value, label }, index) => (
        <div className="flex items-center gap-3" key={index}>
          <RadioGroupItem value={value} />
          <Label>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default Radio;
