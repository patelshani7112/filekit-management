// This is the fixed edit section that should replace lines 479-1214

      {currentStep === "edit" ? (
        <div className="min-h-screen bg-gray-50">
          {/* Back to Upload Button */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <button
              onClick={() => handleRemoveFile()}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Upload</span>
            </button>
          </div>

          <div className="px-2 sm:px-4 py-2 sm:py-4 space-y-3">
            {/* File Info Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" title={files[0]?.name}>
                    {files[0]?.name}
                  </p>
                  <p className="text-xs opacity-90">
                    {imageDimensions.width} × {imageDimensions.height} · {formatFileSize(files[0]?.size || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Horizontal Toolbar - All Tools */}
            <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                <button
                  onClick={() => setActiveTool("crop")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "crop" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Crop className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Crop</span>
                </button>
                <button
                  onClick={() => setActiveTool("resize")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "resize" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Maximize2 className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Resize</span>
                </button>
                <button
                  onClick={() => setActiveTool("filters")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "filters" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Filters</span>
                </button>
                <button
                  onClick={() => setActiveTool("adjust")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "adjust" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Sliders className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Adjust</span>
                </button>
                <button
                  onClick={() => setActiveTool("transform")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "transform" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Transform</span>
                </button>
                <button
                  onClick={() => setActiveTool("text")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "text" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Type className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Text</span>
                </button>
                <button
                  onClick={() => setActiveTool("draw")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "draw" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Draw</span>
                </button>
                <button
                  onClick={() => setActiveTool("removebg")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "removebg" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Scissors className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Remove BG</span>
                </button>
                <button
                  onClick={() => setActiveTool("background")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "background" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Layers className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">Background</span>
                </button>
                <button
                  onClick={() => setActiveTool("more")}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                    activeTool === "more" 
                      ? "bg-purple-500 text-white shadow-md" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">More</span>
                </button>
              </div>
            </div>

            {/* Tool Settings Row (Horizontal scroll when tool is active) */}
            {activeTool && activeTool !== "none" && (
              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm overflow-x-auto">
                <div className="min-w-max">
                  {/* Crop Settings */}
                  {activeTool === "crop" && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900">Aspect Ratio</h4>
                      <div className="flex gap-2">
                        {ASPECT_RATIOS.map((ratio) => (
                          <button
                            key={ratio.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-md border-2 border-gray-200 hover:border-purple-400 transition-colors whitespace-nowrap"
                          >
                            {ratio.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resize Settings */}
                  {activeTool === "resize" && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Dimensions</h4>
                      <div className="flex gap-3 items-center">
                        <Input type="number" placeholder="Width" className="w-24" />
                        <X className="w-4 h-4 text-gray-400" />
                        <Input type="number" placeholder="Height" className="w-24" />
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Lock aspect ratio
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Filters Settings */}
                  {activeTool === "filters" && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Choose Filter</h4>
                      <div className="flex gap-2">
                        {FILTERS.map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border-2 transition-colors whitespace-nowrap ${
                              selectedFilter === filter.id
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            {filter.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Adjust Settings */}
                  {activeTool === "adjust" && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-semibold text-gray-900">Brightness</Label>
                          <span className="text-xs font-bold text-purple-600">{brightness}%</span>
                        </div>
                        <Slider value={[brightness]} onValueChange={(v) => setBrightness(v[0])} min={0} max={200} className="w-64" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-semibold text-gray-900">Contrast</Label>
                          <span className="text-xs font-bold text-purple-600">{contrast}%</span>
                        </div>
                        <Slider value={[contrast]} onValueChange={(v) => setContrast(v[0])} min={0} max={200} className="w-64" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-semibold text-gray-900">Saturation</Label>
                          <span className="text-xs font-bold text-purple-600">{saturation}%</span>
                        </div>
                        <Slider value={[saturation]} onValueChange={(v) => setSaturation(v[0])} min={0} max={200} className="w-64" />
                      </div>
                    </div>
                  )}

                  {/* Transform Settings */}
                  {activeTool === "transform" && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Transform</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRotation(rotation + 90)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <RotateCw className="w-4 h-4" />
                          Rotate 90°
                        </button>
                        <button
                          onClick={() => setFlipHorizontal(!flipHorizontal)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <FlipHorizontal className="w-4 h-4" />
                          Flip H
                        </button>
                        <button
                          onClick={() => setFlipVertical(!flipVertical)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <FlipVertical className="w-4 h-4" />
                          Flip V
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Text Settings */}
                  {activeTool === "text" && (
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Enter text..."
                        value={textOverlay}
                        onChange={(e) => setTextOverlay(e.target.value)}
                        className="w-full max-w-md"
                      />
                      <div className="flex gap-2 items-center">
                        <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-12 h-8" />
                        <Input type="number" placeholder="Size" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-20" />
                        <button
                          onClick={() => setTextBold(!textBold)}
                          className={`p-2 rounded ${textBold ? "bg-purple-100 text-purple-700" : "bg-gray-100"}`}
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTextItalic(!textItalic)}
                          className={`p-2 rounded ${textItalic ? "bg-purple-100 text-purple-700" : "bg-gray-100"}`}
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Background Settings */}
                  {activeTool === "background" && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {["none", "color", "gradient", "image"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setBackgroundType(type)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border-2 transition-colors capitalize ${
                              backgroundType === type
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      {backgroundType === "color" && (
                        <div className="flex gap-2">
                          {BG_COLORS.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setBackgroundColor(color.value)}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-purple-500"
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* More Settings */}
                  {activeTool === "more" && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-semibold text-gray-900">Border Width</Label>
                          <span className="text-xs font-bold text-purple-600">{borderWidth}px</span>
                        </div>
                        <Slider value={[borderWidth]} onValueChange={(v) => setBorderWidth(v[0])} min={0} max={50} className="w-64" />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-900 mb-2 block">Output Format</Label>
                        <select
                          value={outputFormat}
                          onChange={(e) => setOutputFormat(e.target.value)}
                          className="px-3 py-2 text-sm border-2 border-gray-200 rounded-lg"
                        >
                          {OUTPUT_FORMATS.map((format) => (
                            <option key={format.id} value={format.id}>{format.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Controls & Zoom */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Undo">
                    <Undo2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Redo">
                    <Redo2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button onClick={resetAllSettings} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Reset">
                    <RotateCcw className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ZoomOut className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-4 flex items-center justify-center relative overflow-hidden" style={{ minHeight: '400px' }}>
              {/* Background Layer */}
              <div className="absolute inset-0" style={getBackgroundStyle()}></div>
              
              {/* Image Layer */}
              {imagePreviewUrl ? (
                <div 
                  className="relative z-10"
                  style={{
                    border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'center',
                  }}
                >
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded"
                    style={{
                      filter: getCombinedFilter(),
                      transform: getTransform(),
                      maxHeight: '400px',
                    }}
                  />
                  {textOverlay && (
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        color: textColor,
                        fontSize: `${textSize}px`,
                        fontFamily: textFontFamily,
                        fontWeight: textBold ? 'bold' : 'normal',
                        fontStyle: textItalic ? 'italic' : 'normal',
                        textAlign: textAlign,
                        opacity: textOpacity / 100,
                        WebkitTextStroke: textStrokeWidth > 0 ? `${textStrokeWidth}px ${textStrokeColor}` : 'none',
                        textShadow: textShadow ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
                      }}
                    >
                      {textOverlay}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 z-10">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Loading preview...</p>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <GradientButton
              onClick={handleProcessFiles}
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!canProcess}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Apply Changes
            </GradientButton>
          </div>
        </div>
      ) : (
