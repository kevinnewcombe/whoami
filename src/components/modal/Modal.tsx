import './modal.scss';
import { forwardRef, useImperativeHandle, useRef } from "react"
import { createPortal } from 'react-dom';

export interface DialogRef {
  open: () => void;
}

const Modal = forwardRef<DialogRef, { children: React.ReactNode }>(function ResultModal({ children }, ref) {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      return dialog.current?.showModal();
    }
  }));

  
  return createPortal(
    <dialog className="modal" ref={dialog}>
      {children}
      <form method="dialog">
        <button className="button--inverse">Close</button>
      </form>
    </dialog>,
    document.getElementById('modal')!
  );
});

export default Modal;
 
