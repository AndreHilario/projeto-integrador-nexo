import { ArrowUpRight, Building2, Clock3, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { JobSummary } from '../types'
import { unknownCompanyDisplay, formatRelativeDate, jobStatusLabel } from '../utils/format'

interface JobCardProps {
  job: JobSummary
  companyView?: boolean
  companyName?: string
  companyLogo?: string
}

export function JobCard({ job, companyView = false, companyName, companyLogo }: JobCardProps) {
  const name = companyName ?? unknownCompanyDisplay.name
  const logo = companyLogo ?? unknownCompanyDisplay.logo

  return (
    <Link className={`job-card surface ${job.status !== 'active' ? 'job-card-muted' : ''}`} to={companyView ? `/empresa/vagas/${job.id}` : `/vagas/${job.id}`}>
      <div className="job-card-top">
        <div className="company-logo company-logo-blue">{logo}</div>
        <span className={`status-dot status-${job.status}`}>{companyView ? jobStatusLabel[job.status] : 'Nova'}</span>
      </div>
      <div>
        <h3>{job.title}</h3>
        <p className="company-name"><Building2 size={15} /> {name}</p>
      </div>
      <div className="job-meta-row">
        <span><MapPin size={15} />{job.location}</span>
        <span><Clock3 size={15} />{job.workplace}</span>
      </div>
      <div className="tag-row">
        <span className="tag">{job.experience}</span>
        <span className="tag">{job.employmentType}</span>
        <span className="tag">{job.salary}</span>
      </div>
      <div className="job-card-footer">
        <span>{companyView ? `${job.views} visualizações` : formatRelativeDate(job.postedAt)}</span>
        <span className="card-arrow"><ArrowUpRight size={18} /></span>
      </div>
    </Link>
  )
}
