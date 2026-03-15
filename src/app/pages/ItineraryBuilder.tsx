import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Plus, Trash2, Save, Send } from 'lucide-react';
import { toast } from 'sonner';

interface DayPlan {
  id: number;
  dayNumber: number;
  destination: string;
  attractions: string[];
  mealPlan: string;
  accommodation: string;
}

export default function ItineraryBuilder() {
  const navigate = useNavigate();
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState<DayPlan[]>([
    {
      id: 1,
      dayNumber: 1,
      destination: '',
      attractions: [''],
      mealPlan: 'BB',
      accommodation: ''
    }
  ]);

  const addDay = () => {
    const newDay: DayPlan = {
      id: days.length + 1,
      dayNumber: days.length + 1,
      destination: '',
      attractions: [''],
      mealPlan: 'BB',
      accommodation: ''
    };
    setDays([...days, newDay]);
  };

  const removeDay = (id: number) => {
    if (days.length > 1) {
      setDays(days.filter(d => d.id !== id));
    }
  };

  const updateDay = (id: number, field: keyof DayPlan, value: any) => {
    setDays(days.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const addAttraction = (dayId: number) => {
    setDays(days.map(d => 
      d.id === dayId 
        ? { ...d, attractions: [...d.attractions, ''] }
        : d
    ));
  };

  const updateAttraction = (dayId: number, index: number, value: string) => {
    setDays(days.map(d => 
      d.id === dayId 
        ? { ...d, attractions: d.attractions.map((a, i) => i === index ? value : a) }
        : d
    ));
  };

  const removeAttraction = (dayId: number, index: number) => {
    setDays(days.map(d => 
      d.id === dayId 
        ? { ...d, attractions: d.attractions.filter((_, i) => i !== index) }
        : d
    ));
  };

  const handleSaveDraft = () => {
    toast.success('Itinerary saved as draft');
  };

  const handleSubmit = () => {
    toast.success('Itinerary submitted for review');
    setTimeout(() => navigate('/guest/dashboard'), 1500);
  };

  return (
    <Layout title="Create Your Itinerary" role="guest">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Trip Details */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tripName">Trip Name</Label>
                <Input 
                  id="tripName" 
                  placeholder="e.g., European Adventure"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Days</Label>
                <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                  {days.length} {days.length === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day by Day Planning */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Day-by-Day Itinerary</CardTitle>
            <Button onClick={addDay} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Day
            </Button>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {days.map((day) => (
                <AccordionItem key={day.id} value={`day-${day.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-semibold">Day {day.dayNumber}</span>
                      <span className="text-sm text-gray-500">
                        {day.destination || 'No destination set'}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Destination</Label>
                        <Input 
                          placeholder="e.g., Paris, France"
                          value={day.destination}
                          onChange={(e) => updateDay(day.id, 'destination', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Attractions</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addAttraction(day.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Attraction
                          </Button>
                        </div>
                        {day.attractions.map((attraction, index) => (
                          <div key={index} className="flex space-x-2">
                            <Input 
                              placeholder="e.g., Eiffel Tower"
                              value={attraction}
                              onChange={(e) => updateAttraction(day.id, index, e.target.value)}
                            />
                            {day.attractions.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAttraction(day.id, index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Meal Plan</Label>
                          <Select 
                            value={day.mealPlan}
                            onValueChange={(value) => updateDay(day.id, 'mealPlan', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BB">Bed & Breakfast (BB)</SelectItem>
                              <SelectItem value="HB">Half Board (HB)</SelectItem>
                              <SelectItem value="FB">Full Board (FB)</SelectItem>
                              <SelectItem value="AI">All Inclusive (AI)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Accommodation Type</Label>
                          <Select 
                            value={day.accommodation}
                            onValueChange={(value) => updateDay(day.id, 'accommodation', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select accommodation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hotel">Hotel</SelectItem>
                              <SelectItem value="resort">Resort</SelectItem>
                              <SelectItem value="hostel">Hostel</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="apartment">Apartment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {days.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeDay(day.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Day
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </div>
    </Layout>
  );
}
