import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { createPortal } from "react-dom";

export default function PopUpModal ({ closingModal }) {
  const modalRef = useRef();
  const navigate = useNavigate();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      closingModal();
    }
  };

  const modalContent = (
    <div ref={modalRef} className="modal-overlay" onClick={closeModal}>
      <div className="modal-content">
        <button className="close-btn" onClick={closingModal}>
          <img src="/img/close.svg" alt="Close" width="24" height="24" className="bg-gray-500" />
        </button>

        <h1 className="modal-title">Ver más</h1>
        <p className="modal-text">Inicia sesión o regístrate para tener acceso.</p>
        <div className="flex flex-col gap-4 w-full">

        <button onClick={()=>{navigate("/login")}} className="download-btn" id="log">
          Iniciar sesión
        </button>
        
        <button onClick={()=>{navigate("/signup")}} className="download-btn " id="sign">
          Registrarse
        </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>
        <p onClick={closingModal} className="text-link">
          Continuar como invitado
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
