import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DollarSign, Car, UserCheck, Home, Ticket, Save, Send } from 'lucide-react';
import { toast } from 'sonner';

const mockDrivers = [
  { id: 1, name: 'Michael Chen', available: true },
  { id: 2, name: 'Sarah Williams', available: true },
  { id: 3, name: 'James Brown', available: false },
];

const mockGuides = [
  { id: 1, name: 'Emma Thompson', available: true, languages: 'English, French' },
  { id: 2, name: 'Carlos Rodriguez', available: true, languages: 'English, Spanish' },
  { id: 3, name: 'Yuki Tanaka', available: false, languages: 'English, Japanese' },
];

export default function PricingAssignment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [vehicleCost, setVehicleCost] = useState('1200');
  const [driverFee, setDriverFee] = useState('500');
  const [guideFee, setGuideFee] = useState('800');
  const [accommodationCost, setAccommodationCost] = useState('2400');
  const [adultTickets, setAdultTickets] = useState('300');
  const [childTickets, setChildTickets] = useState('150');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedGuide, setSelectedGuide] = useState('');

  const calculateTotal = () => {
    return (
      parseFloat(vehicleCost || '0') +
      parseFloat(driverFee || '0') +
      parseFloat(guideFee || '0') +
      parseFloat(accommodationCost || '0') +
      parseFloat(adultTickets || '0') +
      parseFloat(childTickets || '0')
    );
  };

  const handleGeneratePackage = () => {
    if (!selectedDriver || !selectedGuide) {
      toast.error('Please assign both driver and guide');
      return;
    }
    toast.success('Package generated successfully');
    setTimeout(() => navigate('/agency/review'), 1500);
  };

  return (
    <Layout title="Pricing & Staff Assignment" role="agency">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Trip Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Trip:</span> European Adventure
              </div>
              <div>
                <span className="text-gray-600">Guest:</span> John Doe
              </div>
              <div>
                <span className="text-gray-600">Duration:</span> 10 days
              </div>
              <div>
                <span className="text-gray-600">Dates:</span> Mar 15 - Mar 25, 2026
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vehicle">
                  <Car className="h-4 w-4 inline mr-2" />
                  Vehicle Cost (Auto-calculated)
                </Label>
                <Input
                  id="vehicle"
                  type="number"
                  value={vehicleCost}
                  onChange={(e) => setVehicleCost(e.target.value)}
                  prefix="$"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">
                  <UserCheck className="h-4 w-4 inline mr-2" />
                  Driver Fee
                </Label>
                <Input
                  id="driver"
                  type="number"
                  value={driverFee}
                  onChange={(e) => setDriverFee(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guide">
                  <UserCheck className="h-4 w-4 inline mr-2" />
                  Guide Fee
                </Label>
                <Input
                  id="guide"
                  type="number"
                  value={guideFee}
                  onChange={(e) => setGuideFee(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accommodation">
                  <Home className="h-4 w-4 inline mr-2" />
                  Accommodation Cost
                </Label>
                <Input
                  id="accommodation"
                  type="number"
                  value={accommodationCost}
                  onChange={(e) => setAccommodationCost(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adultTickets">
                  <Ticket className="h-4 w-4 inline mr-2" />
                  Adult Tickets
                </Label>
                <Input
                  id="adultTickets"
                  type="number"
                  value={adultTickets}
                  onChange={(e) => setAdultTickets(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="childTickets">
                  <Ticket className="h-4 w-4 inline mr-2" />
                  Child Tickets
                </Label>
                <Input
                  id="childTickets"
                  type="number"
                  value={childTickets}
                  onChange={(e) => setChildTickets(e.target.value)}
                />
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Package Cost:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignDriver">Assign Driver</Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger id="assignDriver">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {mockDrivers.map((driver) => (
                    <SelectItem 
                      key={driver.id} 
                      value={driver.id.toString()}
                      disabled={!driver.available}
                    >
                      {driver.name} {!driver.available && '(Unavailable)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignGuide">Assign Guide</Label>
              <Select value={selectedGuide} onValueChange={setSelectedGuide}>
                <SelectTrigger id="assignGuide">
                  <SelectValue placeholder="Select a guide" />
                </SelectTrigger>
                <SelectContent>
                  {mockGuides.map((guide) => (
                    <SelectItem 
                      key={guide.id} 
                      value={guide.id.toString()}
                      disabled={!guide.available}
                    >
                      {guide.name} - {guide.languages} {!guide.available && '(Unavailable)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDriver && selectedGuide && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Assigned Staff:</strong>
                  <br />
                  Driver: {mockDrivers.find(d => d.id.toString() === selectedDriver)?.name}
                  <br />
                  Guide: {mockGuides.find(g => g.id.toString() === selectedGuide)?.name}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleGeneratePackage}>
            <Send className="h-4 w-4 mr-2" />
            Generate Package & Send to Guest
          </Button>
        </div>
      </div>
    </Layout>
  );
}
