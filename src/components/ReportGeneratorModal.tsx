import React from 'react';
import { X, Download, Printer, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  farms: any[];
  crops: any[];
  soilTests: any[];
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  farms,
  crops,
  soilTests,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const downloadCSV = () => {
    // Build CSV Content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += '--- AGRITECH FARM MANAGEMENT AUDIT REPORT ---\r\n';
    csvContent += `Generated On,${new Date().toISOString()}\r\n\r\n`;

    // 1. Farms section
    csvContent += 'FARMS & LAND HOLDINGS\r\n';
    csvContent += 'Farm ID,Name,Location,Area (Acres),Soil Type,Irrigation Type\r\n';
    farms.forEach(f => {
      csvContent += `"${f.id}","${f.name}","${f.location}",${f.area},"${f.soilType}","${f.irrigationType}"\r\n`;
    });
    csvContent += '\r\n';

    // 2. Crops section
    csvContent += 'CROPS & PRODUCTION\r\n';
    csvContent += 'Crop ID,Crop Name,Variety,Stage,Status,Planted Area (Acres),Expected Yield (Qtl),Sowing Date,Harvest Date\r\n';
    crops.forEach(c => {
      csvContent += `"${c.id}","${c.name}","${c.variety}","${c.stage}","${c.status}",${c.plantedArea},${c.expectedYield},"${c.sowingDate}","${c.expectedHarvest}"\r\n`;
    });
    csvContent += '\r\n';

    // 3. Soil Analysis section
    csvContent += 'SOIL CHEMICAL & NUTRIENT LOGS\r\n';
    csvContent += 'Test ID,Farm ID,Nitrogen (N),Phosphorus (P),Potassium (K),pH,Moisture (%),Organic Carbon (%),Status\r\n';
    soilTests.forEach(s => {
      csvContent += `"${s.id}","${s.farmId}",${s.nitrogen},${s.phosphorus},${s.potassium},${s.ph},${s.moisture},${s.organicCarbon || 0.65},"${s.status}"\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgriTech_Farm_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-2xl p-6 shadow-xl relative animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Agronomic Export</span>
            <span aria-hidden="true">·</span>
            <span>Comprehensive Dossier</span>
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {t.dashboard.downloadReport}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Generate audit-ready reports for banks, crop insurance claims, and government subsidy audits.
          </p>
        </div>

        {/* Report Preview Summary Card */}
        <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 mb-6 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-stone-500">Report Scope:</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Complete Farm Holdings & Seasonal Crops
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500">Data Records Included:</span>
            <span className="font-mono tabular-nums text-stone-800 dark:text-stone-200">
              {farms.length} Farms · {crops.length} Crop Plots · {soilTests.length} Soil Tests
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500">Compliance Benchmark:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              ICAR & Ministry of Agriculture Standards
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={downloadCSV}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download CSV Spreadsheet</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white font-semibold text-sm shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
