import { NextRequest, NextResponse } from 'next/server';

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const demandId = params.id;
    
    // Find the demand
    const demandIndex = demands.findIndex(d => d.id === demandId);
    
    if (demandIndex === -1) {
      return NextResponse.json(
        { error: 'Demand not found' },
        { status: 404 }
      );
    }

    // Increment votes
    demands[demandIndex].votes += 1;

    console.log(`✅ Vote added to demand ${demandId}: ${demands[demandIndex].artistName}`);

    return NextResponse.json({
      success: true,
      data: demands[demandIndex],
      message: 'Vote added successfully'
    });

  } catch (error) {
    console.error('Error voting on demand:', error);
    return NextResponse.json(
      { error: 'Failed to vote on demand' },
      { status: 500 }
    );
  }
} 