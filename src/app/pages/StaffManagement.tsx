import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar as CalendarIcon, User, Car, Plus } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';

const mockDrivers = [
  { id: 1, name: 'Michael Chen', status: 'Available', phone: '+1 234-567-8900', experience: '5 years' },
  { id: 2, name: 'Sarah Williams', status: 'On Trip', phone: '+1 234-567-8901', experience: '3 years' },
  { id: 3, name: 'James Brown', status: 'Available', phone: '+1 234-567-8902', experience: '7 years' },
  { id: 4, name: 'Linda Davis', status: 'Off Duty', phone: '+1 234-567-8903', experience: '4 years' },
];

const mockGuides = [
  { id: 1, name: 'Emma Thompson', status: 'Available', languages: 'English, French', phone: '+1 234-567-9000', experience: '6 years' },
  { id: 2, name: 'Carlos Rodriguez', status: 'On Trip', languages: 'English, Spanish', phone: '+1 234-567-9001', experience: '4 years' },
  { id: 3, name: 'Yuki Tanaka', status: 'Available', languages: 'English, Japanese', phone: '+1 234-567-9002', experience: '5 years' },
  { id: 4, name: 'Ahmed Hassan', status: 'Off Duty', languages: 'English, Arabic', phone: '+1 234-567-9003', experience: '8 years' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Available':
      return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
    case 'On Trip':
      return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
    case 'Off Duty':
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function StaffManagement() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  return (
    <Layout title="Staff & Resource Management" role="agency">
      <div className="space-y-6">
        <Tabs defaultValue="drivers" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Driver List</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="rounded-full bg-blue-100 p-2 mr-3">
                              <Car className="h-4 w-4 text-blue-600" />
                            </div>
                            {driver.name}
                          </div>
                        </TableCell>
                        <TableCell>{driver.experience}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{getStatusBadge(driver.status)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedStaff(driver)}
                              >
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                View Availability
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{driver.name} - Availability Calendar</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  className="rounded-md border"
                                />
                                <div className="mt-4 space-y-2">
                                  <h4 className="font-semibold">Legend:</h4>
                                  <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                                      <span className="text-sm">Available</span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
                                      <span className="text-sm">Booked</span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                                      <span className="text-sm">Unavailable</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Guide List</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Guide
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Languages</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockGuides.map((guide) => (
                      <TableRow key={guide.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="rounded-full bg-purple-100 p-2 mr-3">
                              <User className="h-4 w-4 text-purple-600" />
                            </div>
                            {guide.name}
                          </div>
                        </TableCell>
                        <TableCell>{guide.languages}</TableCell>
                        <TableCell>{guide.experience}</TableCell>
                        <TableCell>{guide.phone}</TableCell>
                        <TableCell>{getStatusBadge(guide.status)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedStaff(guide)}
                              >
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                View Availability
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{guide.name} - Availability Calendar</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  className="rounded-md border"
                                />
                                <div className="mt-4 space-y-2">
                                  <h4 className="font-semibold">Legend:</h4>
                                  <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                                      <span className="text-sm">Available</span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
                                      <span className="text-sm">Booked</span>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                                      <span className="text-sm">Unavailable</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
