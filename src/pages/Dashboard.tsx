import { Link } from "react-router-dom";
import { Calendar, FileText, TrendingUp, DollarSign, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const Dashboard = () => {
  const quickStats = [
    {
      title: "Monthly Reports",
      value: "12",
      description: "Reports generated this year",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Revenue",
      value: "$45,231",
      description: "Year-to-date revenue",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Net Profit",
      value: "$12,845",
      description: "Current year profit",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      title: "Reports Generated",
      value: "28",
      description: "Total reports created",
      icon: PieChart,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const reportOptions = [
    {
      title: "Monthly Financial Report",
      description: "Generate detailed monthly financial reports with income, expenses, and balance calculations",
      icon: Calendar,
      href: "/monthly-report",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      title: "Yearly Financial Report", 
      description: "Create comprehensive yearly financial summaries with full-year analytics and trends",
      icon: FileText,
      href: "/yearly-report",
      gradient: "from-blue-500 to-blue-700"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="space-y-8 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-4 pt-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Financial Dashboard
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Generate professional financial reports with detailed analytics, charts, and PDF exports
            </p>
          </div>

          

          {/* Report Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.title} className="group border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className={`bg-gradient-to-r ${option.gradient} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg text-gray-900">{option.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                    <Link to={option.href}>
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        Generate Report
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Section */}
          <Card className="border-gray-100 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-900">
                Professional Financial Reporting Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3 p-4 rounded-lg hover:bg-white transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <PieChart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Interactive Charts</h3>
                  <p className="text-sm text-gray-600">
                    Visualize your financial data with beautiful pie and bar charts
                  </p>
                </div>
                <div className="text-center space-y-3 p-4 rounded-lg hover:bg-white transition-colors">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">PDF Export</h3>
                  <p className="text-sm text-gray-600">
                    Export professional reports as PDF files for sharing and archiving
                  </p>
                </div>
                <div className="text-center space-y-3 p-4 rounded-lg hover:bg-white transition-colors">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Real-time Calculations</h3>
                  <p className="text-sm text-gray-600">
                    Automatic calculations and updates as you input financial data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
