import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Plus, Calendar, MapPin, Clock } from 'lucide-react';

const mockItineraries = [
  {
    id: 1,
    title: 'European Adventure',
    destination: 'Paris, France → Rome, Italy',
    startDate: '2026-03-15',
    endDate: '2026-03-25',
    status: 'draft',
    daysCount: 10
  },
  {
    id: 2,
    title: 'Asian Discovery Tour',
    destination: 'Tokyo → Kyoto → Osaka',
    startDate: '2026-04-10',
    endDate: '2026-04-20',
    status: 'submitted',
    daysCount: 10
  },
  {
    id: 3,
    title: 'Beach Paradise',
    destination: 'Maldives',
    startDate: '2026-02-01',
    endDate: '2026-02-08',
    status: 'approved',
    daysCount: 7
  },
  {
    id: 4,
    title: 'Mountain Retreat',
    destination: 'Swiss Alps',
    startDate: '2026-01-20',
    endDate: '2026-01-27',
    status: 'confirmed',
    daysCount: 7
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'submitted': return 'bg-blue-100 text-blue-800';
    case 'approved': return 'bg-green-100 text-green-800';
    case 'confirmed': return 'bg-purple-100 text-purple-800';
    case 'corrected': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function GuestDashboard() {
  const navigate = useNavigate();

  const draftItineraries = mockItineraries.filter(i => i.status === 'draft');
  const submittedItineraries = mockItineraries.filter(i => i.status === 'submitted');
  const approvedItineraries = mockItineraries.filter(i => ['approved', 'confirmed'].includes(i.status));

  return (
    <Layout title="My Travel Plans" role="guest">
      <div className="space-y-6">
        {/* Action Button */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Plan your dream vacation with personalized itineraries</p>
          <Button onClick={() => navigate('/guest/itinerary-builder')}>
            <Plus className="h-4 w-4 mr-2" />
            Customize Your Tour
          </Button>
        </div>

        {/* Draft Itineraries */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Draft Itineraries</h3>
          {draftItineraries.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No draft itineraries. Start planning your next adventure!
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {draftItineraries.map((itinerary) => (
                <Card key={itinerary.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{itinerary.title}</CardTitle>
                      <Badge className={getStatusColor(itinerary.status)}>
                        {itinerary.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {itinerary.destination}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {itinerary.daysCount} days
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate('/guest/itinerary-builder')}
                      >
                        Continue Editing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Submitted Itineraries */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Submitted for Review</h3>
          {submittedItineraries.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No submitted itineraries
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {submittedItineraries.map((itinerary) => (
                <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{itinerary.title}</CardTitle>
                      <Badge className={getStatusColor(itinerary.status)}>
                        {itinerary.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {itinerary.destination}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-blue-600">
                      Under review by our travel experts
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Approved Itineraries */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Approved Itineraries</h3>
          {approvedItineraries.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No approved itineraries yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approvedItineraries.map((itinerary) => (
                <Card key={itinerary.id} className="hover:shadow-lg transition-shadow cursor-pointer border-green-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{itinerary.title}</CardTitle>
                      <Badge className={getStatusColor(itinerary.status)}>
                        {itinerary.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {itinerary.destination}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/guest/booking/${itinerary.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
