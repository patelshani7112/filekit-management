/**
 * Time Zone Converter Page
 * 
 * Purpose: Allow users to convert times between different time zones
 * 
 * Features:
 * - Convert times between 100+ time zones
 * - Date and time picker
 * - Current time in multiple zones
 * - Swap time zones instantly
 * - 12/24 hour format support
 * - DST (Daylight Saving Time) aware
 * - Live clock updates
 * 
 * How it works:
 * 1. User selects source time zone
 * 2. User selects target time zone
 * 3. User picks date and time
 * 4. Results display instantly
 * 5. User can swap zones or copy result
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
import { 
  ArrowLeftRight, Copy, Check, Clock, 
  Globe, CalendarDays, MapPin, Sunrise,
  RefreshCw, Calculator, FileType, Archive
} from "lucide-react";

// How it works steps for this tool
const STEPS = [
  {
    number: 1,
    title: "Select Source Zone",
    description: "Choose the time zone you're converting from.",
    icon: MapPin,
    iconBgColor: "from-purple-400 to-purple-500",
  },
  {
    number: 2,
    title: "Select Target Zone",
    description: "Choose the time zone you're converting to.",
    icon: Globe,
    iconBgColor: "from-pink-400 to-pink-500",
  },
  {
    number: 3,
    title: "Pick Date & Time",
    description: "Select the date and time you want to convert.",
    icon: CalendarDays,
    iconBgColor: "from-blue-400 to-blue-500",
  },
  {
    number: 4,
    title: "Get Results",
    description: "View the converted time instantly with timezone details.",
    icon: Check,
    iconBgColor: "from-green-400 to-green-500",
  },
];

// Time zones with UTC offsets
const TIME_ZONES = [
  // Americas
  { id: "America/New_York", name: "New York (EST/EDT)", region: "Americas", offset: -5 },
  { id: "America/Chicago", name: "Chicago (CST/CDT)", region: "Americas", offset: -6 },
  { id: "America/Denver", name: "Denver (MST/MDT)", region: "Americas", offset: -7 },
  { id: "America/Los_Angeles", name: "Los Angeles (PST/PDT)", region: "Americas", offset: -8 },
  { id: "America/Phoenix", name: "Phoenix (MST)", region: "Americas", offset: -7 },
  { id: "America/Anchorage", name: "Anchorage (AKST/AKDT)", region: "Americas", offset: -9 },
  { id: "Pacific/Honolulu", name: "Honolulu (HST)", region: "Americas", offset: -10 },
  { id: "America/Toronto", name: "Toronto (EST/EDT)", region: "Americas", offset: -5 },
  { id: "America/Vancouver", name: "Vancouver (PST/PDT)", region: "Americas", offset: -8 },
  { id: "America/Mexico_City", name: "Mexico City (CST/CDT)", region: "Americas", offset: -6 },
  { id: "America/Sao_Paulo", name: "São Paulo (BRT)", region: "Americas", offset: -3 },
  { id: "America/Buenos_Aires", name: "Buenos Aires (ART)", region: "Americas", offset: -3 },
  { id: "America/Lima", name: "Lima (PET)", region: "Americas", offset: -5 },
  { id: "America/Bogota", name: "Bogotá (COT)", region: "Americas", offset: -5 },
  { id: "America/Santiago", name: "Santiago (CLT)", region: "Americas", offset: -4 },
  
  // Europe
  { id: "Europe/London", name: "London (GMT/BST)", region: "Europe", offset: 0 },
  { id: "Europe/Paris", name: "Paris (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Berlin", name: "Berlin (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Rome", name: "Rome (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Madrid", name: "Madrid (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Amsterdam", name: "Amsterdam (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Brussels", name: "Brussels (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Vienna", name: "Vienna (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Stockholm", name: "Stockholm (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Copenhagen", name: "Copenhagen (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Oslo", name: "Oslo (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Helsinki", name: "Helsinki (EET/EEST)", region: "Europe", offset: 2 },
  { id: "Europe/Athens", name: "Athens (EET/EEST)", region: "Europe", offset: 2 },
  { id: "Europe/Moscow", name: "Moscow (MSK)", region: "Europe", offset: 3 },
  { id: "Europe/Istanbul", name: "Istanbul (TRT)", region: "Europe", offset: 3 },
  { id: "Europe/Kiev", name: "Kyiv (EET/EEST)", region: "Europe", offset: 2 },
  { id: "Europe/Warsaw", name: "Warsaw (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Prague", name: "Prague (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Budapest", name: "Budapest (CET/CEST)", region: "Europe", offset: 1 },
  { id: "Europe/Bucharest", name: "Bucharest (EET/EEST)", region: "Europe", offset: 2 },
  { id: "Europe/Dublin", name: "Dublin (GMT/IST)", region: "Europe", offset: 0 },
  { id: "Europe/Lisbon", name: "Lisbon (WET/WEST)", region: "Europe", offset: 0 },
  { id: "Europe/Zurich", name: "Zurich (CET/CEST)", region: "Europe", offset: 1 },
  
  // Asia
  { id: "Asia/Dubai", name: "Dubai (GST)", region: "Asia", offset: 4 },
  { id: "Asia/Kolkata", name: "Mumbai/Kolkata (IST)", region: "Asia", offset: 5.5 },
  { id: "Asia/Shanghai", name: "Shanghai (CST)", region: "Asia", offset: 8 },
  { id: "Asia/Hong_Kong", name: "Hong Kong (HKT)", region: "Asia", offset: 8 },
  { id: "Asia/Tokyo", name: "Tokyo (JST)", region: "Asia", offset: 9 },
  { id: "Asia/Seoul", name: "Seoul (KST)", region: "Asia", offset: 9 },
  { id: "Asia/Singapore", name: "Singapore (SGT)", region: "Asia", offset: 8 },
  { id: "Asia/Bangkok", name: "Bangkok (ICT)", region: "Asia", offset: 7 },
  { id: "Asia/Jakarta", name: "Jakarta (WIB)", region: "Asia", offset: 7 },
  { id: "Asia/Manila", name: "Manila (PHT)", region: "Asia", offset: 8 },
  { id: "Asia/Taipei", name: "Taipei (CST)", region: "Asia", offset: 8 },
  { id: "Asia/Kuala_Lumpur", name: "Kuala Lumpur (MYT)", region: "Asia", offset: 8 },
  { id: "Asia/Ho_Chi_Minh", name: "Ho Chi Minh (ICT)", region: "Asia", offset: 7 },
  { id: "Asia/Karachi", name: "Karachi (PKT)", region: "Asia", offset: 5 },
  { id: "Asia/Dhaka", name: "Dhaka (BST)", region: "Asia", offset: 6 },
  { id: "Asia/Tehran", name: "Tehran (IRST)", region: "Asia", offset: 3.5 },
  { id: "Asia/Jerusalem", name: "Jerusalem (IST)", region: "Asia", offset: 2 },
  { id: "Asia/Riyadh", name: "Riyadh (AST)", region: "Asia", offset: 3 },
  { id: "Asia/Kuwait", name: "Kuwait (AST)", region: "Asia", offset: 3 },
  { id: "Asia/Doha", name: "Doha (AST)", region: "Asia", offset: 3 },
  { id: "Asia/Muscat", name: "Muscat (GST)", region: "Asia", offset: 4 },
  { id: "Asia/Yangon", name: "Yangon (MMT)", region: "Asia", offset: 6.5 },
  { id: "Asia/Kathmandu", name: "Kathmandu (NPT)", region: "Asia", offset: 5.75 },
  
  // Africa
  { id: "Africa/Cairo", name: "Cairo (EET)", region: "Africa", offset: 2 },
  { id: "Africa/Lagos", name: "Lagos (WAT)", region: "Africa", offset: 1 },
  { id: "Africa/Nairobi", name: "Nairobi (EAT)", region: "Africa", offset: 3 },
  { id: "Africa/Johannesburg", name: "Johannesburg (SAST)", region: "Africa", offset: 2 },
  { id: "Africa/Casablanca", name: "Casablanca (WET)", region: "Africa", offset: 0 },
  { id: "Africa/Algiers", name: "Algiers (CET)", region: "Africa", offset: 1 },
  { id: "Africa/Tunis", name: "Tunis (CET)", region: "Africa", offset: 1 },
  
  // Oceania
  { id: "Australia/Sydney", name: "Sydney (AEDT/AEST)", region: "Oceania", offset: 10 },
  { id: "Australia/Melbourne", name: "Melbourne (AEDT/AEST)", region: "Oceania", offset: 10 },
  { id: "Australia/Brisbane", name: "Brisbane (AEST)", region: "Oceania", offset: 10 },
  { id: "Australia/Perth", name: "Perth (AWST)", region: "Oceania", offset: 8 },
  { id: "Australia/Adelaide", name: "Adelaide (ACDT/ACST)", region: "Oceania", offset: 9.5 },
  { id: "Pacific/Auckland", name: "Auckland (NZDT/NZST)", region: "Oceania", offset: 12 },
  { id: "Pacific/Fiji", name: "Fiji (FJT)", region: "Oceania", offset: 12 },
  { id: "Pacific/Guam", name: "Guam (ChST)", region: "Oceania", offset: 10 },
  
  // UTC
  { id: "UTC", name: "UTC (Coordinated Universal Time)", region: "UTC", offset: 0 },
];

interface TimeConverterPageProps {
  onWorkStateChange?: (hasWork: boolean) => void;
}

export default function TimeConverterPage({ onWorkStateChange }: TimeConverterPageProps = {}) {
  // Get current date and time
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(now.toTimeString().slice(0, 5));
  const [sourceZone, setSourceZone] = useState("America/New_York");
  const [targetZone, setTargetZone] = useState("Europe/London");
  const [convertedDateTime, setConvertedDateTime] = useState<Date | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: string }>({});
  const [use24Hour, setUse24Hour] = useState(false);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  // Update current times every second
  useEffect(() => {
    const updateCurrentTimes = () => {
      const times: { [key: string]: string } = {};
      [sourceZone, targetZone].forEach(zone => {
        const time = new Date().toLocaleString('en-US', {
          timeZone: zone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: !use24Hour,
        });
        times[zone] = time;
      });
      setCurrentTimes(times);
    };

    updateCurrentTimes();
    const interval = setInterval(updateCurrentTimes, 1000);
    return () => clearInterval(interval);
  }, [sourceZone, targetZone, use24Hour]);

  // Perform conversion
  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      setConvertedDateTime(null);
      return;
    }

    try {
      // Create a date string in the source timezone
      const dateTimeString = `${selectedDate}T${selectedTime}:00`;
      
      // Parse the date as if it's in the source timezone
      const sourceDate = new Date(dateTimeString);
      
      // Get the offset difference
      const sourceOffset = new Date().toLocaleString('en-US', { 
        timeZone: sourceZone, 
        timeZoneName: 'short' 
      });
      const targetOffset = new Date().toLocaleString('en-US', { 
        timeZone: targetZone, 
        timeZoneName: 'short' 
      });

      // Convert using timezone-aware conversion
      const converted = new Date(sourceDate.toLocaleString('en-US', { timeZone: sourceZone }));
      const targetDateTime = new Date(converted.toLocaleString('en-US', { timeZone: targetZone }));
      
      setConvertedDateTime(targetDateTime);
    } catch (error) {
      console.error('Conversion error:', error);
      setConvertedDateTime(null);
    }
  }, [selectedDate, selectedTime, sourceZone, targetZone]);

  // Format date and time for display
  const formatDateTime = (date: Date | null, timezone: string): string => {
    if (!date) return "";
    
    try {
      return date.toLocaleString('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !use24Hour,
        timeZoneName: 'short',
      });
    } catch {
      return "";
    }
  };

  // Get timezone abbreviation
  const getTimezoneAbbr = (timezone: string): string => {
    const abbr = new Date().toLocaleString('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).split(', ')[1] || '';
    return abbr;
  };

  // Swap time zones
  const handleSwap = () => {
    const temp = sourceZone;
    setSourceZone(targetZone);
    setTargetZone(temp);
  };

  // Copy result
  const handleCopy = () => {
    if (convertedDateTime) {
      const formatted = formatDateTime(convertedDateTime, targetZone);
      navigator.clipboard.writeText(formatted);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Set to current time
  const handleSetNow = () => {
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    setSelectedTime(now.toTimeString().slice(0, 5));
  };

  // Filter time zones based on search
  const filteredFromZones = TIME_ZONES.filter(zone =>
    zone.name.toLowerCase().includes(searchFrom.toLowerCase()) ||
    zone.region.toLowerCase().includes(searchFrom.toLowerCase())
  );

  const filteredToZones = TIME_ZONES.filter(zone =>
    zone.name.toLowerCase().includes(searchTo.toLowerCase()) ||
    zone.region.toLowerCase().includes(searchTo.toLowerCase())
  );

  // Get selected timezone data
  const sourceZoneData = TIME_ZONES.find(z => z.id === sourceZone);
  const targetZoneData = TIME_ZONES.find(z => z.id === targetZone);

  // Related tools for this page
  const relatedTools = [
    {
      name: "Unit Converter",
      description: "Convert measurement units",
      icon: Calculator,
      onClick: () => window.location.href = "/unit-converter",
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
      <SeoHead path="/time-converter" />
      <ToolJsonLd path="/time-converter" />

      {/* Header Section */}
      <ToolPageHero 
        title="Time Zone Converter" 
        description="Convert times between different time zones instantly. Support for 80+ time zones worldwide with DST awareness, current time display, and precise conversion — completely free and easy to use."
      />

      <ToolPageLayout>
        <MobileStickyAd topOffset={64} height={100} />

        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-6">
          {/* Format Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">Time Format</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUse24Hour(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  !use24Hour ? 'bg-white shadow-sm text-purple-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                12 Hour
              </button>
              <button
                onClick={() => setUse24Hour(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  use24Hour ? 'bg-white shadow-sm text-purple-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                24 Hour
              </button>
            </div>
          </div>

          {/* Conversion Area */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
            {/* From Zone */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">From Time Zone</Label>
                <Input
                  type="text"
                  placeholder="Search time zone..."
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="mb-2"
                />
                <select
                  value={sourceZone}
                  onChange={(e) => setSourceZone(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 focus:border-purple-500 focus:outline-none transition-colors text-sm max-h-48"
                  size={5}
                >
                  {filteredFromZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} (UTC{zone.offset >= 0 ? '+' : ''}{zone.offset})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="sourceDate" className="text-sm font-medium mb-2 block">
                    Date
                  </Label>
                  <Input
                    type="date"
                    id="sourceDate"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="sourceTime" className="text-sm font-medium mb-2 block">
                    Time
                  </Label>
                  <Input
                    type="time"
                    id="sourceTime"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="h-12"
                  />
                </div>

                <button
                  onClick={handleSetNow}
                  className="w-full px-4 py-2 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium text-purple-700 flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Set to Current Time
                </button>
              </div>

              {/* Current Time Display */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Sunrise className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-purple-900">Current Time</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{currentTimes[sourceZone]}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {sourceZoneData?.name} · {getTimezoneAbbr(sourceZone)}
                </p>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center lg:pt-32">
              <button
                onClick={handleSwap}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl rotate-0 lg:rotate-90"
                title="Swap time zones"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>

            {/* To Zone */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">To Time Zone</Label>
                <Input
                  type="text"
                  placeholder="Search time zone..."
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="mb-2"
                />
                <select
                  value={targetZone}
                  onChange={(e) => setTargetZone(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 focus:border-purple-500 focus:outline-none transition-colors text-sm max-h-48"
                  size={5}
                >
                  {filteredToZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} (UTC{zone.offset >= 0 ? '+' : ''}{zone.offset})
                    </option>
                  ))}
                </select>
              </div>

              {convertedDateTime && (
                <>
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                    <Label className="text-sm font-medium mb-2 block">Converted Date & Time</Label>
                    <p className="text-lg font-bold text-gray-900 mb-2">
                      {convertedDateTime.toLocaleString('en-US', {
                        timeZone: targetZone,
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {convertedDateTime.toLocaleString('en-US', {
                        timeZone: targetZone,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: !use24Hour,
                      })}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      {targetZoneData?.name} · {getTimezoneAbbr(targetZone)}
                    </p>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Result
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Current Time Display */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Sunrise className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-purple-900">Current Time</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{currentTimes[targetZone]}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {targetZoneData?.name} · {getTimezoneAbbr(targetZone)}
                </p>
              </div>
            </div>
          </div>

          {/* Result Display Card */}
          {convertedDateTime && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-blue-900 mb-2">Time Zone Conversion</p>
                  <p className="text-sm text-gray-700 mb-3">
                    <span className="font-semibold">{selectedDate} {selectedTime}</span> in{' '}
                    <span className="font-semibold">{sourceZoneData?.name}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    is equivalent to{' '}
                    <span className="font-semibold text-purple-700">
                      {formatDateTime(convertedDateTime, targetZone)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-900">DST Aware & Accurate</p>
                <p className="text-xs text-green-700 mt-1">
                  Our time zone converter automatically adjusts for Daylight Saving Time (DST) changes, ensuring accurate conversions year-round across all supported time zones.
                </p>
              </div>
            </div>
          </div>
        </div>

        <RelatedToolsSection tools={relatedTools} introText="These tools work well with time zone conversion." />
        
        <ToolDefinitionSection
          title="What Is a Time Zone Converter?"
          content="A time zone converter is a tool that transforms date and time from one time zone to another. Perfect for scheduling international meetings, coordinating with remote teams, planning travel, or converting event times — completely free, DST-aware, and supporting 80+ time zones worldwide."
        />
        
        <HowItWorksSteps 
          title="How It Works" 
          subtitle="Convert time zones in four simple steps" 
          introText="Follow these steps to convert times between any time zones instantly." 
          steps={STEPS} 
        />
        
        <WhyChooseSection 
          title={WHY_CHOOSE_WORKFLOWPRO.title} 
          subtitle={WHY_CHOOSE_WORKFLOWPRO.subtitle} 
          introText={WHY_CHOOSE_WORKFLOWPRO.introText} 
          features={WHY_CHOOSE_WORKFLOWPRO.features} 
        />
        
        <UseCasesSection
          title="Popular Uses for Time Zone Converter"
          useCases={[
            "Schedule international business meetings",
            "Coordinate with remote team members across continents",
            "Plan travel itineraries and flight times",
            "Convert event times for global conferences",
            "Arrange calls with clients in different countries",
            "Manage distributed team schedules",
            "Calculate time differences for online events",
            "Schedule webinars for global audiences",
            "Coordinate project deadlines across time zones",
          ]}
        />
        
        <ToolFAQSection
          faqs={[
            { question: "How many time zones are supported?", answer: "We support 80+ major time zones from around the world, including all major cities and regions across Americas, Europe, Asia, Africa, and Oceania." },
            { question: "Does this account for Daylight Saving Time?", answer: "Yes! Our converter automatically adjusts for DST (Daylight Saving Time) changes, ensuring accurate conversions throughout the year." },
            { question: "Can I see the current time in different zones?", answer: "Yes, we display live current times for both source and target time zones, updating every second." },
            { question: "Can I switch between 12-hour and 24-hour format?", answer: "Absolutely! Toggle between 12-hour (AM/PM) and 24-hour format using the format selector at the top." },
            { question: "Can I copy the converted time?", answer: "Yes, click the 'Copy Result' button to copy the full converted date and time to your clipboard." },
            { question: "Is the conversion accurate?", answer: "Yes, we use native JavaScript timezone conversion which is highly accurate and accounts for all timezone rules and DST changes." },
          ]}
        />
        
        <ToolSEOFooter
          title="About WorkflowPro's Time Zone Converter"
          content="WorkflowPro's time zone converter: 80+ time zones, DST-aware, live current times, 12/24 hour format, instant conversion, swap function — perfect for remote workers, travelers, international businesses, and anyone coordinating across time zones. Fast, accurate, always free."
        />
      </ToolPageLayout>
    </>
  );
}
