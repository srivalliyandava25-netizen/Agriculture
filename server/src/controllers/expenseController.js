import { FarmingExpense } from '../models/FarmingExpense.js';

export const calculateAndSaveExpense = async (req, res, next) => {
  try {
    const {
      cropName,
      season,
      year,
      landArea,
      landUnit,
      seedsCost = 0,
      landPrepCost = 0,
      fertilizersCost = 0,
      organicInputsCost = 0,
      irrigationCost = 0,
      labourCost = 0,
      machineryCost = 0,
      pestManagementCost = 0,
      transportCost = 0,
      otherCost = 0,
      expectedYieldQuantity,
      yieldUnit = 'quintals',
      expectedPricePerUnit,
      notes,
      saveRecord = true
    } = req.body;

    if (!cropName || !landArea || !expectedYieldQuantity || !expectedPricePerUnit) {
      return res.status(400).json({
        success: false,
        message: 'Crop name, land area, expected yield, and expected selling price are required.'
      });
    }

    const area = Number(landArea);
    const yieldQty = Number(expectedYieldQuantity);
    const pricePerUnit = Number(expectedPricePerUnit);
    const numericCosts = [seedsCost, landPrepCost, fertilizersCost, organicInputsCost, irrigationCost, labourCost, machineryCost, pestManagementCost, transportCost, otherCost];

    if (!Number.isFinite(area) || area <= 0 || !Number.isFinite(yieldQty) || yieldQty <= 0 || !Number.isFinite(pricePerUnit) || pricePerUnit <= 0) {
      return res.status(400).json({ success: false, message: 'Land area, expected yield, and selling price must be greater than zero.' });
    }
    if (numericCosts.some((value) => !Number.isFinite(Number(value)) || Number(value) < 0)) {
      return res.status(400).json({ success: false, message: 'All cost values must be valid numbers of zero or more.' });
    }

    const totalCost =
      Number(seedsCost) +
      Number(landPrepCost) +
      Number(fertilizersCost) +
      Number(organicInputsCost) +
      Number(irrigationCost) +
      Number(labourCost) +
      Number(machineryCost) +
      Number(pestManagementCost) +
      Number(transportCost) +
      Number(otherCost);

    const costPerUnitArea = area > 0 ? Math.round(totalCost / area) : totalCost;
    const grossRevenue = Math.round(yieldQty * pricePerUnit);
    const netProfitOrLoss = grossRevenue - totalCost;
    const breakEvenPrice = yieldQty > 0 ? Math.round(totalCost / yieldQty) : 0;

    let saved = null;
    if (saveRecord && req.user) {
      saved = await FarmingExpense.create({
        user: req.user.id,
        cropName,
        season: season || 'Kharif',
        year: year || new Date().getFullYear(),
        landArea: area,
        landUnit: landUnit || 'acres',
        seedsCost: Number(seedsCost),
        landPrepCost: Number(landPrepCost),
        fertilizersCost: Number(fertilizersCost),
        organicInputsCost: Number(organicInputsCost),
        irrigationCost: Number(irrigationCost),
        labourCost: Number(labourCost),
        machineryCost: Number(machineryCost),
        pestManagementCost: Number(pestManagementCost),
        transportCost: Number(transportCost),
        otherCost: Number(otherCost),
        expectedYieldQuantity: yieldQty,
        yieldUnit,
        expectedPricePerUnit: pricePerUnit,
        totalCost,
        costPerUnitArea,
        grossRevenue,
        netProfitOrLoss,
        breakEvenPrice,
        notes: notes || ''
      });
    }

    res.status(200).json({
      success: true,
      calculation: {
        cropName,
        landArea: area,
        landUnit: landUnit || 'acres',
        totalCost,
        costPerUnitArea,
        grossRevenue,
        netProfitOrLoss,
        breakEvenPrice,
        profitMarginPercent: grossRevenue > 0 ? Math.round((netProfitOrLoss / grossRevenue) * 100) : 0,
        isProfitable: netProfitOrLoss > 0,
        recordId: saved ? saved._id : null
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyExpenses = async (req, res, next) => {
  try {
    const records = await FarmingExpense.find({ user: req.user.id }).sort({ createdAt: -1 });

    const totalCalculatedInvestment = records.reduce((acc, curr) => acc + curr.totalCost, 0);
    const totalEstimatedProfit = records.reduce((acc, curr) => acc + curr.netProfitOrLoss, 0);

    res.status(200).json({
      success: true,
      records,
      summary: {
        count: records.length,
        totalCalculatedInvestment,
        totalEstimatedProfit
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const record = await FarmingExpense.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }
    if (record.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await FarmingExpense.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Expense record deleted.' });
  } catch (error) {
    next(error);
  }
};

