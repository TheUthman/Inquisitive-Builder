export const profile = {
  name: 'Your name here',
  role: 'Software engineer · curious by nature',
  headline: 'Curiosity, in progress.',
  shortBio: 'I like understanding things. And building them.',
  biography: 'I care about thoughtful interfaces, dependable systems, and the quiet craft of making something feel simple after the hard thinking is done.',
  location: 'Somewhere with good coffee',
  email: 'hello@example.com',
  availability: 'Open to thoughtful collaborations',
  education: [{ qualification: 'Your course or learning path', institution: 'Add your institution', year: 'YOUR STORY' }],
  interests: ['Thoughtful interfaces', 'Dependable systems', 'Creative experiments'],
  socialLinks: [{ label: 'GitHub', url: '' }, { label: 'LinkedIn', url: '' }],
}

export const projects = [
  {
    id: 'signal-notes',
    slug: 'signal-notes',
    title: 'Signal / noise',
    category: 'Product',
    summary: 'A quieter way to keep up with the ideas worth keeping.',
    year: '2026',
    featured: true,
    art: 'signal',
    color: '#e6b16e',
    role: 'Product design · Frontend engineering',
    challenge: 'Reading lists tend to grow faster than the attention available to read them. This sample concept explores a calmer way to collect, sort and return to useful ideas.',
    approach: 'A small, keyboard-friendly workspace puts saved links, personal notes and reading progress in one place. The visual system uses warm paper tones and a restrained signal-orange accent.',
    outcome: 'A sample case study for exploring clear information hierarchy, useful empty states and interfaces that invite a slower pace.',
    stack: ['React', 'TypeScript', 'Vite', 'CSS tokens'],
    links: [],
  },
  {
    id: 'common-ground',
    slug: 'common-ground',
    title: 'Common ground',
    category: 'Community',
    summary: 'A neighborhood noticeboard for sharing the things that bring people together.',
    year: '2025',
    featured: true,
    art: 'common',
    color: '#93b8a2',
    role: 'Research · Interaction design · Development',
    challenge: 'Local information is often scattered across group chats, flyers and social feeds. This concept looks at how nearby events can feel easier to discover without adding another noisy feed.',
    approach: 'Events are organized around place and time, with simple topic filters and clear accessibility information. A map is intentionally replaced by a readable neighborhood list.',
    outcome: 'A sample project focused on progressive disclosure, responsive layouts and making practical details easy to scan.',
    stack: ['React', 'Vite', 'REST API', 'Accessibility'],
    links: [],
  },
  {
    id: 'tiny-systems',
    slug: 'tiny-systems',
    title: 'Tiny systems',
    category: 'Experiment',
    summary: 'A collection of small tools for noticing patterns in everyday routines.',
    year: '2025',
    featured: true,
    art: 'tiny',
    color: '#a6a5ca',
    role: 'Concept · Creative coding',
    challenge: 'Personal tracking can quickly become a second job. This experiment asks how a tool can make a pattern visible without turning a person into a dashboard.',
    approach: 'A handful of one-purpose widgets use simple shapes, gentle motion and plain-language reflections instead of streaks or scores.',
    outcome: 'An ongoing sample playground for trying out low-pressure interactions and data visualization ideas.',
    stack: ['React', 'Framer Motion', 'SVG', 'CSS'],
    links: [],
  },
]

export const articles = [
  {
    id: 'making-room-to-notice',
    slug: 'making-room-to-notice',
    title: 'Making room to notice',
    excerpt: 'A few thoughts on designing software that leaves people a little breathing room.',
    date: '2026-03-18',
    readTime: '4 min read',
    tags: ['Design', 'Process'],
    body: [
      'Good tools do not need to fill every quiet moment. Sometimes the most useful thing an interface can do is make the next step clear, then get out of the way.',
      'This note is a placeholder for a real reflection. It is a reminder to write about the details behind a decision: what felt noisy, what was removed, and what became easier to understand.',
      'The best version of a portfolio should sound like its owner. Replace these sample paragraphs with your own voice before publishing.',
    ],
  },
  {
    id: 'the-smallest-useful-thing',
    slug: 'the-smallest-useful-thing',
    title: 'The smallest useful thing',
    excerpt: 'Starting with the smallest complete slice can make a big idea easier to learn from.',
    date: '2025-11-04',
    readTime: '3 min read',
    tags: ['Engineering', 'Learning'],
    body: [
      'A prototype is most helpful when it answers a real question. Before adding another feature, it can be worth asking which uncertainty the next change will help resolve.',
      'This sample entry stands in for an article about building in small, complete slices. Replace it with a note from your own practice.',
    ],
  },
  {
    id: 'notes-from-a-side-project',
    slug: 'notes-from-a-side-project',
    title: 'Notes from a side project',
    excerpt: 'What an unfinished project can teach you about the questions you keep returning to.',
    date: '2025-06-12',
    readTime: '5 min read',
    tags: ['Reflection', 'Making'],
    body: [
      'A side project does not need to become a product to be useful. It can be a place to follow a question, learn a tool, or make a small thing that brings an idea into focus.',
      'This is sample journal content. Add a real story, a useful detail, and the lesson you want a future reader to take with them.',
    ],
  },
]

export const explorations = [
  {
    number: '01',
    title: 'Interfaces for slowing down',
    type: 'Ongoing question',
    description: 'What does a digital space feel like when it is designed to make room, not take it?',
    art: 'orbit',
  },
  {
    number: '02',
    title: 'A tiny desk observatory',
    type: 'Weekend experiment',
    description: 'A small sensor, a few dots on a screen, and an excuse to look closer at the weather.',
    art: 'weather',
  },
  {
    number: '03',
    title: 'Notes from the margins',
    type: 'Reading list',
    description: 'Fragments from books, conversations and the unexpected connections between them.',
    art: 'notes',
  },
]

export function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.content)) return payload.content
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data
  return []
}
