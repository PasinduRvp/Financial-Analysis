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
      color: "text-chart-1"
    },
    {
      title: "Total Revenue",
      value: "$45,231",
      description: "Year-to-date revenue",
      icon: DollarSign,
      color: "text-chart-2"
    },
    {
      title: "Net Profit",
      value: "$12,845",
      description: "Current year profit",
      icon: TrendingUp,
      color: "text-chart-3"
    },
    {
      title: "Reports Generated",
      value: "28",
      description: "Total reports created",
      icon: PieChart,
      color: "text-chart-4"
    }
  ];

  const reportOptions = [
    {
      title: "Monthly Financial Report",
      description: "Generate detailed monthly financial reports with income, expenses, and balance calculations",
      icon: Calendar,
      href: "/monthly-report",
      gradient: "from-primary to-primary-hover"
    },
    {
      title: "Yearly Financial Report", 
      description: "Create comprehensive yearly financial summaries with full-year analytics and trends",
      icon: FileText,
      href: "/yearly-report",
      gradient: "from-success to-accent"
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Financial Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate professional financial reports with detailed analytics, charts, and PDF exports
          </p>
        </div>

        {/* Quick Stats */}
        

        {/* Report Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card key={option.title} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/10">
                <CardHeader className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">{option.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to={option.href}>
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
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
        <Card className="border-0 bg-gradient-to-br from-card to-primary-light/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-foreground">
              Professional Financial Reporting Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center mx-auto">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Interactive Charts</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize your financial data with beautiful pie and bar charts
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-chart-2 to-chart-3 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">PDF Export</h3>
                <p className="text-sm text-muted-foreground">
                  Export professional reports as PDF files for sharing and archiving
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-chart-3 to-chart-4 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Real-time Calculations</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic calculations and updates as you input financial data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
