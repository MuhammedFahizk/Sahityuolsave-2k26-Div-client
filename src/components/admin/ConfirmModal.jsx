export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center
      justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center
          justify-center mb-4">
          <span className="text-red-500 text-lg">!</span>
        </div>
        <h3 className="text-[14px] font-medium text-gray-800 mb-1">
          Are you sure?
        </h3>
        <p className="text-[12px] text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-gray-200
              text-[12px] text-gray-500 hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-red-500 text-white
              text-[12px] hover:bg-red-600 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}