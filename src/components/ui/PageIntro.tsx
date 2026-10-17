
export function PageIntro({ label, title, description }: { label?: string; title: string; description?: string }) {
  return <div className="page-intro container">{label && <p className="eyebrow">{label}</p>}<h1>{title}</h1>{description && <p className="intro-description">{description}</p>}</div>
}
