import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, Upload, RefreshCw, CheckCircle2, AlertCircle, ArrowRight,
  Sparkles, Sliders, ShieldAlert, FileText, Pill, Eye
} from 'lucide-react';
import Tesseract from 'tesseract.js';
import { api } from '../services/api';
import { OcrCandidate, Medicine } from '../types';

// Sample medicine strip canvas generator for seamless offline demo testing
function generateSampleStrip(medicineName: string, strength: string, generic: string, mfg: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Metallic foil gradient background
  const grad = ctx.createLinearGradient(0, 0, 600, 340);
  grad.addColorStop(0, '#e2e8f0');
  grad.addColorStop(0.5, '#cbd5e1');
  grad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 340);

  // Blister packet grid dots
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let x = 20; x < 600; x += 40) {
    for (let y = 20; y < 340; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Printed text on medicine strip
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.fillText(medicineName.toUpperCase(), 40, 80);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText(`Strength: ${strength}`, 40, 125);

  ctx.fillStyle = '#334155';
  ctx.font = 'italic 20px Arial, sans-serif';
  ctx.fillText(`Composition: ${generic}`, 40, 165);

  ctx.font = '16px Arial, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(`Mfg. by: ${mfg}`, 40, 210);
  ctx.fillText(`Batch No: BT-${Math.floor(100000 + Math.random() * 900000)} | Exp: 12/2028`, 40, 240);
  ctx.fillText(`Dosage: As directed by the physician`, 40, 270);

  // Caution red box
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 290, 528, 35);
  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 12px Arial, sans-serif';
  ctx.fillText('SCHEDULE H PRESCRIPTION DRUG - CAUTION: To be sold by retail only', 46, 312);

  return canvas.toDataURL('image/png');
}

export const ScanMedicinePage: React.FC = () => {
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);
  const [preprocessingEnabled, setPreprocessingEnabled] = useState<boolean>(true);
  const [contrastLevel, setContrastLevel] = useState<number>(40);

  // OCR state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrStatusText, setOcrStatusText] = useState<string>('');
  const [extractedRawText, setExtractedRawText] = useState<string>('');
  const [cleanTokens, setCleanTokens] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<OcrCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<OcrCandidate | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera permission denied or camera unavailable:', err);
      setCameraPermissionError('Camera access denied or unavailable. Please upload an image or select a sample strip below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setImageSrc(dataUrl);
      stopCamera();
      resetOcrState();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      stopCamera();
      resetOcrState();
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSample = (sampleType: string) => {
    stopCamera();
    let sampleUrl = '';
    if (sampleType === 'dolo') {
      sampleUrl = generateSampleStrip('Dolo 650', '650 mg', 'Paracetamol Tablets IP', 'Micro Labs Ltd');
    } else if (sampleType === 'paracetamol') {
      sampleUrl = generateSampleStrip('Paracetamol 500', '500 mg', 'Paracetamol Tablets IP', 'Cipla Ltd');
    } else if (sampleType === 'cetirizine') {
      sampleUrl = generateSampleStrip('Cetirizine 10', '10 mg', 'Cetirizine Hydrochloride IP', "Dr. Reddy's Lab");
    } else if (sampleType === 'azithromycin') {
      sampleUrl = generateSampleStrip('Azithromycin 500', '500 mg', 'Azithromycin Tablets USP', 'Lupin Pharma');
    } else if (sampleType === 'pantoprazole') {
      sampleUrl = generateSampleStrip('Pantoprazole 40', '40 mg', 'Pantoprazole Gastro-resistant', 'Sun Pharma');
    }
    setImageSrc(sampleUrl);
    resetOcrState();
  };

  const resetOcrState = () => {
    setExtractedRawText('');
    setCleanTokens([]);
    setCandidates([]);
    setSelectedCandidate(null);
    setScanError(null);
    setOcrProgress(0);
    setOcrStatusText('');
  };

  // Preprocess image on canvas (Grayscale + Contrast Enhancement)
  const preprocessImage = (imageElement: HTMLImageElement): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth || imageElement.width;
    canvas.height = imageElement.naturalHeight || imageElement.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    ctx.drawImage(imageElement, 0, 0);

    if (preprocessingEnabled) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const factor = (259 * (contrastLevel + 255)) / (255 * (259 - contrastLevel));

      for (let i = 0; i < data.length; i += 4) {
        // Luminance grayscale
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // Contrast enhancement
        const contrastVal = factor * (gray - 128) + 128;
        const finalVal = Math.min(255, Math.max(0, contrastVal));

        data[i] = finalVal;
        data[i + 1] = finalVal;
        data[i + 2] = finalVal;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    return canvas;
  };

  // Perform Real Tesseract.js OCR
  const handlePerformOcr = async () => {
    if (!imageSrc) return;
    setIsScanning(true);
    resetOcrState();
    setOcrStatusText('Initializing OCR Engine...');

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image for scanning'));
      });

      const processedCanvas = preprocessImage(img);

      // Real Tesseract OCR recognition
      const result = await Tesseract.recognize(processedCanvas, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
            setOcrStatusText(`Reading medicine strip text (${Math.round(m.progress * 100)}%)...`);
          } else {
            setOcrStatusText(m.status);
          }
        }
      });

      const text = result.data.text || '';
      setExtractedRawText(text);

      if (!text.trim()) {
        setScanError('The camera or uploaded image did not yield any readable text. Please try with better lighting or a flatter strip image.');
        setIsScanning(false);
        return;
      }

      setOcrStatusText('Matching extracted text with medicine catalog...');

      // Send extracted text to backend matcher
      const matchResult = await api.matchOcr(text);
      setCleanTokens(matchResult.clean_tokens);
      setCandidates(matchResult.candidates);

      if (matchResult.candidates.length > 0) {
        setSelectedCandidate(matchResult.candidates[0]);
      } else {
        setScanError('No exact medicine brand match found in the local database. You can try adjusting contrast or search manually by name.');
      }
    } catch (err: any) {
      console.error('OCR processing error:', err);
      setScanError(err.message || 'Error occurred during OCR scanning. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleProceedToAvailability = (medicineId: number) => {
    navigate(`/medicines/${medicineId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Real Optical Character Recognition (OCR)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy-800 tracking-tight">
          Smart Medicine Strip Scanner
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Designed especially for seniors and visually impaired individuals. Capture or upload the <strong>back foil of any medicine strip</strong> to automatically extract brand details, verify composition, and find nearby stock.
        </p>
      </div>

      {/* Main scanning grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Capture & Preview */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-navy-800 flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal-600" />
              <span>Step 1: Capture or Upload Medicine Strip</span>
            </h2>
            {imageSrc && (
              <button
                onClick={() => {
                  setImageSrc(null);
                  resetOcrState();
                  stopCamera();
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Clear Image
              </button>
            )}
          </div>

          {/* Camera Permission Error Notice */}
          {cameraPermissionError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Camera Access Note</p>
                <p>{cameraPermissionError}</p>
              </div>
            </div>
          )}

          {/* Live Video Camera or Image Preview */}
          <div className="relative w-full aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center border-2 border-dashed border-slate-200">
            {cameraActive ? (
              <div className="relative w-full h-full">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-4 flex justify-center">
                  <button
                    onClick={captureFromCamera}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold shadow-lg flex items-center gap-2 transition"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Capture Strip</span>
                  </button>
                </div>
              </div>
            ) : imageSrc ? (
              <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt="Medicine Strip Preview"
                  className="max-h-full max-w-full object-contain"
                />
                {isScanning && (
                  <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 space-y-4">
                    <RefreshCw className="w-10 h-10 text-teal-400 animate-spin" />
                    <div className="w-64 bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-teal-500 h-full transition-all duration-300"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                    <p className="text-sm font-semibold tracking-wide text-slate-200">
                      {ocrStatusText}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6 space-y-4 text-slate-400">
                <Camera className="w-12 h-12 mx-auto text-slate-300" />
                <div>
                  <p className="text-sm font-medium text-slate-600">No Strip Image Selected</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Use your phone/laptop camera, upload an existing strip image, or select a sample strip.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons to acquire image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition ${
                cameraActive
                  ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                  : 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{cameraActive ? 'Close Camera' : 'Open Camera'}</span>
            </button>

            <label className="py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer transition shadow-xs">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Upload Image</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Realistic Medicine Strips for Scanning */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-navy-800 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              <span>Don't have a physical strip? Test with high-resolution sample strips:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLoadSample('dolo')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 shadow-xs transition"
              >
                Dolo 650 Strip
              </button>
              <button
                onClick={() => handleLoadSample('paracetamol')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 shadow-xs transition"
              >
                Paracetamol 500
              </button>
              <button
                onClick={() => handleLoadSample('cetirizine')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 shadow-xs transition"
              >
                Cetirizine 10
              </button>
              <button
                onClick={() => handleLoadSample('azithromycin')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 shadow-xs transition"
              >
                Azithromycin 500
              </button>
              <button
                onClick={() => handleLoadSample('pantoprazole')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 shadow-xs transition"
              >
                Pantoprazole 40
              </button>
            </div>
          </div>

          {/* Canvas Preprocessing Controls */}
          {imageSrc && (
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-teal-600" />
                  <span>Browser Canvas Image Preprocessing</span>
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-teal-800">
                  <input
                    type="checkbox"
                    checked={preprocessingEnabled}
                    onChange={(e) => setPreprocessingEnabled(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>Enhance Foil Contrast</span>
                </label>
              </div>

              {preprocessingEnabled && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-24">Contrast Boost:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contrastLevel}
                    onChange={(e) => setContrastLevel(Number(e.target.value))}
                    className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-teal-700 w-10 text-right">
                    {contrastLevel}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Scan Button */}
          {imageSrc && (
            <button
              onClick={handlePerformOcr}
              disabled={isScanning}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 text-base transition"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Processing Strip with Tesseract OCR...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Extract Text & Identify Medicine</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Right Column: OCR Results & Identified Candidates */}
        <div className="lg:col-span-5 space-y-6">
          {/* Extracted Text Box */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-navy-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Extracted Strip Text</span>
              </span>
              {extractedRawText && (
                <span className="text-[11px] font-normal text-slate-400">
                  {cleanTokens.length} tokens parsed
                </span>
              )}
            </h3>

            {extractedRawText ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {extractedRawText}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                Extracted text will appear here once you click "Extract Text & Identify Medicine".
              </p>
            )}

            {cleanTokens.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400 mr-1 self-center">Identified Tokens:</span>
                {cleanTokens.slice(0, 10).map((tok, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-mono"
                  >
                    {tok}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Scan Error Notice */}
          {scanError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Scanning Result Notice</span>
              </div>
              <p>{scanError}</p>
            </div>
          )}

          {/* Identified Candidates */}
          {candidates.length > 0 && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-teal-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Matching Candidates ({candidates.length})</span>
                </h3>
                <span className="text-[11px] text-teal-700 font-medium">
                  Select candidate to confirm
                </span>
              </div>

              <div className="space-y-3">
                {candidates.map((cand) => {
                  const isSelected = selectedCandidate?.medicine.id === cand.medicine.id;
                  return (
                    <div
                      key={cand.medicine.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/40 shadow-sm'
                          : 'border-slate-100 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-navy-800 text-base">
                              {cand.medicine.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                              {cand.medicine.strength}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {cand.medicine.generic_name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {cand.medicine.dosage_form} • {cand.medicine.manufacturer}
                          </p>
                        </div>

                        {/* Confidence Indicator */}
                        <div className="text-right flex-shrink-0">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                              cand.confidence >= 75
                                ? 'bg-softgreen-100 text-softgreen-600'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {cand.confidence}% Match
                          </span>
                        </div>
                      </div>

                      {/* Match reasons */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100/80 space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Detection Evidence:
                        </p>
                        {cand.match_reasons.map((reason, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Safety Disclaimers */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Important Medical Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  OCR identifies printed text on the strip packaging. It does not certify chemical purity, authenticity, or doctor appropriateness. Always inspect your physical blister strip and consult a doctor or licensed pharmacist.
                </p>
              </div>

              {/* Confirmation CTA */}
              {selectedCandidate && (
                <button
                  onClick={() => handleProceedToAvailability(selectedCandidate.medicine.id)}
                  className="w-full py-3 bg-navy-800 hover:bg-navy-900 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2 text-sm transition"
                >
                  <span>Confirm "{selectedCandidate.medicine.name}" & Find Pharmacies</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
