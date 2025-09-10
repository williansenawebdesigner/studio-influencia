import React from 'react';
import { EditIcon, DownloadIcon, ImageIcon, CheckIcon, RedoIcon } from './Icons';

interface RightPanelProps {
  generatedImage: string | null;
  isLoading: boolean;
  loadingText: string;
  editCurrentImage: () => void;
  error: string | null;
  onImageClick: () => void;
  needsApproval: boolean;
  onApprove: () => void;
  onRegenerate: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ 
  generatedImage, 
  isLoading, 
  loadingText, 
  editCurrentImage, 
  error, 
  onImageClick,
  needsApproval,
  onApprove,
  onRegenerate
}) => {
  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'influencia-studio-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const ActionButton: React.FC<{onClick: () => void; title: string; children: React.ReactNode}> = ({ onClick, title, children }) => (
    <button
      className="action-btn bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition duration-200 backdrop-blur-sm"
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="right-panel flex-grow bg-gray-800/50 flex items-center justify-center p-4 md:p-8 relative w-full md:flex-1">
      {isLoading && (
        <div id="loadingContainer" className="loading-container text-center">
          <div className="loading-spinner w-16 h-16 border-8 border-t-lime-500 border-r-lime-500 border-b-lime-500 border-l-gray-700 rounded-full animate-spin mx-auto"></div>
          <div className="loading-text mt-4 text-lg text-gray-300">{loadingText}</div>
        </div>
      )}

      {!isLoading && !generatedImage && (
        <div id="resultPlaceholder" className="result-placeholder text-center text-gray-500">
          <div className="result-placeholder-icon mx-auto mb-4">
            <ImageIcon />
          </div>
          <div>Sua obra de arte aparecerá aqui</div>
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center text-red-400 p-4 bg-red-900/50 rounded-lg max-w-md">
            <h3 className="font-bold mb-2">Erro na Geração</h3>
            <p>{error}</p>
        </div>
      )}

      {!isLoading && generatedImage && (
        <div id="imageContainer" className="image-container relative group animate-fade-in w-full h-full flex items-center justify-center">
          <img
            id="generatedImage"
            src={generatedImage}
            alt="Generated art"
            className={`generated-image max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50 ${!needsApproval ? 'cursor-pointer' : ''}`}
            onClick={!needsApproval ? onImageClick : undefined}
          />
          <div className="image-actions absolute top-4 right-4 flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:flex">
             {needsApproval ? (
              <>
                <ActionButton onClick={onApprove} title="Aprovar e Continuar">
                  <CheckIcon />
                </ActionButton>
                <ActionButton onClick={onRegenerate} title="Gerar Novamente">
                  <RedoIcon />
                </ActionButton>
              </>
            ) : (
              <>
                <ActionButton onClick={editCurrentImage} title="Editar">
                  <EditIcon />
                </ActionButton>
                <ActionButton onClick={downloadImage} title="Download">
                  <DownloadIcon />
                </ActionButton>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;