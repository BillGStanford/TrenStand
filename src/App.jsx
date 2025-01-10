import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { 
  Download, 
  X, 
  RefreshCw, 
  Home, 
  Image as ImageIcon, 
  Settings, 
  User,
  Menu,
  Share2,
  Save,
  Undo,
  Redo,
  Moon,
  Sun,
  Palette
} from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const quoteRef = useRef(null);

  // History management
  useEffect(() => {
    if (text) {
      const newState = {
        text,
        bgColor,
        textColor,
        textBgColor,
        fontSize,
        position,
        fontFamily,
        selectedStyle
      };
      
      if (historyIndex < history.length - 1) {
        // If we're in the middle of the history, truncate it
        setHistory(prev => [...prev.slice(0, historyIndex + 1), newState]);
        setHistoryIndex(historyIndex + 1);
      } else {
        setHistory(prev => [...prev, newState]);
        setHistoryIndex(history.length);
      }
    }
  }, [text, bgColor, textColor, textBgColor, fontSize, position, fontFamily, selectedStyle]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      applyState(prevState);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      applyState(nextState);
    }
  };

  const applyState = (state) => {
    setText(state.text);
    setBgColor(state.bgColor);
    setTextColor(state.textColor);
    setTextBgColor(state.textBgColor);
    setFontSize(state.fontSize);
    setPosition(state.position);
    setFontFamily(state.fontFamily);
    setSelectedStyle(state.selectedStyle);
  };

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const shareImage = async () => {
    if (quoteRef.current) {
      try {
        const dataUrl = await toPng(quoteRef.current, { quality: 0.95 });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `${fileName}.trenstand.${fileFormat}`, { type: 'image/png' });
        
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: 'FrenStand Creation',
            text: 'Check out my FrenStand creation!'
          });
        } else {
          // Fallback for browsers that don't support Web Share API
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${fileName}.trenstand.${fileFormat}`;
          link.click();
        }
      } catch (err) {
        console.error('Error sharing image:', err);
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">FrenStand</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <Undo className="h-5 w-5" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <Redo className="h-5 w-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={shareImage}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <div className="flex items-center">
                <Undo className="h-5 w-5 mr-2" />
                Undo
              </div>
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <div className="flex items-center">
                <Redo className="h-5 w-5 mr-2" />
                Redo
              </div>
            </button>
            <button
              onClick={toggleDarkMode}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                {isDarkMode ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </div>
            </button>
            <button
              onClick={shareImage}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Style Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 shadow-lg`}>
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Styles</h2>
            <div className="space-y-2">
              {Object.entries(styles).map(([key, style]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStyle(key)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedStyle === key
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        </div>
{/* Main Content */}
<div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
              {/* Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Your Text
                    </label>
                    <textarea
                      value={text}
                      onChange={handleTextChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      rows="3"
                      placeholder="Type your text here..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Colors
                        </label>
                        <button
                          onClick={resetColors}
                          className="inline-flex items-center px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Reset Colors
                        </button>
                      </div>
                      <div className="space-y-2 mt-2">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400">Background</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={bgColor}
                              onChange={(e) => setBgColor(e.target.value)}
                              className="mt-1 block w-full h-10 rounded-md"
                            />
                            <input
                              type="text"
                              value={bgColor}
                              onChange={(e) => setBgColor(e.target.value)}
                              className="mt-1 block w-24 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400">Text Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="mt-1 block w-full h-10 rounded-md"
                            />
                            <input
                              type="text"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="mt-1 block w-24 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400">Text Background</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={textBgColor}
                              onChange={(e) => setTextBgColor(e.target.value)}
                              className="mt-1 block w-full h-10 rounded-md"
                            />
                            <input
                              type="text"
                              value={textBgColor}
                              onChange={(e) => setTextBgColor(e.target.value)}
                              className="mt-1 block w-24 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Font Size
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="12"
                          max="72"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="mt-1 block w-full"
                        />
                        <input
                          type="number"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="mt-1 block w-20 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          min="12"
                          max="72"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Position
                    </label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      {Object.keys(positions).map((pos) => (
                        <option key={pos} value={pos}>
                          {pos.replace('-', ' ').charAt(0).toUpperCase() + pos.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Font Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Background Image
                      </label>
                      {customImage && (
                        <button
                          onClick={resetBackgroundImage}
                          className="inline-flex items-center px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                      className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 dark:file:bg-indigo-900 file:text-indigo-700 dark:file:text-indigo-200
                        hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      File Format
                    </label>
                    <select
                      value={fileFormat}
                      onChange={(e) => setFileFormat(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                      {text || 'Preview text will appear here'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Section */}
              <div className="flex flex-wrap justify-center mt-6 gap-4">
                {showFileNameInput ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter file name"
                    />
                    <span className="text-gray-500 dark:text-gray-400">.trenstand.{fileFormat}</span>
                    <button
                      onClick={downloadImage}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => setShowFileNameInput(false)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowFileNameInput(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </button>
                    <button
                      onClick={shareImage}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

