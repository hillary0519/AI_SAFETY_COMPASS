import PermitInputForm from "../PermitInputForm";

export default function PermitInputFormExample() {
  return (
    <div className="p-6 max-w-2xl">
      <PermitInputForm
        onSubmit={(data) => console.log("Form submitted:", data)}
        isLoading={false}
      />
    </div>
  );
}
