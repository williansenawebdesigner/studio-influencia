
import React from 'react';
import { EditIcon, DownloadIcon, NewImageIcon } from './Icons';

interface MobileModalProps {
  imageSrc: string;
  onEdit: () => void;
  onDownload: () => void;
  onNewImage: () => void;
}

const MobileModal: React.FC<MobileModalProps> = ({ imageSrc, onEdit, onDownload, onNewImage }) => {
  return (
    <div id="mobileModal" className="mobile-modal fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4 animate-fade-in md:hidden">
      <div className="modal-content w-full h-full flex flex-col">
        <div className="flex-grow flex items-center justify-center min-h-0">
            <img id="modalImage" src={imageSrc} alt="Generated art" className="modal-image max-w-full max-h-full object-contain rounded-lg" />
        </div>
        <div id="modal-actions" className="modal-actions flex justify-around items-center p-4 mt-4 bg-gray-800 rounded-xl">
          <button className="modal-btn edit flex flex-col items-center text-gray-300 hover:text-lime-400 transition" onClick={onEdit}>
            <EditIcon />
            <span className="text-xs mt-1">Editar</span>
          </button>
          <button className="modal-btn download flex flex-col items-center text-gray-300 hover:text-lime-400 transition" onClick={onDownload}>
            <DownloadIcon />
            <span className="text-xs mt-1">Salvar</span>
          </button>
          <button className="modal-btn new flex flex-col items-center text-gray-300 hover:text-lime-400 transition" onClick={onNewImage}>
            <NewImageIcon />
            <span className="text-xs mt-1">Nova Imagem</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileModal;
