import { MotionPage } from '../components/shared'
import { Hero } from '../sections/home/Hero'
import { ServiceStrip } from '../sections/home/ServiceStrip'
import { Mission } from '../sections/home/Mission'
import { CommunityTable } from '../sections/home/CommunityTable'
import { Teaching } from '../sections/home/Teaching'
import { Memories } from '../sections/home/Memories'
import { Invitation } from '../sections/home/Invitation'

export function Home() {
  return <MotionPage className="home-page">
    <Hero />
    <ServiceStrip />
    <Mission />
    <CommunityTable />
    <Teaching />
    <Memories />
    <Invitation />
  </MotionPage>
}
