/**
 * Unit Converter Page
 * 
 * Purpose: Allow users to convert between different units of measurement
 * 
 * Features:
 * - Multiple categories (Length, Weight, Temperature, Volume, Area, Speed, Time, Digital Storage)
 * - Instant conversion as you type
 * - Swap button to reverse conversion
 * - Comprehensive unit support
 * - Live results display
 * - No file upload required
 * 
 * How it works:
 * 1. User selects conversion category
 * 2. User selects from and to units
 * 3. User enters value
 * 4. Results display instantly
 * 5. User can copy or swap units
 */

import { useState, useEffect } from "react";
import { SeoHead } from "../../../src/seo/SeoHead";
import { ToolJsonLd } from "../../../src/seo/ToolJsonLd";
import {
  ToolPageLayout,
  ToolPageHero,
  RelatedToolsSection,
  HowItWorksSteps,
  WhyChooseSection,
  ToolFAQSection,
  ToolDefinitionSection,
  UseCasesSection,
  ToolSEOFooter,
  MobileStickyAd,
} from "../../../components/tool";
import { WHY_CHOOSE_WORKFLOWPRO } from "../../../src/config/whyChooseConfig";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { GradientButton } from "../../../components/ui/gradient-button";
import { 
  ArrowLeftRight, Copy, Check, RefreshCw, 
  Ruler, Weight, Thermometer, Droplet, 
  Square, Gauge, Clock, HardDrive,
  ChevronDown, FileType, Archive
} from "lucide-react";

// How it works steps for this tool
const STEPS = [
  {
    number: 1,
    title: "Select Category",
    description: "Choose the type of unit you want to convert (length, weight, temperature, etc.).",
    icon: Ruler,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Choose Units",
    description: "Select the units you're converting from and to from the dropdown menus.",
    icon: ArrowLeftRight,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Enter Value",
    description: "Type the value you want to convert and see instant results.",
    icon: Gauge,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Get Results",
    description: "View your conversion result instantly with high precision.",
    icon: Check,
    iconBgColor: "from-green-400 to-green-500",
  },
];

// Unit conversion categories
const CATEGORIES = [
  { id: "length", name: "Length", icon: Ruler, description: "Distance measurements" },
  { id: "weight", name: "Weight", icon: Weight, description: "Mass measurements" },
  { id: "temperature", name: "Temperature", icon: Thermometer, description: "Heat measurements" },
  { id: "volume", name: "Volume", icon: Droplet, description: "Capacity measurements" },
  { id: "area", name: "Area", icon: Square, description: "Surface measurements" },
  { id: "speed", name: "Speed", icon: Gauge, description: "Velocity measurements" },
  { id: "time", name: "Time", icon: Clock, description: "Duration measurements" },
  { id: "digital", name: "Digital Storage", icon: HardDrive, description: "Data size measurements" },
];

// Units for each category with conversion factors (to base unit)
const UNITS = {
  length: [
    { id: "meter", name: "Meter (m)", factor: 1, symbol: "m" },
    { id: "kilometer", name: "Kilometer (km)", factor: 1000, symbol: "km" },
    { id: "centimeter", name: "Centimeter (cm)", factor: 0.01, symbol: "cm" },
    { id: "millimeter", name: "Millimeter (mm)", factor: 0.001, symbol: "mm" },
    { id: "mile", name: "Mile (mi)", factor: 1609.344, symbol: "mi" },
    { id: "yard", name: "Yard (yd)", factor: 0.9144, symbol: "yd" },
    { id: "foot", name: "Foot (ft)", factor: 0.3048, symbol: "ft" },
    { id: "inch", name: "Inch (in)", factor: 0.0254, symbol: "in" },
    { id: "nauticalmile", name: "Nautical Mile", factor: 1852, symbol: "nmi" },
  ],
  weight: [
    { id: "kilogram", name: "Kilogram (kg)", factor: 1, symbol: "kg" },
    { id: "gram", name: "Gram (g)", factor: 0.001, symbol: "g" },
    { id: "milligram", name: "Milligram (mg)", factor: 0.000001, symbol: "mg" },
    { id: "metricton", name: "Metric Ton (t)", factor: 1000, symbol: "t" },
    { id: "pound", name: "Pound (lb)", factor: 0.453592, symbol: "lb" },
    { id: "ounce", name: "Ounce (oz)", factor: 0.0283495, symbol: "oz" },
    { id: "stone", name: "Stone (st)", factor: 6.35029, symbol: "st" },
    { id: "ton", name: "US Ton", factor: 907.185, symbol: "ton" },
  ],
  temperature: [
    { id: "celsius", name: "Celsius (°C)", symbol: "°C" },
    { id: "fahrenheit", name: "Fahrenheit (°F)", symbol: "°F" },
    { id: "kelvin", name: "Kelvin (K)", symbol: "K" },
  ],
  volume: [
    { id: "liter", name: "Liter (L)", factor: 1, symbol: "L" },
    { id: "milliliter", name: "Milliliter (mL)", factor: 0.001, symbol: "mL" },
    { id: "cubicmeter", name: "Cubic Meter (m³)", factor: 1000, symbol: "m³" },
    { id: "gallon", name: "US Gallon (gal)", factor: 3.78541, symbol: "gal" },
    { id: "quart", name: "US Quart (qt)", factor: 0.946353, symbol: "qt" },
    { id: "pint", name: "US Pint (pt)", factor: 0.473176, symbol: "pt" },
    { id: "cup", name: "US Cup", factor: 0.236588, symbol: "cup" },
    { id: "fluidounce", name: "Fluid Ounce (fl oz)", factor: 0.0295735, symbol: "fl oz" },
    { id: "tablespoon", name: "Tablespoon (tbsp)", factor: 0.0147868, symbol: "tbsp" },
    { id: "teaspoon", name: "Teaspoon (tsp)", factor: 0.00492892, symbol: "tsp" },
  ],
  area: [
    { id: "squaremeter", name: "Square Meter (m²)", factor: 1, symbol: "m²" },
    { id: "squarekilometer", name: "Square Kilometer (km²)", factor: 1000000, symbol: "km²" },
    { id: "squarecentimeter", name: "Square Centimeter (cm²)", factor: 0.0001, symbol: "cm²" },
    { id: "squaremile", name: "Square Mile (mi²)", factor: 2589988.11, symbol: "mi²" },
    { id: "squareyard", name: "Square Yard (yd²)", factor: 0.836127, symbol: "yd²" },
    { id: "squarefoot", name: "Square Foot (ft²)", factor: 0.092903, symbol: "ft²" },
    { id: "squareinch", name: "Square Inch (in²)", factor: 0.00064516, symbol: "in²" },
    { id: "hectare", name: "Hectare (ha)", factor: 10000, symbol: "ha" },
    { id: "acre", name: "Acre", factor: 4046.86, symbol: "ac" },
  ],
  speed: [
    { id: "meterpersecond", name: "Meter/Second (m/s)", factor: 1, symbol: "m/s" },
    { id: "kilometerperhour", name: "Kilometer/Hour (km/h)", factor: 0.277778, symbol: "km/h" },
    { id: "mileperhour", name: "Mile/Hour (mph)", factor: 0.44704, symbol: "mph" },
    { id: "footpersecond", name: "Foot/Second (ft/s)", factor: 0.3048, symbol: "ft/s" },
    { id: "knot", name: "Knot (kn)", factor: 0.514444, symbol: "kn" },
  ],
  time: [
    { id: "second", name: "Second (s)", factor: 1, symbol: "s" },
    { id: "millisecond", name: "Millisecond (ms)", factor: 0.001, symbol: "ms" },
    { id: "minute", name: "Minute (min)", factor: 60, symbol: "min" },
    { id: "hour", name: "Hour (h)", factor: 3600, symbol: "h" },
    { id: "day", name: "Day (d)", factor: 86400, symbol: "d" },
    { id: "week", name: "Week (wk)", factor: 604800, symbol: "wk" },
    { id: "month", name: "Month (mo)", factor: 2629800, symbol: "mo" },
    { id: "year", name: "Year (yr)", factor: 31557600, symbol: "yr" },
  ],
  digital: [
    { id: "byte", name: "Byte (B)", factor: 1, symbol: "B" },
    { id: "kilobyte", name: "Kilobyte (KB)", factor: 1024, symbol: "KB" },
    { id: "megabyte", name: "Megabyte (MB)", factor: 1048576, symbol: "MB" },
    { id: "gigabyte", name: "Gigabyte (GB)", factor: 1073741824, symbol: "GB" },
    { id: "terabyte", name: "Terabyte (TB)", factor: 1099511627776, symbol: "TB" },
    { id: "petabyte", name: "Petabyte (PB)", factor: 1125899906842624, symbol: "PB" },
    { id: "bit", name: "Bit (b)", factor: 0.125, symbol: "b" },
    { id: "kilobit", name: "Kilobit (Kb)", factor: 128, symbol: "Kb" },
    { id: "megabit", name: "Megabit (Mb)", factor: 131072, symbol: "Mb" },
    { id: "gigabit", name: "Gigabit (Gb)", factor: 134217728, symbol: "Gb" },
  ],
};

interface UnitConverterPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function UnitConverterPage({ onWorkStateChange }: UnitConverterPageProps = {}) {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("kilometer");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Get units for selected category
  const availableUnits = UNITS[selectedCategory as keyof typeof UNITS] || [];
  const selectedCategoryData = CATEGORIES.find(cat => cat.id === selectedCategory) || CATEGORIES[0];

  // Temperature conversion (special case)
  const convertTemperature = (value: number, from: string, to: string): number => {
    if (from === to) return value;

    // Convert to Celsius first
    let celsius = value;
    if (from === "fahrenheit") {
      celsius = (value - 32) * 5 / 9;
    } else if (from === "kelvin") {
      celsius = value - 273.15;
    }

    // Convert from Celsius to target
    if (to === "fahrenheit") {
      return (celsius * 9 / 5) + 32;
    } else if (to === "kelvin") {
      return celsius + 273.15;
    }
    return celsius;
  };

  // Perform conversion
  useEffect(() => {
    if (!inputValue || isNaN(parseFloat(inputValue))) {
      setResult("");
      return;
    }

    const value = parseFloat(inputValue);

    if (selectedCategory === "temperature") {
      const convertedValue = convertTemperature(value, fromUnit, toUnit);
      setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ""));
    } else {
      const fromUnitData = availableUnits.find(u => u.id === fromUnit);
      const toUnitData = availableUnits.find(u => u.id === toUnit);

      if (fromUnitData && toUnitData && fromUnitData.factor && toUnitData.factor) {
        // Convert to base unit, then to target unit
        const baseValue = value * fromUnitData.factor;
        const convertedValue = baseValue / toUnitData.factor;
        setResult(convertedValue.toFixed(10).replace(/\.?0+$/, ""));
      }
    }
  }, [inputValue, fromUnit, toUnit, selectedCategory, availableUnits]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const units = UNITS[categoryId as keyof typeof UNITS];
    if (units && units.length >= 2) {
      setFromUnit(units[0].id);
      setToUnit(units[1].id);
    }
    setInputValue("");
    setResult("");
    setIsCategoryDropdownOpen(false);
  };

  // Swap units
  const handleSwap = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    
    // Also swap values
    if (result) {
      setInputValue(result);
    }
  };

  // Copy result
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Related tools for this page
  const relatedTools = [
    {
      name: "Time Converter",
      description: "Convert time zones",
      icon: Clock,
      onClick: () => window.location.href = "/time-converter",
    },
    {
      name: "PDF to DOCX",
      description: "Convert PDF to Word",
      icon: RefreshCw,
      onClick: () => window.location.href = "/pdf-to-docx",
    },
    {
      name: "Image Converter",
      description: "Convert image formats",
      icon: RefreshCw,
      onClick: () => window.location.href = "/image-converter",
    },
    {
      name: "Archive Converter",
      description: "Convert archive files",
      icon: Archive,
      onClick: () => window.location.href = "/archive-converter",
    },
    {
      name: "DOCX to PDF",
      description: "Convert Word to PDF",
      icon: FileType,
      onClick: () => window.location.href = "/docx-to-pdf",
    },
    {
      name: "Compress PDF",
      description: "Reduce PDF file size",
      icon: Archive,
      onClick: () => window.location.href = "/compress-pdf",
    },
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <SeoHead path="/unit-converter" />
      <ToolJsonLd path="/unit-converter" />

      {/* Header Section */}
      <ToolPageHero 
        title="Unit Converter" 
        description="Convert between different units of measurement instantly. Support for length, weight, temperature, volume, area, speed, time, and digital storage — completely free and easy to use."
      />

      <ToolPageLayout>
        <MobileStickyAd topOffset={64} height={100} />

        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-6">
          {/* Category Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Conversion Category</Label>
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  {selectedCategoryData.icon && <selectedCategoryData.icon className="w-5 h-5 text-purple-600" />}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{selectedCategoryData.name}</div>
                    <div className="text-xs text-gray-500">{selectedCategoryData.description}</div>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-purple-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
                  <div className="overflow-y-auto max-h-80 custom-scrollbar">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 ${
                          selectedCategory === category.id ? 'bg-purple-100' : ''
                        }`}
                      >
                        <category.icon className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          <div className="text-xs text-gray-500">{category.description}</div>
                        </div>
                        {selectedCategory === category.id && (
                          <Check className="w-5 h-5 text-purple-600 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conversion Area */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
            {/* From Unit */}
            <div className="space-y-3">
              <Label htmlFor="fromUnit" className="text-sm font-medium">
                From
              </Label>
              <select
                id="fromUnit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 focus:border-purple-500 focus:outline-none transition-colors text-sm"
              >
                {availableUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="text-lg h-14"
              />
              <div className="text-xs text-gray-500">
                {inputValue && (
                  <>
                    {inputValue} {availableUnits.find(u => u.id === fromUnit)?.symbol}
                  </>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center lg:pt-16">
              <button
                onClick={handleSwap}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl rotate-0 lg:rotate-90"
                title="Swap units"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>

            {/* To Unit */}
            <div className="space-y-3">
              <Label htmlFor="toUnit" className="text-sm font-medium">
                To
              </Label>
              <select
                id="toUnit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 focus:border-purple-500 focus:outline-none transition-colors text-sm"
              >
                {availableUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <div className="relative">
                <Input
                  type="text"
                  value={result}
                  readOnly
                  placeholder="Result"
                  className="text-lg h-14 pr-12 bg-gray-50"
                />
                {result && (
                  <button
                    onClick={handleCopy}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Copy result"
                  >
                    {isCopied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {result && (
                  <>
                    {result} {availableUnits.find(u => u.id === toUnit)?.symbol}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Result Display Card */}
          {result && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-purple-900 mb-2">Conversion Result</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {result} {availableUnits.find(u => u.id === toUnit)?.symbol}
                  </p>
                  <p className="text-sm text-gray-600">
                    {inputValue} {availableUnits.find(u => u.id === fromUnit)?.symbol} = {result} {availableUnits.find(u => u.id === toUnit)?.symbol}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-white border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium text-purple-700 flex items-center gap-2"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <selectedCategoryData.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-blue-900">Quick & Accurate Conversions</p>
                <p className="text-xs text-blue-700 mt-1">
                  Get instant, precise unit conversions with support for multiple measurement systems. Perfect for students, professionals, and everyday use!
                </p>
              </div>
            </div>
          </div>
        </div>

        <RelatedToolsSection tools={relatedTools} introText="These tools work well with unit conversion." />
        
        <ToolDefinitionSection
          title="What Is a Unit Converter?"
          content="A unit converter is a tool that transforms measurements from one unit to another within the same category. Convert between metric and imperial systems, SI units, and specialized measurements for length, weight, temperature, volume, and more — completely free, accurate, and instant."
        />
        
        <HowItWorksSteps 
          title="How It Works" 
          subtitle="Convert units in four simple steps" 
          introText="Follow these steps to convert any unit instantly." 
          steps={STEPS} 
        />
        
        <WhyChooseSection 
          title={WHY_CHOOSE_WORKFLOWPRO.title} 
          subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} 
          introText={WHY_CHOOSE_WORKFLOWPRO.introText} 
          features={WHY_CHOOSE_WORKFLOWPRO.features} 
        />
        
        <UseCasesSection
          title="Popular Uses for Unit Converter"
          useCases={[
            "Convert recipe measurements (cups to milliliters)",
            "Calculate distances for travel (miles to kilometers)",
            "Convert weights for shipping (pounds to kilograms)",
            "Measure room dimensions (feet to meters)",
            "Convert temperatures (Celsius to Fahrenheit)",
            "Calculate digital storage sizes (GB to TB)",
            "Convert speeds for vehicles (mph to km/h)",
            "Measure areas for real estate (acres to square meters)",
            "Convert cooking temperatures",
          ]}
        />
        
        <ToolFAQSection
          faqs={[
            { question: "What types of units can I convert?", answer: "You can convert length (meters, feet, miles), weight (grams, pounds, ounces), temperature (Celsius, Fahrenheit, Kelvin), volume (liters, gallons, cups), area (square meters, acres), speed (km/h, mph), time (seconds, hours, days), and digital storage (bytes, KB, MB, GB, TB)." },
            { question: "How accurate are the conversions?", answer: "Our conversions use precise mathematical formulas and standard conversion factors. Results are calculated with high precision (up to 10 decimal places) and rounded intelligently." },
            { question: "Can I convert between metric and imperial units?", answer: "Yes! You can easily convert between metric (SI) units and imperial/US customary units for all supported categories." },
            { question: "Is there a limit to the values I can convert?", answer: "No, you can convert any numeric value. The tool handles very large and very small numbers with high precision." },
            { question: "Can I copy the conversion result?", answer: "Yes! Click the copy button next to the result to copy the converted value to your clipboard." },
            { question: "Do I need to install anything?", answer: "No — the unit converter works entirely in your browser. No downloads, no installations required." },
          ]}
        />
        
        <ToolSEOFooter
          title="About WorkflowPro's Unit Converter"
          content="WorkflowPro's unit converter: 8 categories, 70+ units, instant conversion, high precision, swap function, copy results — perfect for students, professionals, cooks, travelers, and anyone needing quick unit conversions. Fast, accurate, always free."
        />
      </ToolPageLayout>
    </>
  );
}
