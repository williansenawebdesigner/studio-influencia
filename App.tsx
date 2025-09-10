import React, { useState, useCallback } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import MobileModal from './components/MobileModal';
import { generateInfluencer, composeImages, translateText } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

export type AspectRatio = '9:16' | '1:1' | '16:9';

export default function App() {
  const [influencerChoice, setInfluencerChoice] = useState<'generate' | 'upload'>('generate');
  const [influencerPrompt, setInfluencerPrompt] = useState<string>('Uma modelo brasileira, 25 anos, cabelos castanhos, sorrindo, em um fundo neutro de estúdio');
  const [negativePrompt, setNegativePrompt] = useState<string>('mãos deformadas, texto, marca d\'água, feio, duplicado, dentes ruins');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [influencerImage, setInfluencerImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [actionPrompt, setActionPrompt] = useState<string>('vestindo esta camiseta');
  const [changeScenario, setChangeScenario] = useState<boolean>(false);
  const [scenarioPrompt, setScenarioPrompt] = useState<string>('em uma cafeteria moderna em São Paulo');

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [needsApproval, setNeedsApproval] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);

  const handlePrimaryAction = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setNeedsApproval(false);

    // Stage 1: Generate Influencer for approval
    if (influencerChoice === 'generate' && !influencerImage) {
      try {
        if (!influencerPrompt) {
          throw new Error('Por favor, descreva o influencer que você quer gerar.');
        }
        setLoadingStep('Gerando seu influencer...');
        const baseInfluencerImage = await generateInfluencer(influencerPrompt, aspectRatio, negativePrompt);
        setGeneratedImage(baseInfluencerImage);
        setNeedsApproval(true);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      } finally {
        setIsLoading(false);
        setLoadingStep('');
      }
      return;
    }

    // Stage 2: Compose the scene with the approved/uploaded influencer
    try {
      if (!influencerImage) {
        throw new Error('Por favor, forneça uma imagem do influencer.');
      }
      if (!productImage) {
        throw new Error('Por favor, envie uma imagem do produto.');
      }
      if (!actionPrompt) {
        throw new Error('Por favor, descreva como o influencer deve usar o produto.');
      }
      
      setLoadingStep('Criando a cena com seu produto...');
      const finalImage = await composeImages(
        influencerImage,
        productImage,
        actionPrompt,
        changeScenario ? scenarioPrompt : undefined
      );
      setGeneratedImage(finalImage);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  }, [
    influencerChoice, 
    influencerPrompt, 
    influencerImage, 
    productImage, 
    actionPrompt, 
    changeScenario, 
    scenarioPrompt,
    aspectRatio,
    negativePrompt
  ]);

  const handleApproveInfluencer = () => {
    if (generatedImage) {
      setInfluencerImage(generatedImage);
      setGeneratedImage(null);
      setNeedsApproval(false);
    }
  };

  const handleRegenerateInfluencer = () => {
    setGeneratedImage(null);
    handlePrimaryAction();
  };

  const handleImageUpload = async (file: File, imageSetter: React.Dispatch<React.SetStateAction<string | null>>) => {
    try {
        const base64 = await fileToBase64(file);
        imageSetter(base64 as string);
    } catch (err) {
        setError('Falha ao carregar a imagem.');
    }
  };
  
  const handleTranslatePrompts = async () => {
      if (!actionPrompt && !scenarioPrompt) return;

      setIsTranslating(true);
      setError(null);
      try {
          const translatedAction = await translateText(actionPrompt);
          setActionPrompt(translatedAction);

          if (changeScenario && scenarioPrompt) {
              const translatedScenario = await translateText(scenarioPrompt);
              setScenarioPrompt(translatedScenario);
          }
      } catch (err) {
          setError(err instanceof Error ? err.message : 'Ocorreu um erro na tradução.');
      } finally {
          setIsTranslating(false);
      }
  };

  const editCurrentImage = () => {
    if (generatedImage) {
        setInfluencerChoice('upload');
        setInfluencerImage(generatedImage);
        setGeneratedImage(null);
        setNeedsApproval(false);
    }
  };

  const resetState = () => {
    setInfluencerChoice('generate');
    setInfluencerImage(null);
    setProductImage(null);
    setGeneratedImage(null);
    setShowMobileModal(false);
    setNeedsApproval(false);
  };

  const resetInfluencer = () => {
      setInfluencerImage(null);
      setGeneratedImage(null);
      setNeedsApproval(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans bg-gray-900 text-gray-200">
      <LeftPanel
        influencerChoice={influencerChoice}
        setInfluencerChoice={(choice) => {
            setInfluencerChoice(choice);
            setInfluencerImage(null); // Reset image when switching mode
        }}
        influencerPrompt={influencerPrompt}
        setInfluencerPrompt={setInfluencerPrompt}
        negativePrompt={negativePrompt}
        setNegativePrompt={setNegativePrompt}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        influencerImage={influencerImage}
        productImage={productImage}
        setProductImage={setProductImage}
        actionPrompt={actionPrompt}
        setActionPrompt={setActionPrompt}
        changeScenario={changeScenario}
        setChangeScenario={setChangeScenario}
        scenarioPrompt={scenarioPrompt}
        setScenarioPrompt={setScenarioPrompt}
        handleGenerate={handlePrimaryAction}
        isLoading={isLoading}
        handleImageUpload={(file) => handleImageUpload(file, setInfluencerImage)}
        handleProductImageUpload={(file) => handleImageUpload(file, setProductImage)}
        resetInfluencer={resetInfluencer}
        handleTranslatePrompts={handleTranslatePrompts}
        isTranslating={isTranslating}
      />
      <RightPanel
        generatedImage={generatedImage}
        isLoading={isLoading}
        loadingText={loadingStep || 'Gerando sua imagem...'}
        editCurrentImage={editCurrentImage}
        error={error}
        onImageClick={() => generatedImage && !needsApproval && setShowMobileModal(true)}
        needsApproval={needsApproval}
        onApprove={handleApproveInfluencer}
        onRegenerate={handleRegenerateInfluencer}
      />
      {showMobileModal && generatedImage && (
        <MobileModal
          imageSrc={generatedImage}
          onEdit={() => {
            editCurrentImage();
            setShowMobileModal(false);
          }}
          onDownload={() => {
             const link = document.createElement('a');
             link.href = generatedImage;
             link.download = 'influencia-studio-image.png';
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
          }}
          onNewImage={resetState}
        />
      )}
    </div>
  );
}