import Step3SafetyCheck from "../wizard/Step3SafetyCheck";
import { useState } from "react";

export default function Step3SafetyCheckExample() {
  const [data, setData] = useState({
    requirements1: [] as string[],
    requirements2: [] as string[],
  });

  const handleToggle = (category: keyof typeof data, item: string) => {
    setData((prev) => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter((i) => i !== item)
        : [...prev[category], item],
    }));
  };

  return (
    <div className="p-6">
      <Step3SafetyCheck data={data} onToggle={handleToggle} />
    </div>
  );
}
