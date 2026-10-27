import React, { useState } from 'react';
import { Layers, Plus, Sprout, MapPin, Droplets, Calendar, CheckCircle2, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { CropCard } from '../components/CropCard.tsx';
import { api } from '../services/api.ts';

interface FarmsAndCropsPageProps {
  farms: any[];
  crops: any[];
  onRefresh: () => void;
}

export const FarmsAndCropsPage: React.FC<FarmsAndCropsPageProps> = ({
  farms,
  crops,
  onRefresh,
}) => {
  const { t } = useLanguage();

  const [selectedFarmId, setSelectedFarmId] = useState<string>('all');
  const [showAddFarmModal, setShowAddFarmModal] = useState<boolean>(false);
  const [showAddCropModal, setShowAddCropModal] = useState<boolean>(false);

  // New Farm form state
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmArea, setFarmArea] = useState('5.0');
  const [farmSoil, setFarmSoil] = useState('Black');
  const [farmIrrigation, setFarmIrrigation] = useState('Drip');

  // New Crop form state
  const [cropFarmId, setCropFarmId] = useState(farms[0]?.id || 'farm_1');
  const [cropName, setCropName] = useState('Bt Cotton');
  const [cropVariety, setCropVariety] = useState('Bollgard II Supreme');
  const [sowingDate, setSowingDate] = useState('2026-06-15');
  const [expectedHarvest, setExpectedHarvest] = useState('2026-11-20');
  const [cropArea, setCropArea] = useState('3.5');
  const [cropYield, setCropYield] = useState('30');
  const [cropNotes, setCropNotes] = useState('');

  const filteredCrops =
    selectedFarmId === 'all'
      ? crops
      : crops.filter(c => c.farmId === selectedFarmId || c.farm?._id === selectedFarmId);

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createFarm({
      name: farmName,
      location: farmLocation,
      area: Number(farmArea),
      areaUnit: 'acres',
      soilType: farmSoil,
      irrigationType: farmIrrigation,
    });
    setShowAddFarmModal(false);
    setFarmName('');
    setFarmLocation('');
    onRefresh();
  };

  const handleCreateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createCrop({
      farmId: cropFarmId,
      name: cropName,
      variety: cropVariety,
      sowingDate,
      expectedHarvest,
      stage: 'Vegetative',
      plantedArea: Number(cropArea),
      expectedYield: Number(cropYield),
      notes: cropNotes,
    });
    setShowAddCropModal(false);
    onRefresh();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
            <span>Land & Crop Agronomy</span>
            <span aria-hidden="true">·</span>
            <span>Lifecycle Tracking</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {t.farms.title}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            {t.farms.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddFarmModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.farms.addFarm}</span>
          </button>

          <button
            onClick={() => setShowAddCropModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>{t.farms.addNewCrop}</span>
          </button>
        </div>
      </div>

      {/* Farms Grid */}
      <div>
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3">
          Land Holdings ({farms.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farms.map(farm => (
            <div
              key={farm.id || farm._id}
              onClick={() => setSelectedFarmId(farm.id || farm._id)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                selectedFarmId === (farm.id || farm._id)
                  ? 'border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {farm.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{farm.location}</span>
                  </div>
                </div>
                <span className="font-mono tabular-nums text-sm font-bold px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                  {farm.area} {farm.areaUnit || 'Acres'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-stone-100 dark:border-stone-800">
                <div>
                  <span className="text-stone-500 block mb-0.5">Soil Type</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{farm.soilType}</span>
                </div>
                <div>
                  <span className="text-stone-500 block mb-0.5">Irrigation</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{farm.irrigationType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Crops Section */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Crop Lifecycle Monitoring
            </h3>
            <p className="text-xs text-stone-500">
              Showing active crop plantings across selected land holding.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs">
            <button
              onClick={() => setSelectedFarmId('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedFarmId === 'all'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              All Plots ({crops.length})
            </button>
            {farms.map(f => (
              <button
                key={f.id || f._id}
                onClick={() => setSelectedFarmId(f.id || f._id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  selectedFarmId === (f.id || f._id)
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {f.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {filteredCrops.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <Sprout className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">No crops recorded for this farm</h4>
            <p className="text-xs text-stone-500 mt-1 mb-4">Register your sowing date to begin lifecycle tracking and pest alerts.</p>
            <button
              onClick={() => setShowAddCropModal(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
            >
              {t.farms.addNewCrop}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrops.map(crop => (
              <CropCard key={crop.id || crop._id} crop={crop} />
            ))}
          </div>
        )}
      </div>

      {/* Modal: Add Farm */}
      {showAddFarmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
              {t.farms.addFarm}
            </h3>
            <form onSubmit={handleCreateFarm} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.farms.farmName}
                </label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={e => setFarmName(e.target.value)}
                  placeholder="e.g. Krishna Valley Plot C"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.farms.location}
                </label>
                <input
                  type="text"
                  required
                  value={farmLocation}
                  onChange={e => setFarmLocation(e.target.value)}
                  placeholder="e.g. Wardhannapet, Warangal"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t.farms.area}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={farmArea}
                    onChange={e => setFarmArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t.farms.soilType}
                  </label>
                  <select
                    value={farmSoil}
                    onChange={e => setFarmSoil(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Black">Black Soil (Regur)</option>
                    <option value="Alluvial">Alluvial Soil</option>
                    <option value="Red">Red Sandy Loam</option>
                    <option value="Loamy">Loamy Soil</option>
                    <option value="Laterite">Laterite Soil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.farms.irrigationType}
                </label>
                <select
                  value={farmIrrigation}
                  onChange={e => setFarmIrrigation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="Drip">Drip Irrigation (Micro)</option>
                  <option value="Sprinkler">Sprinkler Irrigation</option>
                  <option value="Canal">Canal Irrigation</option>
                  <option value="Borewell">Borewell / Tube-well</option>
                  <option value="Rainfed">Rainfed (Dryland)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFarmModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Crop */}
      {showAddCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
              {t.farms.addNewCrop}
            </h3>
            <form onSubmit={handleCreateCrop} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Assign to Farm Plot
                </label>
                <select
                  value={cropFarmId}
                  onChange={e => setCropFarmId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  {farms.map(f => (
                    <option key={f.id || f._id} value={f.id || f._id}>
                      {f.name} ({f.area} Acres)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t.farms.cropName}
                  </label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={e => setCropName(e.target.value)}
                    placeholder="e.g. Bt Cotton"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t.farms.variety}
                  </label>
                  <input
                    type="text"
                    required
                    value={cropVariety}
                    onChange={e => setCropVariety(e.target.value)}
                    placeholder="e.g. Bollgard II"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t.farms.sowingDate}
                  </label>
                  <input
                    type="date"
                    required
                    value={sowingDate}
                    onChange={e => setSowingDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t.farms.expectedHarvest}
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedHarvest}
                    onChange={e => setExpectedHarvest(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Planted Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={cropArea}
                    onChange={e => setCropArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Expected Yield (Quintals)
                  </label>
                  <input
                    type="number"
                    required
                    value={cropYield}
                    onChange={e => setCropYield(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Agronomic Notes & Treatment
                </label>
                <textarea
                  rows={2}
                  value={cropNotes}
                  onChange={e => setCropNotes(e.target.value)}
                  placeholder="e.g. Basal dose of SSP and neem cake applied."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCropModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
