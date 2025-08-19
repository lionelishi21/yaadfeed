"use client";
import { Mic, Music, Disc2 } from 'lucide-react'

const features = [
  {
    name: 'Latest Releases',
    description: 'Stay up-to-date with brand new tracks and albums from the biggest names in dancehall and reggae.',
    href: '#',
    icon: Music,
  },
  {
    name: 'Artist Interviews',
    description: 'Get exclusive insights and stories from the legends and rising stars shaping the dancehall scene.',
    href: '#',
    icon: Mic,
  },
  {
    name: 'Event Coverage',
    description: 'Experience the vibe with live reports, photo galleries, and recaps from the hottest concerts and festivals.',
    href: '#',
    icon: Disc2,
  },
]

export default function SimpleThreeColumnWithSmallIcons() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-logo-primary">LATEST NEWS</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-pretty text-logo-dark sm:text-5xl lg:text-balance">
            Breaking in Dancehall
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            Your one-stop source for the pulse of the island. Fresh tracks, exclusive interviews, and front-row access
            to the most vital sounds in music.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base/7 font-semibold text-logo-dark">
                  <feature.icon aria-hidden="true" className="size-5 flex-none text-logo-primary" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base/7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <a href={feature.href} className="text-sm/6 font-semibold text-logo-primary hover:text-logo-dark">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}