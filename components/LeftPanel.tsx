import React from 'react';
import UploadArea from './UploadArea';
import { CloseIcon, TranslateIcon, AspectRatioPortraitIcon, AspectRatioSquareIcon, AspectRatioLandscapeIcon } from './Icons';
import { AspectRatio } from '../App';

interface LeftPanelProps {
  influencerChoice: 'generate' | 'upload';
  setInfluencerChoice: React.Dispatch<React.SetStateAction<'generate' | 'upload'>>;
  influencerPrompt: string;
  setInfluencerPrompt: React.Dispatch<React.SetStateAction<string>>;
  negativePrompt: string;
  setNegativePrompt: React.Dispatch<React.SetStateAction<string>>;
  aspectRatio: AspectRatio;
  setAspectRatio: React.Dispatch<React.SetStateAction<AspectRatio>>;
  influencerImage: string | null;
  productImage: string | null;
  setProductImage: React.Dispatch<React.SetStateAction<string | null>>;
  actionPrompt: string;
  setActionPrompt: React.Dispatch<React.SetStateAction<string>>;
  changeScenario: boolean;
  setChangeScenario: React.Dispatch<React.SetStateAction<boolean>>;
  scenarioPrompt: string;
  setScenarioPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleGenerate: () => void;
  isLoading: boolean;
  handleImageUpload: (file: File) => void;
  handleProductImageUpload: (file: File) => void;
  resetInfluencer: () => void;
  handleTranslatePrompts: () => void;
  isTranslating: boolean;
}

const Section: React.FC<{ step: number; title: React.ReactNode; children: React.ReactNode }> = ({ step, title, children }) => (
  <div>
    <h2 className="text-lg font-semibold text-lime-400 mb-3 flex items-center">
      <span className="bg-lime-500 text-gray-900 rounded-full w-7 h-7 inline-flex items-center justify-center mr-2 flex-shrink-0">{step}</span>
      {title}
    </h2>
    <div className="pl-9 space-y-4">{children}</div>
  </div>
);


const LeftPanel: React.FC<LeftPanelProps> = (props) => {
  const {
    influencerChoice, setInfluencerChoice,
    influencerPrompt, setInfluencerPrompt,
    negativePrompt, setNegativePrompt,
    aspectRatio, setAspectRatio,
    influencerImage,
    productImage, setProductImage,
    actionPrompt, setActionPrompt,
    changeScenario, setChangeScenario,
    scenarioPrompt, setScenarioPrompt,
    handleGenerate, isLoading, handleImageUpload, handleProductImageUpload,
    resetInfluencer, handleTranslatePrompts, isTranslating
  } = props;

  const isComposeStepDisabled = influencerChoice === 'generate' && !influencerImage;

  const AspectRatioButton: React.FC<{ value: AspectRatio; children: React.ReactNode; }> = ({ value, children }) => (
    <button
      onClick={() => setAspectRatio(value)}
      title={value}
      className={`p-2 rounded-md transition duration-200 ${aspectRatio === value ? 'bg-lime-500/20 text-lime-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="left-panel w-full md:w-[400px] bg-gray-900 border-r border-gray-700/50 p-6 flex flex-col space-y-6 overflow-y-auto">
      <header>
        <h1 className="panel-title text-2xl font-bold text-white">Studio InfluencIA</h1>
        <p className="panel-subtitle text-sm text-gray-400">Crie seu influencer para seus produtos</p>
      </header>

      <div className="flex-grow space-y-6">
        <Section step={1} title="Escolha seu Influencer">
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`mode-btn font-semibold py-2 px-4 rounded-lg transition duration-200 ${influencerChoice === 'generate' ? 'bg-lime-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setInfluencerChoice('generate')}
              disabled={!!influencerImage && influencerChoice === 'generate'}
            >
              Gerar com IA
            </button>
            <button
              className={`mode-btn font-semibold py-2 px-4 rounded-lg transition duration-200 ${influencerChoice === 'upload' ? 'bg-lime-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setInfluencerChoice('upload')}
            >
              Subir Foto
            </button>
          </div>
          {influencerChoice === 'generate' ? (
             influencerImage ? (
                <div className="relative group animate-fade-in">
                  <img src={influencerImage} alt="Influencer Aprovado" className="rounded-lg w-full h-auto object-cover" />
                  <button 
                    onClick={resetInfluencer} 
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
                    title="Alterar Influencer"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    className="prompt-input w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition duration-200 resize-none h-24"
                    placeholder="Descreva seu influencer..."
                    value={influencerPrompt}
                    onChange={(e) => setInfluencerPrompt(e.target.value)}
                    disabled={!!influencerImage}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Formato</label>
                    <div className="grid grid-cols-3 gap-2">
                        <AspectRatioButton value="9:16"><AspectRatioPortraitIcon/></AspectRatioButton>
                        <AspectRatioButton value="1:1"><AspectRatioSquareIcon/></AspectRatioButton>
                        <AspectRatioButton value="16:9"><AspectRatioLandscapeIcon/></AspectRatioButton>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-400 mb-2">Prompts Negativos</label>
                    <textarea
                      id="negativePrompt"
                      className="prompt-input w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition duration-200 resize-none h-20 text-sm"
                      placeholder="Ex: mãos deformadas, texto, marca d'água..."
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                    />
                  </div>
                </div>
              )
          ) : (
            <UploadArea
              id="influencerUpload"
              onImageUpload={handleImageUpload}
              previewSrc={influencerImage}
              mainText="Subir foto do influencer"
            />
          )}
        </Section>
        
        <div className={`transition-opacity duration-500 ${isComposeStepDisabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <div className="space-y-6">
            <Section step={2} title="Envie seu Produto">
              <UploadArea
                id="productUpload"
                onImageUpload={handleProductImageUpload}
                previewSrc={productImage}
                mainText="Subir foto do produto"
              />
              <p className="text-xs text-gray-500 text-center -mt-2">Dica: Imagens com fundo transparente (PNG) funcionam melhor!</p>
            </Section>
            
            <Section 
              step={3} 
              title={
                <div className="flex items-center justify-between w-full">
                    <span>Descreva a Cena</span>
                    <button
                        onClick={handleTranslatePrompts}
                        disabled={isTranslating || (!actionPrompt && !scenarioPrompt)}
                        className="p-1 text-gray-400 hover:text-lime-400 transition disabled:text-gray-600 disabled:cursor-not-allowed"
                        title="Traduzir prompts para Inglês (melhora os resultados)"
                    >
                        {isTranslating 
                            ? <div className="w-5 h-5 border-2 border-t-lime-500 border-l-transparent rounded-full animate-spin"></div> 
                            : <TranslateIcon />
                        }
                    </button>
                </div>
              }
            >
              <textarea
                  id="actionPrompt"
                  className="prompt-input w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition duration-200 resize-none h-24"
                  placeholder="Ex: vestindo esta camiseta preta..."
                  value={actionPrompt}
                  onChange={(e) => setActionPrompt(e.target.value)}
                />
                <label htmlFor="scenario-toggle" className="flex items-center cursor-pointer select-none">
                  <div className="relative">
                      <input 
                          type="checkbox" 
                          id="scenario-toggle" 
                          className="sr-only peer" 
                          checked={changeScenario} 
                          onChange={(e) => setChangeScenario(e.target.checked)}
                      />
                      <div className="w-14 h-8 bg-gray-700 rounded-full peer-checked:bg-lime-500 transition-colors"></div>
                      <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 peer-checked:translate-x-full"></div>
                  </div>
                  <span className="ml-3 text-gray-300 font-medium">Mudar Cenário</span>
                </label>
                {changeScenario && (
                  <textarea
                    id="scenarioPrompt"
                    className="prompt-input w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition duration-200 resize-none h-24 animate-fade-in"
                    placeholder="Ex: em uma praia no Rio de Janeiro..."
                    value={scenarioPrompt}
                    onChange={(e) => setScenarioPrompt(e.target.value)}
                  />
                )}
            </Section>
          </div>
        </div>
      </div>

      <button
        id="generateBtn"
        className="generate-btn mt-auto w-full bg-lime-500 text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-lime-600 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="spinner w-6 h-6 border-4 border-t-gray-900 border-r-gray-900 border-b-gray-900 border-l-white rounded-full animate-spin"></div>
        ) : (
          <span className="btn-text">
            {isComposeStepDisabled ? 'Gerar Influencer' : 'Gerar Imagem Final'}
          </span>
        )}
      </button>
    </div>
  );
};

export default LeftPanel;