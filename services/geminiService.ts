import { GoogleGenAI, Modality, Part } from "@google/genai";
import { AspectRatio } from "../App";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function getMimeType(base64: string): string {
    const signature = base64.substring(0, 20);
    if (signature.includes('iVBORw0KGgo')) return 'image/png';
    if (signature.includes('/9j/')) return 'image/jpeg';
    if (signature.includes('RIFF') && signature.includes('WEBP')) return 'image/webp';
    return 'image/png'; // Default
}

function base64ToInlineData(base64: string): Part {
    const [header, data] = base64.split(',');
    if (!data) { // Handle case where base64 string might not have a header
        const mimeType = getMimeType(header);
        return { inlineData: { data: header, mimeType } };
    }
    const mimeType = header.match(/:(.*?);/)?.[1] || getMimeType(data);
    return {
        inlineData: {
            data,
            mimeType
        }
    };
}

export const translateText = async (text: string): Promise<string> => {
    if (!text) return "";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following Portuguese text to English, keeping the original meaning and tone: "${text}"`,
            config: {
                temperature: 0.2,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Gemini API Error (translateText):", error);
        throw new Error("Falha ao traduzir o texto.");
    }
};

export const generateInfluencer = async (
    prompt: string, 
    aspectRatio: AspectRatio, 
    negativePrompt: string
): Promise<string> => {
    try {
        let fullPrompt = `${prompt}, photorealistic, full body shot, high fashion, 8k, ultra-detailed`;
        if (negativePrompt && negativePrompt.trim() !== '') {
            // Append the negative prompt to the main prompt string
            fullPrompt += `. Negative prompt: ${negativePrompt}`;
        }

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: aspectRatio,
                // The negativePrompt parameter is not supported here and was removed.
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("Nenhum influencer foi gerado. Tente um prompt diferente.");
        }
    } catch (error) {
        console.error("Gemini API Error (generateInfluencer):", error);
        throw new Error("Falha ao gerar o influencer com a API.");
    }
};

export const composeImages = async (
    influencerImage: string,
    productImage: string,
    actionPrompt: string,
    scenarioPrompt?: string
): Promise<string> => {
    
    const influencerImagePart = base64ToInlineData(influencerImage);
    const productImagePart = base64ToInlineData(productImage);
    
    let parts: Part[] = [influencerImagePart, productImagePart];
    
    let fullPrompt = `INSTRUCTION: Your task is to perform a realistic "in-painting" operation.
    
    GOAL: Edit the first image (the person) to make them wear or use the product from the second image, as described by the action prompt.
    
    ACTION PROMPT: "${actionPrompt}"
    
    RULES:
    1.  **REPLACE CLOTHING:** You MUST replace the existing clothing on the person with the product. Do NOT overlay the new product on top of old clothes. The final image should show only the new product.
    2.  **PRESERVE IDENTITY:** It is absolutely crucial to maintain the person's original face, hair, body shape, and skin tone. Do not change the person.
    3.  **REALISM:** The final composition must be photorealistic. Pay close attention to lighting, shadows, and textures to ensure the product looks natural on the person.`;
    
    if (scenarioPrompt) {
        fullPrompt += `
    4.  **CHANGE BACKGROUND:** After placing the product, you must change the entire background to a new scene: "${scenarioPrompt}". The lighting on the person must match the new background.`;
    } else {
        fullPrompt += `
    4.  **MAINTAIN BACKGROUND:** Keep the original background from the first image. Ensure lighting on the new product matches this existing background.`;
    }

    parts.push({ text: fullPrompt });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: parts,
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            const base64ImageBytes = imagePart.inlineData.data;
            const mimeType = imagePart.inlineData.mimeType;
            return `data:${mimeType};base64,${base64ImageBytes}`;
        } else {
            const textResponse = response.text?.trim();
            if (textResponse) {
                throw new Error(`A API retornou um texto em vez de uma imagem: "${textResponse}"`);
            }
            throw new Error("A composição não produziu uma imagem. Tente novamente com um prompt diferente.");
        }
    } catch (error) {
        console.error("Gemini API Error (composeImages):", error);
        throw error instanceof Error ? error : new Error("Falha ao mesclar as imagens com a API.");
    }
};