// export const downloadPDF = (result) => {
//     const doc = new jsPDF();
//     doc.setFontSize(14);
//     doc.text("Income Tax Report", 20, 20);
//     doc.setFontSize(12);

//     const lines = [
//       `Annual Salary: ₹${result.annualSalary.toLocaleString()}`,
//       `Freelance Income: ₹${result.freelanceIncome.toLocaleString()}`,
//       `Total Income: ₹${result.totalIncome.toLocaleString()}`,
//       `Taxable Income: ₹${result.taxableIncome.toLocaleString()}`,
//       `Tax Before Rebate: ₹${result.taxBeforeRebate.toLocaleString()}`,
//       `87A Rebate: ₹${result.rebate.toLocaleString()}`,
//       `Final Tax Payable: ₹${result.finalTax.toLocaleString()}`,
//       `TDS Deducted: ₹${result.tdsDeducted.toLocaleString()}`,
//       `GST Collected: ₹${result.gstCollected.toLocaleString()}`,
//     ];

//     lines.forEach((line, i) => doc.text(line, 20, 40 + i * 10));

//     doc.save("tax-report.pdf");
//   };

export {};
