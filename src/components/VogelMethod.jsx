import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Minus, ArrowRight } from 'lucide-react';

const VogelMethod = () => {
  const [sources, setSources] = useState(3);
  const [destinations, setDestinations] = useState(3);
  const [supply, setSupply] = useState(Array(3).fill(''));
  const [demand, setDemand] = useState(Array(3).fill(''));
  const [costMatrix, setCostMatrix] = useState(
    Array.from({ length: 3 }, () => Array(3).fill(''))
  );
  const [allocation, setAllocation] = useState([]);
  const [totalCost, setTotalCost] = useState(null);
  const [steps, setSteps] = useState([]);

  // Update matrices when dimensions change
  useEffect(() => {
    setSupply(prev => {
      const newSupply = Array(sources).fill('');
      for (let i = 0; i < Math.min(prev.length, sources); i++) {
        newSupply[i] = prev[i];
      }
      return newSupply;
    });

    setCostMatrix(prev => {
      const newMatrix = Array.from({ length: sources }, () => Array(destinations).fill(''));
      for (let i = 0; i < Math.min(prev.length, sources); i++) {
        for (let j = 0; j < Math.min(prev[i]?.length || 0, destinations); j++) {
          newMatrix[i][j] = prev[i][j];
        }
      }
      return newMatrix;
    });

    // Clear allocation, total cost, and steps when dimensions change
    setAllocation([]);
    setTotalCost(null);
    setSteps([]);
  }, [sources, destinations]);

  useEffect(() => {
    setDemand(prev => {
      const newDemand = Array(destinations).fill('');
      for (let i = 0; i < Math.min(prev.length, destinations); i++) {
        newDemand[i] = prev[i];
      }
      return newDemand;
    });
  }, [destinations]);

  const applyDims = () => {
    setSupply(Array(sources).fill(''));
    setDemand(Array(destinations).fill(''));
    setCostMatrix(
      Array.from({ length: sources }, () => Array(destinations).fill(''))
    );
    setAllocation([]);
    setTotalCost(null);
    setSteps([]);
  };

  const updateSupply = (i, val) => {
    const arr = [...supply]; 
    arr[i] = val; 
    setSupply(arr);
  };

  const updateDemand = (j, val) => {
    const arr = [...demand]; 
    arr[j] = val; 
    setDemand(arr);
  };

  const updateCost = (i, j, val) => {
    const mat = costMatrix.map(r => [...r]); 
    mat[i][j] = val; 
    setCostMatrix(mat);
  };

  const calculatePenalty = (matrix, supply, demand, eliminatedRows, eliminatedCols) => {
    const rowPenalties = [];
    const colPenalties = [];

    // Hitung penalty untuk setiap baris
    for (let i = 0; i < matrix.length; i++) {
      if (eliminatedRows.has(i)) {
        rowPenalties[i] = -1;
        continue;
      }
      
      const availableCosts = [];
      for (let j = 0; j < matrix[i].length; j++) {
        if (!eliminatedCols.has(j)) {
          availableCosts.push(matrix[i][j]);
        }
      }
      
      if (availableCosts.length <= 1) {
        rowPenalties[i] = 0;
      } else {
        availableCosts.sort((a, b) => a - b);
        rowPenalties[i] = availableCosts[1] - availableCosts[0];
      }
    }

    // Hitung penalty untuk setiap kolom
    for (let j = 0; j < matrix[0].length; j++) {
      if (eliminatedCols.has(j)) {
        colPenalties[j] = -1;
        continue;
      }
      
      const availableCosts = [];
      for (let i = 0; i < matrix.length; i++) {
        if (!eliminatedRows.has(i)) {
          availableCosts.push(matrix[i][j]);
        }
      }
      
      if (availableCosts.length <= 1) {
        colPenalties[j] = 0;
      } else {
        availableCosts.sort((a, b) => a - b);
        colPenalties[j] = availableCosts[1] - availableCosts[0];
      }
    }

    return { rowPenalties, colPenalties };
  };

  const findMinCostInRowOrCol = (matrix, supply, demand, eliminatedRows, eliminatedCols, isRow, index) => {
    let minCost = Infinity;
    let minPos = { i: -1, j: -1 };

    if (isRow) {
      for (let j = 0; j < matrix[index].length; j++) {
        if (!eliminatedCols.has(j) && matrix[index][j] < minCost) {
          minCost = matrix[index][j];
          minPos = { i: index, j };
        }
      }
    } else {
      for (let i = 0; i < matrix.length; i++) {
        if (!eliminatedRows.has(i) && matrix[i][index] < minCost) {
          minCost = matrix[i][index];
          minPos = { i, j: index };
        }
      }
    }

    return minPos;
  };

  const calculate = () => {
    const m = sources, n = destinations;
    const sup = supply.map(x => Number(x) || 0);
    const dem = demand.map(x => Number(x) || 0);
    
    // Validate input
    if (sup.some(x => x <= 0) || dem.some(x => x <= 0)) {
      alert('Harap isi semua nilai pasokan dan permintaan dengan angka positif');
      return;
    }

    if (costMatrix.some(row => row.some(cell => cell === '' || isNaN(Number(cell))))) {
      alert('Harap isi semua nilai biaya dengan angka');
      return;
    }

    const costs = costMatrix.map(row => row.map(Number));
    
    // Cek keseimbangan supply dan demand
    const totalSupply = sup.reduce((a, b) => a + b, 0);
    const totalDemand = dem.reduce((a, b) => a + b, 0);
    
    if (totalSupply !== totalDemand) {
      alert('Total supply harus sama dengan total demand untuk menggunakan metode Vogel!');
      return;
    }

    const alloc = Array.from({ length: m }, () => Array(n).fill(0));
    const tempSupply = [...sup];
    const tempDemand = [...dem];
    const eliminatedRows = new Set();
    const eliminatedCols = new Set();
    const stepDetails = [];
    let stepNum = 1;

    while (eliminatedRows.size < m && eliminatedCols.size < n) {
      // Hitung penalty
      const { rowPenalties, colPenalties } = calculatePenalty(costs, tempSupply, tempDemand, eliminatedRows, eliminatedCols);
      
      // Cari penalty tertinggi
      let maxPenalty = -1;
      let selectedRow = -1;
      let selectedCol = -1;
      let isRowSelected = true;

      // Cek penalty baris
      for (let i = 0; i < rowPenalties.length; i++) {
        if (rowPenalties[i] > maxPenalty) {
          maxPenalty = rowPenalties[i];
          selectedRow = i;
          isRowSelected = true;
        }
      }

      // Cek penalty kolom
      for (let j = 0; j < colPenalties.length; j++) {
        if (colPenalties[j] > maxPenalty) {
          maxPenalty = colPenalties[j];
          selectedCol = j;
          isRowSelected = false;
        }
      }

      // Cari sel dengan biaya minimum di baris/kolom terpilih
      let selectedCell;
      if (isRowSelected) {
        selectedCell = findMinCostInRowOrCol(costs, tempSupply, tempDemand, eliminatedRows, eliminatedCols, true, selectedRow);
      } else {
        selectedCell = findMinCostInRowOrCol(costs, tempSupply, tempDemand, eliminatedRows, eliminatedCols, false, selectedCol);
      }

      const { i, j } = selectedCell;
      
      // Alokasi
      const allocation = Math.min(tempSupply[i], tempDemand[j]);
      alloc[i][j] = allocation;
      tempSupply[i] -= allocation;
      tempDemand[j] -= allocation;

      stepDetails.push({
        step: stepNum++,
        rowPenalties: [...rowPenalties],
        colPenalties: [...colPenalties],
        maxPenalty,
        selectedCell: { i, j },
        allocation,
        isRowSelected,
        selectedIndex: isRowSelected ? selectedRow : selectedCol
      });

      // Eliminasi baris/kolom yang sudah habis
      if (tempSupply[i] === 0) eliminatedRows.add(i);
      if (tempDemand[j] === 0) eliminatedCols.add(j);
    }

    // Hitung total biaya
    let total = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        total += alloc[i][j] * costs[i][j];
      }
    }

    setAllocation(alloc);
    setTotalCost(total);
    setSteps(stepDetails);
  };

  const adjustDimension = (type, delta) => {
    if (type === 'sources') {
      const newVal = Math.max(1, sources + delta);
      setSources(newVal);
    } else {
      const newVal = Math.max(1, destinations + delta);
      setDestinations(newVal);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-800 font-sans" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
      {/* Header */}
      <div className="relative overflow-hidden mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100"></div>
        <div className="relative px-3 py-6 sm:px-6 sm:py-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Metode Vogel (VAM)
              </h1>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto">
              Temukan solusi transportasi optimal dengan visualisasi yang elegan
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-6 sm:pb-10">
        {/* Control Panel */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ">
            {/* Sources Control */}
            <div className="group">
              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-sm hover:shadow-blue-100">
                <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Jumlah Asal
                </label>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => adjustDimension('sources', -1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  >
                    <Minus className="w-3 h-3 text-blue-600" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      min={1}
                      value={sources}
                      onChange={e => setSources(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-50 border border-blue-100 rounded-lg text-center text-xs sm:text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-100 outline-none transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={() => adjustDimension('sources', 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  >
                    <Plus className="w-3 h-3 text-blue-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Destinations Control */}
            <div className="group">
              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-sm hover:shadow-blue-100">
                <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Jumlah Tujuan
                </label>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => adjustDimension('destinations', -1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  >
                    <Minus className="w-3 h-3 text-blue-600" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      min={1}
                      value={destinations}
                      onChange={e => setDestinations(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-50 border border-blue-100 rounded-lg text-center text-xs sm:text-sm font-bold focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-100 outline-none transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={() => adjustDimension('destinations', 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                  >
                    <Plus className="w-3 h-3 text-blue-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="group md:col-span-2 lg:col-span-1">
              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-sm hover:shadow-blue-100 h-full flex items-end">
                <button
                  onClick={applyDims}
                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-1.5 text-xs sm:text-sm"
                >
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Terapkan Dimensi</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transportation Matrix */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl border border-blue-100 overflow-hidden shadow-sm sm:shadow">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <th className="p-2 sm:p-3 text-left font-bold text-gray-700 ">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-[11px] sm:text-xs pl-10">Asal/Tujuan</span>
                      </div>
                    </th>
                    
                    {demand.map((_, j) => (
                      <th key={j} className="p-2 sm:p-3 text-center font-bold text-blue-700 min-w-[90px] sm:min-w-[110px]">
                        <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-[11px] sm:text-xs">Tujuan {j+1}</span>
                        </div>
                      </th>
                    ))}
                    
                    <th className="p-2 sm:p-3 text-center font-bold text-blue-700 min-w-[90px] sm:min-w-[110px]">
                      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-[11px] sm:text-xs">Pasokan</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: sources }).map((_, i) => (
                    <tr key={i} className="border-t border-blue-50 hover:bg-blue-50 transition-colors">
                      <td className="p-2 sm:p-3 font-bold text-blue-700 bg-blue-50">
                        <div className="flex items-center gap-1.5 sm:gap-2 pl-4">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-[11px] sm:text-xs">Asal {i+1}</span>
                        </div>
                      </td>
                      {Array.from({ length: destinations }).map((_, j) => (
                        <td key={j} className="p-1 sm:p-2">
                          <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                            <div className="relative">
                              <input
                                type="number"
                                placeholder="Biaya"
                                value={costMatrix[i]?.[j] || ''}
                                onChange={e => updateCost(i, j, e.target.value)}
                                className="w-[60px] sm:w-[70px] h-7 sm:h-8 px-1 sm:px-1.5 text-[11px] sm:text-xs text-center bg-white border border-blue-100 rounded-md sm:rounded-lg focus:border-blue-500 focus:bg-white focus:ring-1 sm:focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                              />
                              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                            </div>
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md sm:rounded-lg font-bold text-[10px] sm:text-xs transition-all duration-300 ${
                              allocation[i]?.[j] 
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm sm:shadow-md shadow-blue-200' 
                                : 'bg-blue-50 border border-blue-100 text-gray-500 hover:border-blue-200'
                            }`}>
                              {allocation[i]?.[j] || '0'}
                            </div>
                          </div>
                        </td>
                      ))}
                      <td className="p-1 sm:p-2">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            placeholder="Pasokan"
                            value={supply[i] || ''}
                            onChange={e => updateSupply(i, e.target.value)}
                            className="w-[70px] sm:w-[80px] h-7 sm:h-8 px-1 sm:px-1.5 text-[11px] sm:text-xs text-center bg-blue-50 border border-blue-200 rounded-md sm:rounded-lg font-medium focus:border-blue-500 focus:bg-white focus:ring-1 sm:focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="border border-blue-50">
                    <td className="p-4 sm:p-3 font-bold text-blue-700 bg-blue-50">
                      <div className="flex items-center gap-1.5 sm:gap-2 pl-4 pt-4 pb-8">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-[11px] sm:text-xs">Permintaan</span>
                      </div>
                    </td>
                    {demand.map((val, j) => (
                      <td key={j} className="p-1 sm:p-2">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            placeholder="Permintaan"
                            value={val}
                            onChange={e => updateDemand(j, e.target.value)}
                            className="w-[90px] sm:w-[100px] h-7 sm:h-8 px-1 sm:px-1.5 text-[11px] sm:text-xs text-center bg-blue-50 border border-blue-200 rounded-md sm:rounded-lg font-medium focus:border-blue-500 focus:bg-white focus:ring-1 sm:focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                          />
                        </div>
                      </td>
                    ))}
                    <td className="p-1 sm:p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <button
            onClick={calculate}
            className="group relative px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-lg shadow transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm sm:hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            <div className="relative flex items-center gap-1.5 sm:gap-2">
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">HITUNG SOLUSI OPTIMAL</span>
            </div>
          </button>
        </div>

        {/* Result Display */}
        {totalCost !== null && (
          <div className="animate-in slide-in-from-bottom duration-300">
            <div className="bg-white rounded-lg sm:rounded-xl border border-blue-200 p-4 sm:p-6 shadow">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-800">Solusi Optimal Ditemukan</h3>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-md sm:rounded-lg p-3 sm:p-4 border border-blue-200">
                  <p className="text-sm sm:text-base font-bold">
                    <span className="text-gray-700">Total Biaya: </span>
                    <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent ml-1">
                      {totalCost.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Steps Display */}
        {steps.length > 0 && (
          <div className="mt-6 sm:mt-8 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white rounded-lg sm:rounded-xl border border-blue-200 p-4 sm:p-6 shadow">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Langkah-langkah Perhitungan Vogel
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {steps.map((step, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="font-semibold text-blue-800 mb-2">
                      Langkah {step.step}: Alokasi {step.allocation} unit ke sel ({step.selectedCell.i + 1}, {step.selectedCell.j + 1})
                    </div>
                    <div className="text-sm text-gray-600">
                      Penalty tertinggi: {step.maxPenalty} pada {step.isRowSelected ? `baris ${step.selectedIndex + 1}` : `kolom ${step.selectedIndex + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VogelMethod;