import { NextRequest, NextResponse } from 'next/server';

interface DemandRequest {
  id: string;
  artistName: string;
  location: string;
  venue: string;
  requestedBy: string;
  votes: number;
  status: 'pending' | 'approved' | 'rejected' | 'confirmed';
  createdAt: Date;
  description?: string;
  expectedDate?: string;
  ticketPrice?: string;
}

// In-memory storage for demo (in production, use database)
let demands: DemandRequest[] = [
  {
    id: '1',
    artistName: 'Vybz Kartel',
    location: 'Kingston, Jamaica',
    venue: 'Emancipation Park',
    requestedBy: 'DancehallFan2024',
    votes: 1250,
    status: 'approved',
    createdAt: new Date('2024-01-15'),
    description: 'World Boss needs to perform in Kingston! The energy would be unmatched.',
    expectedDate: '2024-06-15'
  },
  {
    id: '2',
    artistName: 'Shenseea',
    location: 'Montego Bay, Jamaica',
    venue: 'Aqueduct',
    requestedBy: 'MoBayVibes',
    votes: 890,
    status: 'pending',
    createdAt: new Date('2024-01-20'),
    description: 'Shenseea would kill it in MoBay! Perfect venue for her energy.'
  },
  {
    id: '3',
    artistName: 'Skillibeng',
    location: 'Ocho Rios, Jamaica',
    venue: 'Dunn\'s River Falls Park',
    requestedBy: 'StThomasVibes',
    votes: 567,
    status: 'confirmed',
    createdAt: new Date('2024-01-10'),
    description: 'Skillibeng representing St. Thomas in Ocho Rios!',
    expectedDate: '2024-05-20',
    ticketPrice: '$40-80'
  },
  {
    id: '4',
    artistName: 'Popcaan',
    location: 'Port Antonio, Jamaica',
    venue: 'Frenchman\'s Cove',
    requestedBy: 'PortAntonioCrew',
    votes: 432,
    status: 'pending',
    createdAt: new Date('2024-01-25'),
    description: 'Unruly Boss in Port Antonio would be legendary!'
  },
  {
    id: '5',
    artistName: 'Koffee',
    location: 'Negril, Jamaica',
    venue: 'Seven Mile Beach',
    requestedBy: 'NegrilSunset',
    votes: 678,
    status: 'approved',
    createdAt: new Date('2024-01-18'),
    description: 'Koffee\'s vibes would be perfect for a sunset concert in Negril.',
    expectedDate: '2024-07-10'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredDemands = demands;

    // Apply search filter
    if (search) {
      filteredDemands = filteredDemands.filter(demand =>
        demand.artistName.toLowerCase().includes(search.toLowerCase()) ||
        demand.location.toLowerCase().includes(search.toLowerCase()) ||
        demand.venue.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filteredDemands = filteredDemands.filter(demand => demand.status === status);
    }

    // Sort by votes (descending) and then by creation date (descending)
    filteredDemands.sort((a, b) => {
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Apply limit
    filteredDemands = filteredDemands.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: filteredDemands,
      total: filteredDemands.length,
      filters: { search, status, limit }
    });

  } catch (error) {
    console.error('Error fetching demands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demands' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artistName, location, venue, description, requestedBy } = body;

    // Validate required fields
    if (!artistName || !location || !venue) {
      return NextResponse.json(
        { error: 'Artist name, location, and venue are required' },
        { status: 400 }
      );
    }

    // Create new demand
    const newDemand: DemandRequest = {
      id: Date.now().toString(),
      artistName,
      location,
      venue,
      requestedBy: requestedBy || 'Anonymous',
      votes: 1,
      status: 'pending',
      createdAt: new Date(),
      description
    };

    // Add to demands array
    demands.unshift(newDemand);

    console.log(`✅ New demand created: ${artistName} in ${location}`);

    return NextResponse.json({
      success: true,
      data: newDemand,
      message: 'Demand created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating demand:', error);
    return NextResponse.json(
      { error: 'Failed to create demand' },
      { status: 500 }
    );
  }
} 