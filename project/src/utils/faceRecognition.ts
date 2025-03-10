import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;
  
  const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
  
  await Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
  ]);
  
  modelsLoaded = true;
}

export async function getFaceDescriptor(imageElement: HTMLImageElement): Promise<Float32Array | null> {
  try {
    const detection = await faceapi.detectSingleFace(imageElement)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    return detection ? new Float32Array(detection.descriptor) : null;
  } catch (error) {
    console.error('Error getting face descriptor:', error);
    return null;
  }
}

export function compareFaces(descriptor1: Float32Array, descriptor2: Float32Array): number {
  return faceapi.euclideanDistance(descriptor1, descriptor2);
}