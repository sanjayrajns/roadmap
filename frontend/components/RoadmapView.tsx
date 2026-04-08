import React from 'react';

interface Stage {
  stage_name: string;
  skills: string[];
  recommended_projects: string[];
}

interface Roadmap {
  role: string;
  stages: Stage[];
}

export default function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  if (!roadmap || !roadmap.stages) return null;

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 'calc(var(--base-spacing) * 12)' }}>
        Your {roadmap.role.toUpperCase()} Roadmap
      </h2>
      
      <div style={{ paddingLeft: 'calc(var(--base-spacing) * 4)' }}>
        {roadmap.stages.map((stage, idx) => (
          <div key={idx} className="timeline-item">
            <div className="timeline-dot" />
            
            <div className="panel" style={{ margin: 0 }}>
              <h3 style={{ marginBottom: 'calc(var(--base-spacing) * 4)' }}>
                {stage.stage_name}
              </h3>
              
              <div style={{ marginBottom: 'calc(var(--base-spacing) * 4)' }}>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'calc(var(--base-spacing) * 2)'}}>
                  Key Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'calc(var(--base-spacing) * 2)' }}>
                  {stage.skills?.map((skill, sIdx) => (
                    <span key={sIdx} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {stage.recommended_projects?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'calc(var(--base-spacing) * 2)'}}>
                    Projects To Build
                  </h4>
                  <ul style={{ listStyleType: 'disc', paddingLeft: 'calc(var(--base-spacing) * 4)', fontSize: '14px' }}>
                    {stage.recommended_projects.map((proj, pIdx) => (
                      <li key={pIdx} style={{ marginBottom: 'calc(var(--base-spacing) * 1)' }}>{proj}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
