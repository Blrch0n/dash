"use client";

import React, { useState } from "react";

const TeamPage = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CEO & Founder",
      department: "Leadership",
      bio: "Sarah founded the company with a vision to create innovative digital solutions. With over 10 years of experience in tech leadership, she guides our strategic direction and company culture.",
      skills: [
        "Strategic Planning",
        "Team Leadership",
        "Business Development",
        "Public Speaking",
      ],
      email: "sarah@company.com",
      linkedin: "#",
      twitter: "#",
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Lead Developer",
      department: "Engineering",
      bio: "Michael is our technical architect, specializing in full-stack development and system design. He's passionate about clean code and mentoring junior developers.",
      skills: ["React", "Node.js", "Python", "System Architecture"],
      email: "michael@company.com",
      linkedin: "#",
      github: "#",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "UX/UI Designer",
      department: "Design",
      bio: "Emily creates beautiful and intuitive user experiences. Her design philosophy centers around user empathy and accessible design principles.",
      skills: [
        "User Research",
        "Prototyping",
        "Visual Design",
        "Accessibility",
      ],
      email: "emily@company.com",
      linkedin: "#",
      dribbble: "#",
    },
    {
      id: 4,
      name: "David Kim",
      position: "Project Manager",
      department: "Operations",
      bio: "David ensures our projects run smoothly from conception to delivery. His agile approach and communication skills keep teams aligned and productive.",
      skills: ["Agile", "Scrum", "Risk Management", "Client Relations"],
      email: "david@company.com",
      linkedin: "#",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      position: "Marketing Director",
      department: "Marketing",
      bio: "Lisa drives our marketing initiatives and brand strategy. She's an expert in digital marketing and has a keen eye for emerging trends.",
      skills: [
        "Digital Marketing",
        "Brand Strategy",
        "Content Creation",
        "Analytics",
      ],
      email: "lisa@company.com",
      linkedin: "#",
      twitter: "#",
    },
    {
      id: 6,
      name: "Alex Turner",
      position: "DevOps Engineer",
      department: "Engineering",
      bio: "Alex maintains our infrastructure and deployment pipelines. His expertise in cloud technologies ensures our applications are scalable and reliable.",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      email: "alex@company.com",
      linkedin: "#",
      github: "#",
    },
  ];

  const departments = [
    "All",
    "Leadership",
    "Engineering",
    "Design",
    "Operations",
    "Marketing",
  ];
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const filteredMembers =
    selectedDepartment === "All"
      ? teamMembers
      : teamMembers.filter(
          (member) => member.department === selectedDepartment
        );

  return (
    <div className="team-page">
      <div className="team-container">
        {/* Header Section */}
        <div className="team-header">
          <h1>Meet Our Team</h1>
          <p>
            Passionate professionals dedicated to delivering exceptional results
          </p>
        </div>

        {/* Department Filter */}
        <div className="department-filter">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`dept-btn ${
                selectedDepartment === dept ? "active" : ""
              }`}
              onClick={() => setSelectedDepartment(dept)}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Team Grid */}
        <div className="team-grid">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="team-member-card"
              onClick={() => setSelectedMember(member)}
            >
              <div className="member-avatar">
                {member.name
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")}
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="member-position">{member.position}</p>
                <p className="member-department">{member.department}</p>
                <div className="member-skills">
                  {member.skills.slice(0, 2).map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 2 && (
                    <span className="skill-tag more">
                      +{member.skills.length - 2}
                    </span>
                  )}
                </div>
              </div>
              <div className="member-overlay">
                <button className="view-profile-btn">View Profile</button>
              </div>
            </div>
          ))}
        </div>

        {/* Member Modal */}
        {selectedMember && (
          <div className="member-modal" onClick={() => setSelectedMember(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-btn"
                onClick={() => setSelectedMember(null)}
              >
                ×
              </button>
              <div className="modal-header">
                <div className="modal-avatar">
                  {selectedMember.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
                </div>
                <div className="modal-info">
                  <h2>{selectedMember.name}</h2>
                  <p className="modal-position">{selectedMember.position}</p>
                  <p className="modal-department">
                    {selectedMember.department}
                  </p>
                </div>
              </div>
              <div className="modal-body">
                <div className="modal-section">
                  <h3>About</h3>
                  <p>{selectedMember.bio}</p>
                </div>

                <div className="modal-section">
                  <h3>Skills & Expertise</h3>
                  <div className="skills-grid">
                    {selectedMember.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Connect</h3>
                  <div className="social-links">
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="social-link email"
                    >
                      Email
                    </a>
                    {selectedMember.linkedin && (
                      <a
                        href={selectedMember.linkedin}
                        className="social-link linkedin"
                      >
                        LinkedIn
                      </a>
                    )}
                    {selectedMember.twitter && (
                      <a
                        href={selectedMember.twitter}
                        className="social-link twitter"
                      >
                        Twitter
                      </a>
                    )}
                    {selectedMember.github && (
                      <a
                        href={selectedMember.github}
                        className="social-link github"
                      >
                        GitHub
                      </a>
                    )}
                    {selectedMember.dribbble && (
                      <a
                        href={selectedMember.dribbble}
                        className="social-link dribbble"
                      >
                        Dribbble
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Stats */}
        <div className="team-stats">
          <div className="stat-card">
            <h3>15+</h3>
            <p>Team Members</p>
          </div>
          <div className="stat-card">
            <h3>5</h3>
            <p>Departments</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Years Combined Experience</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Collaboration</p>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="join-us-section">
          <h2>Join Our Team</h2>
          <p>
            We're always looking for talented individuals to join our growing
            team.
          </p>
          <div className="join-actions">
            <button className="btn-primary">View Open Positions</button>
            <button className="btn-secondary">Send Resume</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
