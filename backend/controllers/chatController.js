const ChatLog = require('../models/chatLogModel');
const Product = require('../models/productModel');
const { extractIntent, generateResponse } = require('../services/geminiService');
const { AppError, catchAsync } = require('../middleware/errorMiddleware');

const checkCompatibility = (parts) => {
  const issues = [];
  const details = {};

  const { cpu, gpu, motherboard, ram, storage, psu, case: pcCase, cooler } = parts;

  // 1. CPU & Motherboard socket compatibility
  if (cpu && motherboard) {
    const cpuSocket = cpu.specs?.socket || cpu.specs?.['Socket Type'];
    const mbSocket = motherboard.specs?.socket || motherboard.specs?.['Socket Type'];
    if (cpuSocket && mbSocket && cpuSocket.trim().toUpperCase() !== mbSocket.trim().toUpperCase()) {
      issues.push(`CPU socket (${cpuSocket}) is incompatible with Motherboard socket (${mbSocket}).`);
    } else {
      details.socketMatch = true;
    }
  }

  // 2. RAM & Motherboard type compatibility
  if (ram && motherboard) {
    const ramType = ram.specs?.type || ram.specs?.['Type'];
    const mbRamType = motherboard.specs?.memory_type || motherboard.specs?.['RAM Slots'];
    if (ramType && mbRamType && ramType.trim().toUpperCase() !== mbRamType.trim().toUpperCase()) {
      issues.push(`RAM type (${ramType}) is incompatible with Motherboard RAM type (${mbRamType}).`);
    } else {
      details.ramTypeMatch = true;
    }
  }

  // 3. PSU wattage sufficiency
  if (psu) {
    let estPower = 75; // System overhead
    if (cpu) estPower += Number(cpu.specs?.tdp_watts) || Number(cpu.specs?.TDP?.replace('W', '')) || 65;
    if (gpu) estPower += Number(gpu.specs?.tdp_watts) || Number(gpu.specs?.TDP?.replace('W', '')) || 150;

    const psuWattage = Number(psu.specs?.wattage) || Number(psu.specs?.Wattage?.replace('W', '')) || 0;
    
    details.estimatedPowerWatts = estPower;
    details.psuWattage = psuWattage;

    if (psuWattage > 0) {
      if (psuWattage < estPower + 100) {
        issues.push(`PSU wattage (${psuWattage}W) may be insufficient for the estimated system power load of ${estPower}W. Recommend at least ${estPower + 100}W.`);
      }
      if (gpu && gpu.specs?.recommended_psu_watts && psuWattage < Number(gpu.specs.recommended_psu_watts)) {
        issues.push(`PSU wattage (${psuWattage}W) is lower than the GPU manufacturer's recommended wattage of ${gpu.specs.recommended_psu_watts}W.`);
      }
    }
  }

  // 4. Cooler socket compatibility
  if (cooler && cpu) {
    const cpuSocket = cpu.specs?.socket || cpu.specs?.['Socket Type'];
    const coolerSockets = cooler.specs?.socket_compatibility || [];
    if (cpuSocket && coolerSockets.length > 0) {
      const isCompat = coolerSockets.some(s => s.trim().toUpperCase() === cpuSocket.trim().toUpperCase());
      if (!isCompat) {
        issues.push(`Cooler does not officially support CPU socket ${cpuSocket}. Supported sockets: ${coolerSockets.join(', ')}.`);
      } else {
        details.coolerSocketMatch = true;
      }
    }
  }

  // 5. Case Form Factor compatibility
  if (pcCase && motherboard) {
    const mbForm = motherboard.specs?.form_factor || motherboard.specs?.['Form Factor'];
    const caseSupport = pcCase.specs?.motherboard_support || [];
    if (mbForm && caseSupport.length > 0) {
      const isCompat = caseSupport.some(s => s.trim().toUpperCase() === mbForm.trim().toUpperCase());
      if (!isCompat) {
        issues.push(`Motherboard form factor (${mbForm}) is not supported by the Case (supports: ${caseSupport.join(', ')}).`);
      } else {
        details.formFactorMatch = true;
      }
    }
  }

  // 6. Case clearance - GPU length
  if (pcCase && gpu) {
    const gpuLenStr = gpu.specs?.Length || gpu.specs?.length_mm || '';
    const gpuLen = Number(gpuLenStr.replace('mm', '')) || 0;
    const maxGpu = Number(pcCase.specs?.max_gpu_length_mm) || Number(pcCase.specs?.['Max GPU Length']?.replace('mm', '')) || 0;

    if (gpuLen > 0 && maxGpu > 0 && gpuLen > maxGpu) {
      issues.push(`GPU length (${gpuLen}mm) exceeds the maximum GPU length supported by the Case (${maxGpu}mm).`);
    } else {
      details.gpuLengthFits = true;
    }
  }

  // 7. Case clearance - Cooler height
  if (pcCase && cooler) {
    const coolerHeightStr = cooler.specs?.height_mm || '';
    const coolerHeight = Number(coolerHeightStr) || 0;
    const maxCooler = Number(pcCase.specs?.max_cpu_cooler_height_mm) || 0;

    if (coolerHeight > 0 && maxCooler > 0 && coolerHeight > maxCooler) {
      issues.push(`CPU cooler height (${coolerHeight}mm) exceeds the maximum CPU cooler height supported by the Case (${maxCooler}mm).`);
    } else {
      details.coolerHeightFits = true;
    }
  }

  return {
    compatible: issues.length === 0,
    issues,
    details
  };
};

const findProductsInMessage = async (message) => {
  const allProducts = await Product.find({}, 'name brand category price specs');
  const mentioned = [];
  const msgLower = message.toLowerCase();
  
  for (const prod of allProducts) {
    const nameLower = prod.name.toLowerCase();
    
    if (msgLower.includes(nameLower)) {
      mentioned.push(prod);
    } else {
      const parts = nameLower.split(' ');
      if (parts.length >= 3) {
        const keywords = parts.slice(0, 4).join(' ');
        if (msgLower.includes(keywords)) {
          mentioned.push(prod);
        }
      }
    }
  }
  
  return mentioned;
};

const getRelevantProducts = async (intent, searchString) => {
  const categoriesMap = {
    CPUs: 10,
    GPUs: 10,
    Motherboards: 10,
    RAM: 5,
    Storage: 5,
    'Power Supplies': 5,
    Cases: 5,
    Cooling: 5
  };

  const results = {};

  for (const [catName, limitVal] of Object.entries(categoriesMap)) {
    if (intent.category && intent.category.toLowerCase() !== catName.toLowerCase() && !intent.budget && !intent.purpose) {
      continue;
    }

    const query = { category: catName };

    if (intent.brands && intent.brands.length > 0) {
      if (catName === 'CPUs' || catName === 'GPUs') {
        const matchingBrands = intent.brands.filter(b => 
          ['amd', 'intel', 'nvidia'].includes(b.toLowerCase())
        );
        if (matchingBrands.length > 0) {
          query.brand = { $in: matchingBrands.map(b => new RegExp(`^${b}$`, 'i')) };
        }
      }
    }

    let productsList = await Product.find(query)
      .sort({ rating: -1, price: 1 })
      .limit(limitVal * 3);

    if (searchString) {
      const searchTerms = searchString.toLowerCase().split(/\s+/);
      const filtered = productsList.filter(p => {
        const nameMatch = searchTerms.some(term => p.name.toLowerCase().includes(term));
        const descMatch = p.description && searchTerms.some(term => p.description.toLowerCase().includes(term));
        const brandMatch = p.brand && searchTerms.some(term => p.brand.toLowerCase().includes(term));
        return nameMatch || descMatch || brandMatch;
      });
      if (filtered.length > 0) {
        productsList = filtered;
      }
    }

    productsList.sort((a, b) => {
      const ratioA = a.rating / (a.price || 1);
      const ratioB = b.rating / (b.price || 1);
      return ratioB - ratioA;
    });

    results[catName] = productsList.slice(0, limitVal);
  }

  return results;
};

const recommendBuildForBudget = async (budget, purpose) => {
  const targetBudget = budget || 100000;
  
  const allProducts = await Product.find({});
  
  const cpus = allProducts.filter(p => p.category === 'CPUs');
  const gpus = allProducts.filter(p => p.category === 'GPUs');
  const mbs = allProducts.filter(p => p.category === 'Motherboards');
  const rams = allProducts.filter(p => p.category === 'RAM');
  const storages = allProducts.filter(p => p.category === 'Storage');
  const psus = allProducts.filter(p => p.category === 'Power Supplies');
  const cases = allProducts.filter(p => p.category === 'Cases');
  const coolers = allProducts.filter(p => p.category === 'Cooling');

  const sortByPrice = (arr) => arr.sort((a, b) => a.price - b.price);
  sortByPrice(cpus);
  sortByPrice(gpus);
  sortByPrice(mbs);
  sortByPrice(rams);
  sortByPrice(storages);
  sortByPrice(psus);
  sortByPrice(cases);
  sortByPrice(coolers);

  const budgetGpu = targetBudget * 0.40;
  const budgetCpu = targetBudget * 0.20;
  
  const selectedCpu = cpus.filter(c => c.price <= budgetCpu).pop() || cpus[0];
  const selectedGpu = gpus.filter(g => g.price <= budgetGpu).pop() || gpus[0];
  
  const cpuSocket = selectedCpu?.specs?.socket || selectedCpu?.specs?.['Socket Type'] || '';
  const compatibleMbs = mbs.filter(m => {
    const mbSocket = m.specs?.socket || m.specs?.['Socket Type'] || '';
    return mbSocket.toUpperCase() === cpuSocket.toUpperCase();
  });
  const selectedMb = compatibleMbs[0] || mbs[0];

  const mbRamType = selectedMb?.specs?.memory_type || selectedMb?.specs?.['RAM Slots'] || '';
  const compatibleRams = rams.filter(r => {
    const ramType = r.specs?.type || r.specs?.['Type'] || '';
    return ramType.toUpperCase() === mbRamType.toUpperCase();
  });
  const selectedRam = compatibleRams[0] || rams[0];

  const selectedStorage = storages[0];
  const selectedCase = cases[0];
  const selectedCooler = coolers.filter(c => {
    const coolerSockets = c.specs?.socket_compatibility || [];
    return coolerSockets.some(s => s.toUpperCase() === cpuSocket.toUpperCase());
  })[0] || coolers[0];

  let estPower = 75;
  if (selectedCpu) estPower += Number(selectedCpu.specs?.tdp_watts) || 65;
  if (selectedGpu) estPower += Number(selectedGpu.specs?.tdp_watts) || 150;
  
  const compatiblePsus = psus.filter(p => {
    const psuWattage = Number(p.specs?.wattage) || 0;
    return psuWattage >= estPower + 100;
  });
  const selectedPsu = compatiblePsus[0] || psus[0];

  return {
    cpu: selectedCpu,
    gpu: selectedGpu,
    motherboard: selectedMb,
    ram: selectedRam,
    storage: selectedStorage,
    psu: selectedPsu,
    case: selectedCase,
    cooler: selectedCooler,
    totalCost: (selectedCpu?.price || 0) + (selectedGpu?.price || 0) + (selectedMb?.price || 0) + (selectedRam?.price || 0) + (selectedStorage?.price || 0) + (selectedPsu?.price || 0) + (selectedCase?.price || 0) + (selectedCooler?.price || 0)
  };
};

exports.handleChat = catchAsync(async (req, res, next) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return next(new AppError('Please provide both message and sessionId.', 400));
  }

  const logs = await ChatLog.find({ sessionId }).sort({ createdAt: 1 }).limit(10);
  const history = [];
  logs.forEach((log) => {
    history.push({ role: 'user', text: log.userMessage });
    history.push({ role: 'ai', text: log.aiResponse });
  });

  const intent = await extractIntent(message, history);

  const matchingProducts = await getRelevantProducts(intent, message);

  const mentionedProducts = await findProductsInMessage(message);
  
  let compatibilityResults = null;
  if (mentionedProducts.length >= 2) {
    const parts = {
      cpu: mentionedProducts.find(p => p.category === 'CPUs'),
      gpu: mentionedProducts.find(p => p.category === 'GPUs'),
      motherboard: mentionedProducts.find(p => p.category === 'Motherboards'),
      ram: mentionedProducts.find(p => p.category === 'RAM'),
      storage: mentionedProducts.find(p => p.category === 'Storage'),
      psu: mentionedProducts.find(p => p.category === 'Power Supplies'),
      case: mentionedProducts.find(p => p.category === 'Cases'),
      cooler: mentionedProducts.find(p => p.category === 'Cooling')
    };
    compatibilityResults = checkCompatibility(parts);
  }

  let recommendedBuild = null;
  if (intent.budget && intent.purpose) {
    recommendedBuild = await recommendBuildForBudget(intent.budget, intent.purpose);
  }

  const contextData = {
    matchingProducts,
    compatibilityResults,
    recommendedBuild,
    intent
  };

  const aiResponse = await generateResponse(message, history, contextData, compatibilityResults);

  const userId = req.user ? req.user._id : null;
  await ChatLog.create({
    userId,
    sessionId,
    userMessage: message,
    aiResponse
  });

  res.status(200).json({
    success: true,
    data: {
      message: aiResponse
    }
  });
});
