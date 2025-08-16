import { useState, useRef } from "react";
import { Plus, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinancialItem {
  id: string;
  itemNo: number;
  name: string;
  income: number;
  expense: number;
}

const MonthlyReport = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [items, setItems] = useState<FinancialItem[]>([]);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

  const addNewItem = () => {
    const newItem: FinancialItem = {
      id: Date.now().toString(),
      itemNo: items.length + 1,
      name: "",
      income: 0,
      expense: 0
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof FinancialItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems.map((item, index) => ({ ...item, itemNo: index + 1 })));
  };

  const totalIncome = items.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = items.reduce((sum, item) => sum + item.expense, 0);
  const finalBalance = totalIncome - totalExpense;

  const pieData = [
    { name: 'Income', value: totalIncome, color: 'hsl(142, 76%, 36%)' },
    { name: 'Expenses', value: totalExpense, color: 'hsl(0, 84%, 60%)' }
  ];

  const barData = items.map(item => ({
    name: item.name || `Item ${item.itemNo}`,
    income: item.income,
    expense: item.expense
  }));

  const createPieChartCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d')!;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 120;

      const total = totalIncome + totalExpense;
      const incomeAngle = total > 0 ? (totalIncome / total) * 2 * Math.PI : 0;
      const expenseAngle = total > 0 ? (totalExpense / total) * 2 * Math.PI : 0;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, 0, incomeAngle);
      ctx.fillStyle = '#16a34a';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, incomeAngle, incomeAngle + expenseAngle);
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Income vs Expenses', centerX, 30);
      
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(50, 350, 15, 15);
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Income: $${totalIncome.toFixed(2)}`, 75, 362);
      
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(220, 350, 15, 15);
      ctx.fillStyle = '#000';
      ctx.fillText(`Expenses: $${totalExpense.toFixed(2)}`, 245, 362);

      resolve(canvas);
    });
  };

  const createBarChartCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 400;
      const ctx = canvas.getContext('2d')!;

      const margin = { top: 50, right: 50, bottom: 80, left: 80 };
      const chartWidth = canvas.width - margin.left - margin.right;
      const chartHeight = canvas.height - margin.top - margin.bottom;

      const maxValue = Math.max(
        ...items.map(item => Math.max(item.income, item.expense)),
        1
      );

      const barWidth = chartWidth / (items.length * 2 + items.length);
      const barSpacing = barWidth / 3;

      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Items Breakdown', canvas.width / 2, 30);

      items.forEach((item, index) => {
        const x = margin.left + index * (barWidth * 2 + barSpacing * 3);
        
        const incomeHeight = (item.income / maxValue) * chartHeight;
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(x, margin.top + chartHeight - incomeHeight, barWidth, incomeHeight);
        
        const expenseHeight = (item.expense / maxValue) * chartHeight;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x + barWidth + barSpacing, margin.top + chartHeight - expenseHeight, barWidth, expenseHeight);
        
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        const itemName = item.name || `Item ${item.itemNo}`;
        const truncatedName = itemName.length > 8 ? itemName.substring(0, 8) + '...' : itemName;
        ctx.fillText(truncatedName, x + barWidth + barSpacing / 2, margin.top + chartHeight + 20);
      });

      ctx.strokeStyle = '#ccc';
      ctx.beginPath();
      ctx.moveTo(margin.left, margin.top);
      ctx.lineTo(margin.left, margin.top + chartHeight);
      ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
      ctx.stroke();

      ctx.fillStyle = '#666';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 5; i++) {
        const value = (maxValue / 5) * i;
        const y = margin.top + chartHeight - (i / 5) * chartHeight;
        ctx.fillText(`$${value.toFixed(0)}`, margin.left - 10, y + 3);
      }

      ctx.fillStyle = '#16a34a';
      ctx.fillRect(margin.left, canvas.height - 50, 15, 15);
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Income', margin.left + 25, canvas.height - 38);
      
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(margin.left + 100, canvas.height - 50, 15, 15);
      ctx.fillText('Expenses', margin.left + 125, canvas.height - 38);

      resolve(canvas);
    });
  };

  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Monthly Financial Report', 20, 20);
      doc.setFontSize(14);
      doc.text(`Period: ${selectedMonth} ${selectedYear}`, 20, 35);
      
      const tableData = items.map(item => [
        item.itemNo.toString(),
        item.name,
        `$${item.income.toFixed(2)}`,
        `$${item.expense.toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [['Item No', 'Name', 'Income', 'Expense']],
        body: tableData,
        startY: 45,
      });

      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 20, finalY);
      doc.text(`Total Expense: $${totalExpense.toFixed(2)}`, 20, finalY + 10);
      doc.text(`Final Balance: $${finalBalance.toFixed(2)}`, 20, finalY + 20);

      if (totalIncome > 0 || totalExpense > 0) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Financial Analysis Charts', 20, 20);

        const cleanupCanvases: HTMLCanvasElement[] = [];

        try {
          const pieCanvas = await createPieChartCanvas();
          cleanupCanvases.push(pieCanvas);
          const pieImageData = pieCanvas.toDataURL('image/png');
          doc.addImage(pieImageData, 'PNG', 20, 30, 80, 80);

          if (items.length > 0) {
            const barCanvas = await createBarChartCanvas();
            cleanupCanvases.push(barCanvas);
            const barImageData = barCanvas.toDataURL('image/png');
            doc.addImage(barImageData, 'PNG', 20, 120, 100, 80);
          }
        } finally {
          cleanupCanvases.forEach(canvas => {
            canvas.width = 1;
            canvas.height = 1;
            if (canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
          });
        }
      }

      doc.save(`monthly-report-${selectedMonth}-${selectedYear}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Monthly Financial Report</h1>
            <p className="text-gray-600">Generate detailed monthly financial analysis</p>
          </div>

          {/* Report Period Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Report Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Month</label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Entry Table */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CardTitle>Financial Data Entry</CardTitle>
              <Button onClick={addNewItem} size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium">Item No</th>
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Income</th>
                      <th className="text-left p-3 font-medium">Expense</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{item.itemNo}</td>
                        <td className="p-3">
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            placeholder="Item name"
                            className="min-w-[120px]"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={item.income === 0 ? '' : item.income}
                            onChange={(e) => updateItem(item.id, 'income', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="min-w-[100px]"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={item.expense === 0 ? '' : item.expense}
                            onChange={(e) => updateItem(item.id, 'expense', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="min-w-[100px]"
                          />
                        </td>
                        <td className="p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Totals Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <CardTitle className="text-green-700">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100">
              <CardHeader>
                <CardTitle className="text-red-700">Total Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className={`bg-gradient-to-br ${finalBalance >= 0 ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'}`}>
              <CardHeader>
                <CardTitle className={finalBalance >= 0 ? 'text-green-700' : 'text-red-700'}>Final Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${finalBalance.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          {(totalIncome > 0 || totalExpense > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Income vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div ref={pieChartRef}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Items Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div ref={barChartRef}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Bar dataKey="income" fill="hsl(142, 76%, 36%)" />
                        <Bar dataKey="expense" fill="hsl(0, 84%, 60%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-center">
            <Button
              onClick={exportToPDF}
              size="lg"
              disabled={!selectedMonth || !selectedYear || items.length === 0}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg w-full md:w-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF Report with Charts
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthlyReport;
