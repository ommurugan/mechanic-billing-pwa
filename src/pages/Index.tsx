
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Wrench, Receipt, BarChart3, Users, Settings, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Receipt,
      title: "Automated Invoice Generation",
      description: "Instantly creates detailed invoices with customer and vehicle information"
    },
    {
      icon: Wrench,
      title: "Service & Parts Catalog",
      description: "Maintains a comprehensive list of services, repairs, and spare parts"
    },
    {
      icon: Users,
      title: "Customer Database",
      description: "Stores customer details for future reference and repeat service benefits"
    },
    {
      icon: BarChart3,
      title: "Reporting & Analytics",
      description: "Provides insights into revenue, expenses, and business performance"
    }
  ];

  const benefits = [
    "Efficiency & Time-Saving",
    "Improved Accuracy",
    "Enhanced Customer Experience",
    "Better Financial Management"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <img 
                  src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
                  alt="OM MURUGAN AUTO WORKS" 
                  className="h-8 w-8"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">OM MURUGAN AUTO WORKS</h1>
                <p className="text-sm text-gray-600">Billing Management System</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Access Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-orange-100 text-blue-800 border-blue-200">
            Professional Automotive Billing Solution
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Auto Service
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"> Business</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Complete billing software for car and bike mechanics. Automate invoicing, track services, 
            manage customers, and grow your business with powerful analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Start Billing Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/services')}
            >
              View Features
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h3>
            <p className="text-lg text-gray-600">Everything you need to manage your auto service business efficiently</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-100 to-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Solution?</h3>
            <p className="text-lg text-gray-600">Transform your auto service business with these key benefits</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-lg font-medium text-gray-900">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of auto service centers using our billing software
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Access Your Dashboard
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
              alt="OM MURUGAN AUTO WORKS" 
              className="h-6 w-6"
            />
            <span className="text-lg font-semibold">OM MURUGAN AUTO WORKS</span>
          </div>
          <p className="text-gray-400">Professional Billing Software for Automotive Services</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
