import { createRoot } from 'react-dom/client'
import App from '../../src/App'
import { defaultSite } from '../../src/content/useContent'
import { applySiteContentPatch } from '../../src/content/editableFields'
import '../../src/index.css'
const site = applySiteContentPatch(defaultSite, {
  'service.time': '10 AM',
  'service.city': 'Example City',
  'service.addressLine': '123 Example Street',
  'contactEmail': 'hello@example.org',
  'home.hero.headingLine1': 'Welcome home',
  'home.hero.headingLine2': 'A place to belong.',
  'home.invitation.description': 'A published invitation from the future portal.',
})
history.replaceState(null, '', '/')
createRoot(document.getElementById('root')!).render(<App content={{site}} />)
