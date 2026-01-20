import './Modal.css';

type ModalProps = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
};

export default function Modal({ isOpen, message, onConfirm }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <button className="modal-button" onClick={onConfirm}>
          확인
        </button>
      </div>
    </div>
  );
}
