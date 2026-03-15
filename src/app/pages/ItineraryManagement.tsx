import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Clock, MapPin, User } from 'lucide-react';

const mockItineraries = [
  {
    id: 1,
    tripName: 'European Adventure',
    guest: 'John Doe',
    destination: 'Paris → Rome → Barcelona',
    startDate: '2026-03-15',
    days: 10,
    status: 'submitted',
    timeline: [
      { day: 1, date: '2026-03-15', destination: 'Paris', status: 'planned' },
      { day: 2, date: '2026-03-16', destination: 'Paris', status: 'planned' },
      { day: 3, date: '2026-03-17', destination: 'Paris', status: 'planned' },
      { day: 4, date: '2026-03-18', destination: 'Rome', status: 'planned' },
      { day: 5, date: '2026-03-19', destination: 'Rome', status: 'planned' },
    ]
  },
  {
    id: 2,
    tripName: 'Beach Paradise',
    guest: 'Jane Smith',
    destination: 'Maldives',
    startDate: '2026-02-01',
    days: 7,
    status: 'confirmed',
    timeline: [
      { day: 1, date: '2026-02-01', destination: 'Maldives', status: 'confirmed' },
      { day: 2, date: '2026-02-02', destination: 'Maldives', status: 'confirmed' },
      { day: 3, date: '2026-02-03', destination: 'Maldives', status: 'confirmed' },
    ]
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

const getDayStatusColor = (status: string) => {
  switch (status) {
    case 'planned': return 'border-blue-300 bg-blue-50';
    case 'confirmed': return 'border-green-300 bg-green-50';
    case 'in-progress': return 'border-purple-300 bg-purple-50';
    case 'completed': return 'border-gray-300 bg-gray-50';
    default: return 'border-gray-300 bg-gray-50';
  }
};

export default function ItineraryManagement() {
  return (
    <Layout title="Itinerary Timeline View" role="admin">
      <div className="space-y-8">
        {mockItineraries.map((itinerary) => (
          <Card key={itinerary.id} className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{itinerary.tripName}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Guest: {itinerary.guest}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {itinerary.destination}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {itinerary.days} days
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(itinerary.status)}>
                  {itinerary.status}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                {/* Timeline items */}
                <div className="space-y-6">
                  {itinerary.timeline.map((day, index) => (
                    <div key={day.day} className="relative pl-12">
                      {/* Timeline dot */}
                      <div className={`absolute left-2 w-5 h-5 rounded-full border-4 ${
                        day.status === 'confirmed' ? 'border-green-500 bg-green-500' :
                        day.status === 'in-progress' ? 'border-purple-500 bg-purple-500' :
                        day.status === 'completed' ? 'border-gray-400 bg-gray-400' :
                        'border-blue-500 bg-white'
                      }`}></div>

                      {/* Content card */}
                      <Card className={`border-2 ${getDayStatusColor(day.status)}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg mb-1">
                                Day {day.day}: {day.destination}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">
                                {new Date(day.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <div className="space-y-2">
                                <div className="text-sm">
                                  <span className="font-medium">Activities:</span>
                                  <ul className="list-disc list-inside ml-2 text-gray-600">
                                    <li>Morning city tour</li>
                                    <li>Visit main attractions</li>
                                    <li>Local cuisine experience</li>
                                  </ul>
                                </div>
                                <div className="flex space-x-4 text-sm">
                                  <span><strong>Accommodation:</strong> Hotel Paradise</span>
                                  <span><strong>Meal Plan:</strong> HB</span>
                                </div>
                              </div>
                            </div>
                            <Badge className={`${
                              day.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              day.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                              day.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {day.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Status Legend:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-4 border-blue-500 bg-white mr-2"></div>
                    <span className="text-sm">Planned</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-4 border-green-500 bg-green-500 mr-2"></div>
                    <span className="text-sm">Confirmed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-4 border-purple-500 bg-purple-500 mr-2"></div>
                    <span className="text-sm">In Progress</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-4 border-gray-400 bg-gray-400 mr-2"></div>
                    <span className="text-sm">Completed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
