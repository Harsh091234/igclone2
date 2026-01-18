import  { useState } from "react";

interface CustomGenderModalProps {
  onClose: () => void;
  onSave: (value: string) => void;
}

const CustomGenderModal = ({ onClose, onSave }: CustomGenderModalProps) => {
  const [customValue, setCustomValue] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[300px] shadow-lg space-y-4">
        <h2 className="text-lg font-semibold">Custom gender</h2>

        <input
          autoFocus
          type="text"
          className="w-full border border-neutral-300 p-2 rounded-md outline-none"
          placeholder="Enter gender"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-1 rounded-md border text-sm"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm"
            onClick={() => {
              if (!customValue.trim()) return;
              onSave(customValue.trim().toLowerCase());
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomGenderModal;
