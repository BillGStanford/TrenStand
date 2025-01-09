import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, X, RefreshCw, Home, Image as ImageIcon, Settings, User } from 'lucide-react';

const fontFamilies = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  cursive: 'font-cursive'
};

const positions = {
  'top-left': 'items-start justify-start text-left',
  'top-center': 'items-start justify-center text-center',
  'top-right': 'items-start justify-end text-right',
  'middle-left': 'items-center justify-start text-left',
  'middle-center': 'items-center justify-center text-center',
  'middle-right': 'items-center justify-end text-right',
  'bottom-left': 'items-end justify-start text-left',
  'bottom-center': 'items-end justify-center text-center',
  'bottom-right': 'items-end justify-end text-right',
};

const styles = {
  normal: {
    name: 'Normal',
    className: '',
    textWrapperStyle: {},
    textStyle: {}
  },
  meme: {
    name: 'Meme',
    className: 'uppercase font-bold',
    textWrapperStyle: {},
    textStyle: { textShadow: '2px 2px 0 #000' }
  },
  aesthetic: {
    name: 'Aesthetic',
    className: 'font-cursive',
    textWrapperStyle: {},
    textStyle: { 
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
      letterSpacing: '2px'
    }
  },
  minimal: {
    name: 'Minimal',
    className: 'font-mono tracking-wide',
    textWrapperStyle: {},
    textStyle: {
      border: '1px solid currentColor',
      padding: '16px'
    }
  },
  retro: {
    name: 'Retro',
    className: 'font-serif',
    textWrapperStyle: {},
    textStyle: {
      textShadow: '3px 3px 0 rgba(255,105,180,0.7), -3px -3px 0 rgba(0,255,255,0.7)'
    }
  },
  neon: {
    name: 'Neon',
    className: 'font-sans',
    textWrapperStyle: {},
    textStyle: {
      textShadow: '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa'
    }
  }
};

const DEFAULT_BG_COLOR = '#f3f4f6';
const DEFAULT_TEXT_COLOR = '#000000';
const DEFAULT_TEXT_BG_COLOR = 'transparent';



export default function App() {
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState(DEFAULT_BG_COLOR);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [textBgColor, setTextBgColor] = useState(DEFAULT_TEXT_BG_COLOR);
  const [fontSize, setFontSize] = useState(24);
  const [position, setPosition] = useState('middle-center');
  const [fontFamily, setFontFamily] = useState('sans');
  const [customImage, setCustomImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('normal');
  const [fileName, setFileName] = useState('my-quote');
  const [showFileNameInput, setShowFileNameInput] = useState(false);
  const [fileFormat, setFileFormat] = useState('png');
  
  const quoteRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = text.slice(0, cursorPosition);
      const textAfterCursor = text.slice(cursorPosition);
      setText(textBeforeCursor + '\n' + textAfterCursor);
      setTimeout(() => {
        e.target.selectionStart = cursorPosition + 1;
        e.target.selectionEnd = cursorPosition + 1;
      }, 0);
    }
  };

  const resetBackgroundImage = () => {
    setCustomImage(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const resetColors = () => {
    setBgColor(DEFAULT_BG_COLOR);
    setTextColor(DEFAULT_TEXT_COLOR);
    setTextBgColor(DEFAULT_TEXT_BG_COLOR);
  };

  const downloadImage = async () => {
    if (quoteRef.current) {
      try {
        const dataUrl = await toPng(quoteRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = `${fileName}.trenstand.${fileFormat}`;
        link.href = dataUrl;
        link.click();
        setShowFileNameInput(false);
      } catch (err) {
        console.error('Error generating image:', err);
      }
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Style Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Styles</h2>
        <div className="space-y-2">
          {Object.entries(styles).map(([key, style]) => (
            <button
              key={key}
              onClick={() => setSelectedStyle(key)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                selectedStyle === key
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-6">
            <h1 className="text-3xl font-bold text-center text-gray-900">
              FrenStand
            </h1>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Your Text
                  </label>
                  <textarea
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                    placeholder="Type your text here..."
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Colors
                      </label>
                      <button
                        onClick={resetColors}
                        className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Reset Colors
                      </button>
                    </div>
                    <div className="space-y-2 mt-2">
                      <div>
                        <label className="block text-sm text-gray-600">Background</label>
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="mt-1 block w-full h-10 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Text Color</label>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="mt-1 block w-full h-10 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Text Background</label>
                        <input
                          type="color"
                          value={textBgColor}
                          onChange={(e) => setTextBgColor(e.target.value)}
                          className="mt-1 block w-full h-10 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Font Size
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="mt-1 block w-full"
                    />
                    <span className="text-sm text-gray-500">{fontSize}px</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {Object.keys(positions).map((pos) => (
                      <option key={pos} value={pos}>
                        {pos.replace('-', ' ').charAt(0).toUpperCase() + pos.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Font Family
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {Object.keys(fontFamilies).map((font) => (
                      <option key={font} value={font}>
                        {font.charAt(0).toUpperCase() + font.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Background Image
                    </label>
                    {customImage && (
                      <button
                        onClick={resetBackgroundImage}
                        className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Remove Image
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    File Format
                  </label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                    <option value="webp">WEBP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-8">
              <div
                ref={quoteRef}
                className={`w-full aspect-square rounded-lg overflow-hidden flex ${positions[position]}`}
                style={{
                  backgroundColor: customImage ? 'transparent' : bgColor,
                  backgroundImage: customImage ? `url(${customImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={styles[selectedStyle].textWrapperStyle}
                  className={`flex ${positions[position]} p-8 max-w-[90%]`}
                >
                  <div
                    className={`${styles[selectedStyle].className} ${fontFamilies[fontFamily]} whitespace-pre-wrap break-words`}
                    style={{
                      ...styles[selectedStyle].textStyle,
                      color: textColor,
                      fontSize: `${fontSize}px`,
                      backgroundColor: textBgColor,
                      padding: '0.5em',
                      borderRadius: textBgColor !== 'transparent' ? '4px' : '0',
                    }}
                  >
                    {text}
                  </div>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="flex justify-center mt-6 space-x-4">
              {showFileNameInput ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter file name"
                  />
                  <span className="text-gray-500">.trenstand.{fileFormat}</span>
                  <button
                    onClick={downloadImage}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={() => setShowFileNameInput(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowFileNameInput(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}