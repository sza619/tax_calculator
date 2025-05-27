import React, { useState } from "react";
import * as XLSX from "xlsx";

interface FreelanceProject {
  amount: number;
  tds: number;
}

const TaxCalculator = () => {
  const [monthlySalary, setMonthlySalary] = useState(50000);
  const [freelanceProjects, setFreelanceProjects] = useState<
    FreelanceProject[]
  >([{ amount: 40000, tds: 4000 }]);
  const [gstCollected, setGstCollected] = useState(0);
  const [useNewRegime, setUseNewRegime] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalFreelanceIncome = freelanceProjects.reduce(
    (acc, p) => acc + p.amount,
    0
  );
  const totalTdsDeducted = freelanceProjects.reduce((acc, p) => acc + p.tds, 0);

  const calculateTax = (monthlySalary: number, freelanceIncome: number) => {
    const annualSalary = monthlySalary * 12;
    const standardDeduction = 50000;
    const totalIncome = annualSalary + freelanceIncome;
    const taxableIncome = totalIncome - standardDeduction;

    let tax = 0;

    if (useNewRegime) {
      if (taxableIncome <= 300000) tax = 0;
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
      else if (taxableIncome <= 900000)
        tax = 15000 + (taxableIncome - 600000) * 0.1;
      else if (taxableIncome <= 1200000)
        tax = 15000 + 30000 + (taxableIncome - 900000) * 0.15;
      else if (taxableIncome <= 1500000)
        tax = 15000 + 30000 + 45000 + (taxableIncome - 1200000) * 0.2;
      else
        tax = 15000 + 30000 + 45000 + 60000 + (taxableIncome - 1500000) * 0.3;
    } else {
      let deduction80C = 150000;
      const adjustedTaxable = Math.max(0, taxableIncome - deduction80C);

      if (adjustedTaxable <= 250000) tax = 0;
      else if (adjustedTaxable <= 500000)
        tax = (adjustedTaxable - 250000) * 0.05;
      else if (adjustedTaxable <= 1000000)
        tax = 12500 + (adjustedTaxable - 500000) * 0.2;
      else tax = 12500 + 100000 + (adjustedTaxable - 1000000) * 0.3;
    }

    const rebate =
      taxableIncome <= 700000 && useNewRegime ? Math.min(25000, tax) : 0;
    const finalTax = tax - rebate;

    return {
      annualSalary,
      freelanceIncome,
      totalIncome,
      taxableIncome,
      taxBeforeRebate: tax,
      rebate,
      finalTax,
      tdsDeducted: totalTdsDeducted,
      gstCollected,
    };
  };

  const result = calculateTax(monthlySalary, totalFreelanceIncome);

  const downloadExcel = () => {
    if (!result) return;

    const data = [
      ["Tax Report for FY 2024-25"],
      ["", ""],
      ["Annual Salary", result.annualSalary],
      ["Freelance Income", result.freelanceIncome],
      ["Total Income", result.totalIncome],
      ["Taxable Income", result.taxableIncome],
      ["Tax Before Rebate", result.taxBeforeRebate],
      ["87A Rebate", result.rebate],
      ["", ""],
      ["Final Tax Payable", result.finalTax],
      ["", ""],
      ["TDS Deducted", result.tdsDeducted],
      ["GST Collected", result.gstCollected],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tax Report");
    XLSX.writeFile(workbook, "tax-report.xlsx");
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-blue-50 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          Income Tax Calculator {new Date().getFullYear()}
        </h1>

        {!showResult ? (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Monthly Salary (₹)
              </label>
              <input
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(parseInt(e.target.value))}
                className="w-full p-2 rounded border border-blue-300"
              />
            </div>

            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Freelance Projects
            </h2>
            {freelanceProjects.map((project, idx) => (
              <div key={idx} className="mb-2 grid grid-cols-3 gap-2 items-end">
                <div>
                  <p>Amount</p>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={project.amount}
                    onChange={(e) => {
                      const newList = [...freelanceProjects];
                      newList[idx].amount = parseInt(e.target.value);
                      setFreelanceProjects(newList);
                    }}
                    className="p-2 rounded border border-blue-300 w-full"
                  />
                </div>
                <div>
                  <p>TDS</p>
                  <input
                    type="number"
                    placeholder="TDS"
                    value={project.tds}
                    onChange={(e) => {
                      const newList = [...freelanceProjects];
                      newList[idx].tds = parseInt(e.target.value);
                      setFreelanceProjects(newList);
                    }}
                    className="p-2 rounded border border-blue-300 w-full"
                  />
                </div>
                <button
                  onClick={() => {
                    const newList = freelanceProjects.filter(
                      (_, i) => i !== idx
                    );
                    setFreelanceProjects(newList);
                  }}
                  className="flex items-center h-10 w-10 mt-[22px] bg-red-500 text-sm text-white justify-center hover:bg-red-600 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setFreelanceProjects([
                  ...freelanceProjects,
                  { amount: 0, tds: 0 },
                ])
              }
              className="text-sm font-medium text-blue-600 mb-4"
            >
              + Add Project
            </button>

            <div className="mb-4">
              <label className="block mb-1 font-medium">
                GST Collected (₹)
              </label>
              <input
                type="number"
                value={gstCollected}
                onChange={(e) => setGstCollected(parseInt(e.target.value))}
                className="w-full p-2 rounded border border-blue-300"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useNewRegime}
                  onChange={() => setUseNewRegime(!useNewRegime)}
                  className="accent-blue-600"
                />
                <span>Use New Regime</span>
              </label>
            </div>

            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setShowResult(true);
                }, 2000);
              }}
              className="mt-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 w-full relative group"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                    ></path>
                  </svg>
                  Calculating...
                </span>
              ) : (
                <>
                  Calculate
                  <span className="ml-1 inline-block transition-transform duration-300 transform group-hover:translate-x-1">{`→`}</span>
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-xl border border-blue-200 mb-4 space-y-2">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                Tax Summary
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <strong>Annual Salary</strong>
                  <br /> ₹{result.annualSalary.toLocaleString()}
                </p>
                <p>
                  <strong>Freelance Income</strong>
                  <br /> ₹{result.freelanceIncome.toLocaleString()}
                </p>
                <p>
                  <strong>Total Income</strong>
                  <br /> ₹{result.totalIncome.toLocaleString()}
                </p>
                <p>
                  <strong>Taxable Income</strong>
                  <br /> ₹{result.taxableIncome.toLocaleString()}
                </p>
                <p>
                  <strong>Tax Before Rebate</strong>
                  <br /> ₹{result.taxBeforeRebate.toLocaleString()}
                </p>
                <p>
                  <strong>87A Rebate</strong>
                  <br /> ₹{result.rebate.toLocaleString()}
                </p>
                <p className="col-span-2 text-lg font-bold text-blue-700">
                  Final Tax Payable: ₹{result.finalTax.toLocaleString()}
                </p>
                <p>
                  <strong>TDS Deducted</strong>
                  <br /> ₹{result.tdsDeducted.toLocaleString()}
                </p>
                <p>
                  <strong>GST Collected</strong>
                  <br /> ₹{result.gstCollected.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowResult(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={downloadExcel}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
              >
                Download Excel Sheet
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaxCalculator;
