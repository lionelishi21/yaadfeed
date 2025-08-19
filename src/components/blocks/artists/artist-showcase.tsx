"use client"
import { useState } from 'react'
import   Button  from '@/components/ui/Button'
import { Card }  from '@/components/Card'
import { Badge } from '@/components/ui/Badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Heart, Play, Users, MapPin, Instagram, Twitter, Music, ChevronLeft, ChevronRight, Filter, TrendingUp, Calendar, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'

interface Artist {
  id: string
  name: string
  image: string
  genres: string[]
  followers: number
  location: string
  latestTrack: {
    title: string
    plays: number
    duration: string
  }
  socialLinks: {
    instagram?: string
    twitter?: string
    music?: string
  }
  isVerified?: boolean
  bookingAvailable?: boolean
}

const featuredArtist = {
  id: 'featured',
  name: 'Zara Clarke',
  image: '/api/placeholder/400/400',
  genres: ['Reggae', 'R&B'],
  followers: 125400,
  location: 'Kingston, Jamaica',
  latestTrack: {
    title: 'Island Dreams',
    plays: 890000,
    duration: '3:24'
  },
  monthlyListeners: 450000,
  latestRelease: {
    title: 'Sunset Vibes EP',
    releaseDate: '2024-01-15',
    tracks: 5
  },
  socialLinks: {
    instagram: '@zaraclarkemusic',
    twitter: '@zaraclarke',
    music: 'spotify'
  },
  isVerified: true,
  bookingAvailable: true,
  streamingStats: {
    spotify: 2100000,
    appleMusic: 850000,
    youtube: 1200000
  }
}

const artists: Artist[] = [
  {
    id: '1',
    name: 'Marcus Thompson',
    image: '/api/placeholder/300/300',
    genres: ['Dancehall', 'Hip-Hop'],
    followers: 48200,
    location: 'Spanish Town',
    latestTrack: {
      title: 'Fire Burnin\'',
      plays: 342000,
      duration: '2:58'
    },
    socialLinks: {
      instagram: '@marcusthompsonmusic',
      twitter: '@marcust',
      music: 'spotify'
    },
    isVerified: true,
    bookingAvailable: true
  },
  {
    id: '2',
    name: 'Keisha Williams',
    image: '/api/placeholder/300/300',
    genres: ['R&B', 'Soul'],
    followers: 32100,
    location: 'Montego Bay',
    latestTrack: {
      title: 'Ocean Breeze',
      plays: 189000,
      duration: '3:45'
    },
    socialLinks: {
      instagram: '@keishawillimsmusic',
      twitter: '@keishawmusic'
    },
    bookingAvailable: false
  },
  {
    id: '3',
    name: 'Jovan Smith',
    image: '/api/placeholder/300/300',
    genres: ['Reggae', 'Folk'],
    followers: 67800,
    location: 'Ocho Rios',
    latestTrack: {
      title: 'Mountain High',
      plays: 445000,
      duration: '4:12'
    },
    socialLinks: {
      instagram: '@jovansmithmusic',
      music: 'apple'
    },
    isVerified: true,
    bookingAvailable: true
  },
  {
    id: '4',
    name: 'Aaliyah Brown',
    image: '/api/placeholder/300/300',
    genres: ['Pop', 'Reggae'],
    followers: 21500,
    location: 'Kingston',
    latestTrack: {
      title: 'Sunshine Day',
      plays: 156000,
      duration: '3:18'
    },
    socialLinks: {
      instagram: '@aaliyahbrownofficial',
      twitter: '@aaliyahb'
    },
    bookingAvailable: true
  },
  {
    id: '5',
    name: 'Devon Campbell',
    image: '/api/placeholder/300/300',
    genres: ['Dancehall', 'Electronic'],
    followers: 39600,
    location: 'Port Antonio',
    latestTrack: {
      title: 'Digital Roots',
      plays: 278000,
      duration: '3:33'
    },
    socialLinks: {
      instagram: '@devoncampbellmusic',
      music: 'spotify'
    },
    isVerified: true,
    bookingAvailable: false
  },
  {
    id: '6',
    name: 'Sasha Green',
    image: '/api/placeholder/300/300',
    genres: ['Jazz', 'R&B'],
    followers: 15800,
    location: 'Negril',
    latestTrack: {
      title: 'Midnight Blues',
      plays: 89000,
      duration: '4:01'
    },
    socialLinks: {
      instagram: '@sashagreenmusic',
      twitter: '@sashagreen'
    },
    bookingAvailable: true
  }
]

export default function ArtistShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set())

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const handleFollow = (artistId: string) => {
    const newFollowed = new Set(followedArtists)
    if (newFollowed.has(artistId)) {
      newFollowed.delete(artistId)
    } else {
      newFollowed.add(artistId)
    }
    setFollowedArtists(newFollowed)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3) % artists.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 3 + artists.length) % artists.length)
  }

  const visibleArtists = artists.slice(currentIndex, currentIndex + 3)

  return (
    <section className="bg-gradient-to-br from-slate-50 to-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
          >
            Rising Voices
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-gray-600"
          >
            Discover Jamaica's next generation of talent
          </motion.p>
        </div>

        {/* Featured Artist Spotlight */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="overflow-hidden border-gray-200 bg-white shadow-lg">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Featured Artist Image */}
              <div className="relative">
                <img
                  src={featuredArtist.image}
                  alt={featuredArtist.name}
                  className="h-full w-full object-cover lg:h-96"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge className="absolute bottom-4 left-4 bg-primary text-primary-foreground">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Featured Artist
                </Badge>
              </div>

              {/* Featured Artist Info */}
              <div className="p-6 lg:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-gray-900">{featuredArtist.name}</h3>
                  {featuredArtist.isVerified && (
                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                  )}
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {featuredArtist.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <div className="mb-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {featuredArtist.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {formatNumber(featuredArtist.followers)} followers
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    {formatNumber(featuredArtist.monthlyListeners)} monthly listeners
                  </div>
                </div>

                {/* Latest Release */}
                <div className="mb-6 rounded-lg bg-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{featuredArtist.latestRelease.title}</h4>
                      <p className="text-sm text-gray-600">
                        {featuredArtist.latestRelease.tracks} tracks • Released {new Date(featuredArtist.latestRelease.releaseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Streaming Stats */}
                <div className="mb-6">
                  <h5 className="mb-3 font-semibold text-gray-900">Streaming Stats</h5>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-primary">{formatNumber(featuredArtist.streamingStats.spotify)}</p>
                      <p className="text-xs text-gray-600">Spotify</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{formatNumber(featuredArtist.streamingStats.appleMusic)}</p>
                      <p className="text-xs text-gray-600">Apple Music</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{formatNumber(featuredArtist.streamingStats.youtube)}</p>
                      <p className="text-xs text-gray-600">YouTube</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleFollow(featuredArtist.id)}
                    className={`flex-1 ${followedArtists.has(featuredArtist.id) ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${followedArtists.has(featuredArtist.id) ? 'fill-current' : ''}`} />
                    {followedArtists.has(featuredArtist.id) ? 'Following' : 'Follow'}
                  </Button>
                  {featuredArtist.bookingAvailable && (
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Book
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Filter by:</span>
          </div>
          
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="reggae">Reggae</SelectItem>
              <SelectItem value="dancehall">Dancehall</SelectItem>
              <SelectItem value="r&b">R&B</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="kingston">Kingston</SelectItem>
              <SelectItem value="montego-bay">Montego Bay</SelectItem>
              <SelectItem value="spanish-town">Spanish Town</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Artists Grid - Desktop */}
        <div className="hidden lg:block">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
              >
                <Card className="group overflow-hidden border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
                  {/* Artist Image */}
                  <div className="relative">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <Button
                      size="sm"
                      className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-primary p-0 opacity-0 transition-all group-hover:opacity-100"
                    >
                      <Play className="h-4 w-4 text-primary-foreground" />
                    </Button>
                  </div>

                  <div className="p-4">
                    {/* Artist Info */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{artist.name}</h4>
                        {artist.isVerified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <p className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {artist.location}
                      </p>
                    </div>

                    {/* Genres */}
                    <div className="mb-3 flex flex-wrap gap-1">
                      {artist.genres.slice(0, 2).map((genre) => (
                        <Badge key={genre} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                      {artist.genres.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{artist.genres.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="mb-4 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {formatNumber(artist.followers)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {formatNumber(artist.latestTrack.plays)}
                        </span>
                      </div>
                    </div>

                    {/* Latest Track */}
                    <div className="mb-4 rounded bg-gray-100 p-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{artist.latestTrack.title}</p>
                          <p className="text-xs text-gray-600">{artist.latestTrack.duration}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="mb-4 flex gap-2">
                      {artist.socialLinks.instagram && (
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-primary">
                          <Instagram className="h-3 w-3" />
                        </Button>
                      )}
                      {artist.socialLinks.twitter && (
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-primary">
                          <Twitter className="h-3 w-3" />
                        </Button>
                      )}
                      {artist.socialLinks.music && (
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-gray-500 hover:text-primary">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleFollow(artist.id)}
                        className={`flex-1 ${followedArtists.has(artist.id) ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                      >
                        <Heart className={`mr-1 h-3 w-3 ${followedArtists.has(artist.id) ? 'fill-current' : ''}`} />
                        {followedArtists.has(artist.id) ? 'Following' : 'Follow'}
                      </Button>
                      {artist.bookingAvailable && (
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Calendar className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Artists Carousel - Mobile */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Carousel Controls */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Rising Artists</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={prevSlide}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={nextSlide}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Carousel Content */}
            <div className="overflow-hidden">
              <motion.div 
                className="flex gap-4"
                animate={{ x: -currentIndex * 280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {artists.map((artist) => (
                  <motion.div
                    key={artist.id}
                    className="w-64 flex-shrink-0"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="overflow-hidden border-border bg-card">
                      {/* Artist Image */}
                      <div className="relative">
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="aspect-square w-full object-cover"
                        />
                        <Button
                          size="sm"
                          className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-primary p-0"
                        >
                          <Play className="h-4 w-4 text-primary-foreground" />
                        </Button>
                      </div>

                      <div className="p-4">
                        {/* Artist Info */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{artist.name}</h4>
                            {artist.isVerified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {artist.location}
                          </p>
                        </div>

                        {/* Genres */}
                        <div className="mb-3 flex flex-wrap gap-1">
                          {artist.genres.slice(0, 2).map((genre) => (
                            <Badge key={genre} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {formatNumber(artist.followers)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            {formatNumber(artist.latestTrack.plays)}
                          </span>
                        </div>

                        {/* Actions */}
                        <Button
                          size="sm"
                          onClick={() => handleFollow(artist.id)}
                          className={`w-full ${followedArtists.has(artist.id) ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                        >
                          <Heart className={`mr-1 h-3 w-3 ${followedArtists.has(artist.id) ? 'fill-current' : ''}`} />
                          {followedArtists.has(artist.id) ? 'Following' : 'Follow'}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}