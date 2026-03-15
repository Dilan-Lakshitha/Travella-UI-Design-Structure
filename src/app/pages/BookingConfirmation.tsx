import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Calendar, MapPin, Car, UserCheck, Home, DollarSign, CircleCheck, Pencil } from 'lucide-react';
import { toast } from 'sonner';

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleConfirmBooking = () => {
    toast.success('Booking confirmed! You will receive confirmation email shortly.');
    setTimeout(() => navigate('/guest/dashboard'), 2000);
  };

  const handleRequestChanges = () => {
    toast.info('Change request sent to travel expert');
  };

  return (
    <Layout title="Booking Summary" role="guest">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status Banner */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CircleCheck className="h-12 w-12 text-green-600 mr-4" />
              <div>
                <h3 className="text-xl font-semibold text-green-900">Itinerary Approved!</h3>
                <p className="text-green-700">Your customized travel package is ready. Review the details and confirm your booking.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trip Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Beach Paradise</CardTitle>
              <Badge className="bg-green-100 text-green-800">Approved</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">Maldives</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Travel Dates</p>
                  <p className="font-medium">Feb 1 - Feb 8, 2026 (7 days)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Itinerary */}
        <Card>
          <CardHeader>
            <CardTitle>Final Itinerary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { day: 1, destination: 'Male, Maldives', activities: 'Arrival, Resort Check-in, Beach Welcome Dinner', accommodation: 'Water Villa' },
                { day: 2, destination: 'Male, Maldives', activities: 'Snorkeling Tour, Sunset Cruise', accommodation: 'Water Villa' },
                { day: 3, destination: 'Male, Maldives', activities: 'Spa Day, Private Beach Time', accommodation: 'Water Villa' },
                { day: 4, destination: 'Male, Maldives', activities: 'Scuba Diving, Island Hopping', accommodation: 'Water Villa' },
                { day: 5, destination: 'Male, Maldives', activities: 'Dolphin Watching, Beach Activities', accommodation: 'Water Villa' },
                { day: 6, destination: 'Male, Maldives', activities: 'Underwater Restaurant Lunch, Relaxation', accommodation: 'Water Villa' },
                { day: 7, destination: 'Male, Maldives', activities: 'Departure', accommodation: '-' },
              ].map((day) => (
                <div key={day.day} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Day {day.day}: {day.destination}</h4>
                    {day.accommodation !== '-' && (
                      <span className="text-sm text-gray-500">{day.accommodation}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{day.activities}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assigned Staff */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Staff & Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Driver</p>
                  <p className="text-sm text-gray-600">Michael Chen</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">+1 234-567-8900</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-2 mr-3">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Tour Guide</p>
                  <p className="text-sm text-gray-600">Emma Thompson</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">English, French</p>
            </div>
          </CardContent>
        </Card>

        {/* Accommodation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Accommodation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Property:</span>
                <span className="font-medium">Paradise Island Resort & Spa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type:</span>
                <span className="font-medium">Water Villa with Private Pool</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meal Plan:</span>
                <span className="font-medium">All Inclusive</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">Feb 1, 2026 - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">Feb 8, 2026 - 12:00 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Price */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <DollarSign className="h-5 w-5 mr-2" />
              Total Package Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accommodation (6 nights)</span>
                <span>$2,400</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Transportation</span>
                <span>$1,200</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Driver & Guide Fees</span>
                <span>$1,300</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Activities & Attractions</span>
                <span>$450</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-xl font-bold text-blue-900">
                <span>Total:</span>
                <span>$5,350.00</span>
              </div>
              <p className="text-xs text-blue-700 mt-2">*All taxes and fees included</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleRequestChanges}>
            <Pencil className="h-4 w-4 mr-2" />
            Request Changes
          </Button>
          <Button onClick={handleConfirmBooking} size="lg">
            <CircleCheck className="h-4 w-4 mr-2" />
            Confirm Booking
          </Button>
        </div>
      </div>
    </Layout>
  );
}