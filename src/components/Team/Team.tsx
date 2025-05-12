import React from 'react'
import Section from '@/components/Section'
import StaffCard from '@/components/Team/_components/StaffCard'

interface StaffMember {
  imageUrl: string
  name: string
  description: string
}

const staffMembers: StaffMember[] = [
  {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/likq-38cdb.firebasestorage.app/o/staff%2F37f83e098b9448d6934ddb38623e534d51c73636.jpg?alt=media&token=20bf3b30-492d-49a4-82bc-8d885ac0292e',
    name: 'Noppharach Jitphongampai',
    description: 'CEO/Founder, Music Producer\nand Sound Engineer'
  },
  {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/likq-38cdb.firebasestorage.app/o/staff%2FS01_0028.jpg?alt=media&token=91021756-1c60-4404-85c0-8853c0db592f',
    name: 'Phuree Kanusont',
    description: 'Co-Founder, Artist, Songwriter\nand Web Developer'
  },
  {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/likq-38cdb.firebasestorage.app/o/staff%2Faedcf2d83eb07ee0b6189d7c3fb77b2016fe7205.jpg?alt=media&token=a88401ae-59c2-47bb-b050-c1d142ab0420',
    name: 'Natpimol Metheecharoenwat',
    description: 'Creative and Graphic Designer'
  }
]

const Team = () => {
  return (
    <Section className="min-h-[70dvh]" title="Our Team">
      <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-4">
        {staffMembers.map((staffMember: StaffMember) => (
          <StaffCard key={staffMember.name} {...staffMember} />
        ))}
      </div>
    </Section>
  )
}

export default Team
