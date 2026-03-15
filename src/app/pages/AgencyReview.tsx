import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Calendar, MapPin, Users, Eye, CircleCheck, CircleX, CircleAlert } from 'lucide-react';
import { toast } from 'sonner';

const mockPendingReviews = [
  {
    id: 1,
    guestName: 'John Doe',
    tripName: 'European Adventure',
    destination: 'Paris → Rome → Barcelona',
    startDate: '2026-03-15',
    endDate: '2026-03-25',
    daysCount: 10,
    submittedDate: '2026-01-05',
    status: 'pending'
  },
  {
    id: 2,
    guestName: 'Jane Smith',
    tripName: 'Asian Discovery',
    destination: 'Tokyo → Kyoto → Osaka',
    startDate: '2026-04-10',
    endDate: '2026-04-20',
    daysCount: 10,
    submittedDate: '2026-01-06',
    status: 'pending'
  },
  {
    id: 3,
    guestName: 'Mike Johnson',
    tripName: 'Safari Adventure',
    destination: 'Kenya ��� Tanzania',
    startDate: '2026-05-01',
    endDate: '2026-05-10',
    daysCount: 9,
    submittedDate: '2026-01-04',
    status: 'pending'
  },
];

const mockItineraryDetails = {
  days: [
    {
      day: 1,
      destination: 'Paris, France',
      attractions: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'],
      mealPlan: 'BB',
      accommodation: 'Hotel'
    },
    {
      day: 2,
      destination: 'Paris, France',
      attractions: ['Notre-Dame Cathedral', 'Arc de Triomphe', 'Champs-Élysées'],
      mealPlan: 'HB',
      accommodation: 'Hotel'
    },
    {
      day: 3,
      destination: 'Rome, Italy',
      attractions: ['Colosseum', 'Roman Forum', 'Trevi Fountain'],
      mealPlan: 'FB',
      accommodation: 'Hotel'
    },
  ]
};

export default function AgencyReview() {
  const navigate = useNavigate();
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [correctionNotes, setCorrectionNotes] = useState('');

  const handleApprove = (id: number) => {
    toast.success('Itinerary approved successfully');
    navigate(`/agency/pricing/${id}`);
  };

  const handleReturnForCorrection = () => {
    toast.info('Itinerary returned to guest for corrections');
    setSelectedItinerary(null);
    setCorrectionNotes('');
  };

  const handleReject = () => {
    toast.error('Itinerary rejected');
    setSelectedItinerary(null);
  };

  return (
    <Layout title="Pending Itinerary Reviews" role="agency">
      <div className="space-y-6">
        <div className="grid gap-4">
          {mockPendingReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{review.tripName}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Users className="h-3 w-3 mr-1" />
                      Guest: {review.guestName}
                    </CardDescription>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Pending Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {review.destination}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(review.startDate).toLocaleDateString()} - {new Date(review.endDate).toLocaleDateString()}
                    <span className="ml-2">({review.daysCount} days)</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Submitted: {new Date(review.submittedDate).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-2 pt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedItinerary(review)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{review.tripName}</DialogTitle>
                          <DialogDescription>
                            Review and provide feedback on this itinerary
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          {/* Guest Info */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Trip Information</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Guest:</span> {review.guestName}
                              </div>
                              <div>
                                <span className="text-gray-600">Duration:</span> {review.daysCount} days
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-600">Route:</span> {review.destination}
                              </div>
                            </div>
                          </div>

                          {/* Itinerary Details */}
                          <div>
                            <h4 className="font-semibold mb-3">Day-by-Day Plan</h4>
                            <div className="space-y-4">
                              {mockItineraryDetails.days.map((day) => (
                                <Card key={day.day}>
                                  <CardHeader className="py-3">
                                    <CardTitle className="text-base">Day {day.day}: {day.destination}</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div>
                                      <span className="text-sm font-medium">Attractions:</span>
                                      <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                        {day.attractions.map((attr, i) => (
                                          <li key={i}>{attr}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="flex space-x-4 text-sm">
                                      <span><strong>Meal Plan:</strong> {day.mealPlan}</span>
                                      <span><strong>Accommodation:</strong> {day.accommodation}</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* Route Feasibility Notes */}
                          <div className="space-y-2">
                            <Label htmlFor="reviewNotes">Route Feasibility & Expert Notes</Label>
                            <Textarea
                              id="reviewNotes"
                              placeholder="Add notes about route feasibility, timing, recommendations..."
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                              rows={4}
                            />
                          </div>

                          {/* Correction Notes */}
                          <div className="space-y-2">
                            <Label htmlFor="correctionNotes">Correction Notes (if returning to guest)</Label>
                            <Textarea
                              id="correctionNotes"
                              placeholder="Specify what needs to be corrected..."
                              value={correctionNotes}
                              onChange={(e) => setCorrectionNotes(e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>

                        <DialogFooter className="flex space-x-2">
                          <Button
                            variant="destructive"
                            onClick={handleReject}
                          >
                            <CircleX className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleReturnForCorrection}
                          >
                            <CircleAlert className="h-4 w-4 mr-2" />
                            Return for Correction
                          </Button>
                          <Button
                            onClick={() => handleApprove(review.id)}
                          >
                            <CircleCheck className="h-4 w-4 mr-2" />
                            Approve & Continue to Pricing
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      size="sm"
                      onClick={() => handleApprove(review.id)}
                    >
                      <CircleCheck className="h-4 w-4 mr-2" />
                      Quick Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}