import { useState } from "react";
import { Plus, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from "@/components/layout/Header";

interface YearlyFinancialItem {
  id: string;
  itemNo: number;
  name: string;
  description: string;
  monthlyData: { [month: string]: { income: number; expense: number } };
}

const YearlyReport = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [items, setItems] = useState<YearlyFinancialItem[]>([]);

  const years = Array.from({ length: 10 }, (_, i) => 2025 - i);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const addNewItem = () => {
    const monthlyData: { [month: string]: { income: number; expense: number } } = {};
    months.forEach(month => {
      monthlyData[month] = { income: 0, expense: 0 };
    });

    const newItem: YearlyFinancialItem = {
      id: Date.now().toString(),
      itemNo: items.length + 1,
      name: "",
      description: "",
      monthlyData
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: 'name' | 'description', value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateMonthlyData = (id: string, month: string, type: 'income' | 'expense', value: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            monthlyData: { 
              ...item.monthlyData, 
              [month]: { 
                ...item.monthlyData[month], 
                [type]: value 
              }
            }
          } 
        : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems.map((item, index) => ({ ...item, itemNo: index + 1 })));
  };

  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpense = 0;
    const monthlyTotals = months.map(month => {
      const monthIncome = items.reduce((sum, item) => sum + item.monthlyData[month]?.income || 0, 0);
      const monthExpense = items.reduce((sum, item) => sum + item.monthlyData[month]?.expense || 0, 0);
      totalIncome += monthIncome;
      totalExpense += monthExpense;
      return {
        month,
        income: monthIncome,
        expense: monthExpense,
        balance: monthIncome - monthExpense
      };
    });

    return {
      totalIncome,
      totalExpense,
      finalBalance: totalIncome - totalExpense,
      monthlyTotals
    };
  };

  const { totalIncome, totalExpense, finalBalance, monthlyTotals } = calculateTotals();

  const pieData = [
    { name: 'Income', value: totalIncome, color: 'hsl(142, 76%, 36%)' },
    { name: 'Expenses', value: totalExpense, color: 'hsl(0, 84%, 60%)' }
  ];

  const barData = monthlyTotals;

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
      canvas.width = 600;
      canvas.height = 400;
      const ctx = canvas.getContext('2d')!;

      const margin = { top: 50, right: 50, bottom: 80, left: 80 };
      const chartWidth = canvas.width - margin.left - margin.right;
      const chartHeight = canvas.height - margin.top - margin.bottom;

      const maxValue = Math.max(
        ...monthlyTotals.map(item => Math.max(item.income, item.expense)),
        1
      );

      const barWidth = chartWidth / (monthlyTotals.length * 2 + monthlyTotals.length);
      const barSpacing = barWidth / 3;

      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Monthly Breakdown', canvas.width / 2, 30);

      monthlyTotals.forEach((item, index) => {
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
        ctx.fillText(item.month, x + barWidth + barSpacing / 2, margin.top + chartHeight + 20);
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
      doc.text('Yearly Financial Report', 20, 20);
      doc.setFontSize(14);
      doc.text(`Year: ${selectedYear}`, 20, 35);
      
      let yPosition = 50;
      doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 20, yPosition);
      doc.text(`Total Expense: $${totalExpense.toFixed(2)}`, 20, yPosition + 10);
      doc.text(`Final Balance: $${finalBalance.toFixed(2)}`, 20, yPosition + 20);

      const monthlyData = monthlyTotals.map(month => [
        month.month,
        `$${month.income.toFixed(2)}`,
        `$${month.expense.toFixed(2)}`,
        `$${month.balance.toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [['Month', 'Income', 'Expense', 'Balance']],
        body: monthlyData,
        startY: yPosition + 35,
      });

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

          const barCanvas = await createBarChartCanvas();
          cleanupCanvases.push(barCanvas);
          const barImageData = barCanvas.toDataURL('image/png');
          doc.addImage(barImageData, 'PNG', 20, 120, 160, 120);
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

      doc.save(`yearly-report-${selectedYear}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Yearly Financial Report</h1>
            <p className="text-gray-600">Generate comprehensive yearly financial analysis</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-xs">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Financial Categories</CardTitle>
              <Button onClick={addNewItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mr-4">
                      <div>
                        <label className="text-sm font-medium">Category Name</label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          placeholder="e.g., Marketing, Operations"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Brief description"
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3 font-medium w-20">Type</th>
                          {months.map(month => (
                            <th key={month} className="text-left p-3 font-medium min-w-[100px]">{month}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 font-medium text-green-600">Income</td>
                          {months.map(month => (
                            <td key={`${month}-income`} className="p-2">
                              <Input
                                type="number"
                                value={item.monthlyData[month]?.income === 0 ? '' : item.monthlyData[month]?.income || ''}
                                onChange={(e) => updateMonthlyData(item.id, month, 'income', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                                className="w-full"
                              />
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-3 font-medium text-red-600">Expense</td>
                          {months.map(month => (
                            <td key={`${month}-expense`} className="p-2">
                              <Input
                                type="number"
                                value={item.monthlyData[month]?.expense === 0 ? '' : item.monthlyData[month]?.expense || ''}
                                onChange={(e) => updateMonthlyData(item.id, month, 'expense', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                                className="w-full"
                              />
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

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

          {(totalIncome > 0 || totalExpense > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Income vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                      <Bar dataKey="income" fill="hsl(142, 76%, 36%)" />
                      <Bar dataKey="expense" fill="hsl(0, 84%, 60%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={exportToPDF}
              size="lg"
              disabled={!selectedYear || items.length === 0 || (totalIncome === 0 && totalExpense === 0)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
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

export default YearlyReport;