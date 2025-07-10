
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  TrendingUp,
  DollarSign,
  Users,
  Car,
  Receipt,
  Calendar,
  BarChart3
} from "lucide-react";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import LogoutButton from "@/components/LogoutButton";
import { useSupabaseData } from "@/hooks/useSupabaseData";

const Reports = () => {
  const { customers, services, parts, invoices, loading } = useSupabaseData();
  const [dateRange, setDateRange] = useState("30");

  const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
  const paidRevenue = paidInvoices.reduce((sum, invoice) => sum + Number(invoice.total), 0);

  const keyMetrics = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: "0%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Customers",
      value: customers.length.toString(),
      change: "0%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Vehicles Serviced",
      value: invoices.length.toString(),
      change: "0%",
      icon: Car,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Total Invoices",
      value: invoices.length.toString(),
      change: "0%",
      icon: Receipt,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report...`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div className="flex w-full">
        <MobileSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full md:w-auto">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600 text-sm md:text-base">Track your business performance and insights</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="hidden md:block">
                  <LogoutButton />
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => exportReport('PDF')} className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6 space-y-6 w-full overflow-x-hidden">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {keyMetrics.map((metric, index) => (
                <Card key={index} className="w-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="text-sm font-medium text-gray-600 truncate">{metric.title}</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900 truncate">{metric.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-400">{metric.change}</span>
                          <span className="text-sm text-gray-500 hidden sm:inline">vs last period</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-full ${metric.bgColor} flex-shrink-0`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-6 w-full">
              <div className="w-full overflow-x-auto">
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="overview" className="flex-1 md:flex-initial">Overview</TabsTrigger>
                  <TabsTrigger value="revenue" className="flex-1 md:flex-initial">Revenue</TabsTrigger>
                  <TabsTrigger value="services" className="flex-1 md:flex-initial">Services</TabsTrigger>
                  <TabsTrigger value="customers" className="flex-1 md:flex-initial">Customers</TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Overview</CardTitle>
                    <CardDescription>Summary of your business performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {invoices.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{invoices.length}</p>
                          <p className="text-sm text-gray-600">Total Invoices</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">₹{paidRevenue.toLocaleString('en-IN')}</p>
                          <p className="text-sm text-gray-600">Paid Amount</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">{services.length + parts.length}</p>
                          <p className="text-sm text-gray-600">Total Items</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                        <p className="mb-4 px-4">Start creating invoices and serving customers to see your business analytics here.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Revenue Tab */}
              <TabsContent value="revenue" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analysis</CardTitle>
                    <CardDescription>Detailed revenue breakdown and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {invoices.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Total Revenue</h4>
                            <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Average Invoice Value</h4>
                            <p className="text-2xl font-bold text-blue-600">
                              ₹{invoices.length > 0 ? Math.round(totalRevenue / invoices.length).toLocaleString('en-IN') : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <DollarSign className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No revenue data</h3>
                        <p className="px-4">Revenue reports will appear here once you start billing customers.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Performance</CardTitle>
                    <CardDescription>Most popular services and their performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {services.length > 0 || parts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Total Services</h4>
                          <p className="text-2xl font-bold text-blue-600">{services.length}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Total Parts</h4>
                          <p className="text-2xl font-bold text-green-600">{parts.length}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Car className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No service data</h3>
                        <p className="px-4">Service performance analytics will show here once you start providing services.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Customers Tab */}
              <TabsContent value="customers" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
                        <p className="text-sm text-gray-600">Total Customers</p>
                        <p className="text-xs text-gray-400 mt-1">Registered customers</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {customers.filter(c => c.gst_number).length}
                        </p>
                        <p className="text-sm text-gray-600">GST Customers</p>
                        <p className="text-xs text-gray-400 mt-1">With GST numbers</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          ₹{customers.length > 0 ? Math.round(totalRevenue / customers.length).toLocaleString('en-IN') : 0}
                        </p>
                        <p className="text-sm text-gray-600">Avg. Customer Value</p>
                        <p className="text-xs text-gray-400 mt-1">Per customer</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Reports;
