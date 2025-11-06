import Step1WorkTypeSelection from "../wizard/Step1WorkTypeSelection";
import { useState } from "react";

export default function Step1WorkTypeSelectionExample() {
  const [selected, setSelected] = useState("");

  return (
    <div className="p-6">
      <Step1WorkTypeSelection selectedType={selected} onSelect={setSelected} />
    </div>
  );
}
