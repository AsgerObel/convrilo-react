import React, { useEffect } from 'react';
import { Calendar, Star, Zap, Users, ArrowRight, CheckCircle, Clock, Target } from 'lucide-react';
import './Updates.css';

function Updates() {
  useEffect(() => {
    // Add scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elementsToAnimate = document.querySelectorAll('.update-card, .feature-card, .stat-card');
    elementsToAnimate.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const updates = [
    {
      date: "December 2024",
      status: "completed",
      title: "Advanced Image Processing Engine",
      description: "Introducing our next-generation image processing engine with 40% faster conversions and support for HEIC, AVIF, and WebP formats. Now with AI-powered quality optimization.",
      features: [
        "40% faster conversion speeds",
        "HEIC to JPG/PNG conversion",
        "AI-powered quality optimization",
        "Batch processing up to 500 files",
        "Smart compression algorithms"
      ],
      icon: <Zap className="update-icon" />
    },
    {
      date: "January 2025",
      status: "in-progress",
      title: "Video Conversion Suite",
      description: "Professional-grade video conversion tools supporting 4K resolution, HDR content, and over 30 video formats. Perfect for content creators and video professionals.",
      features: [
        "4K and 8K resolution support",
        "HDR10 and Dolby Vision",
        "GPU-accelerated encoding",
        "Video trimming and merging",
        "Subtitle embedding"
      ],
      icon: <Target className="update-icon" />
    },
    {
      date: "February 2025",
      status: "planned",
      title: "Cloud Storage Integration",
      description: "Seamlessly connect with Google Drive, Dropbox, OneDrive, and iCloud. Convert files directly from your cloud storage and save results back automatically.",
      features: [
        "Google Drive integration",
        "Dropbox & OneDrive sync",
        "iCloud Photos support",
        "Auto-save to cloud",
        "Shared folder access"
      ],
      icon: <Users className="update-icon" />
    },
    {
      date: "March 2025",
      status: "planned",
      title: "Mobile App Release",
      description: "Native iOS and Android applications bringing the full power of Convrilo to your mobile devices. Convert files on-the-go with offline capabilities.",
      features: [
        "Native iOS & Android apps",
        "Offline conversion support",
        "Camera integration",
        "Share sheet support",
        "Background processing"
      ],
      icon: <Star className="update-icon" />
    }
  ];

  const stats = [
    { label: "Files Converted", value: "2.5M+", icon: <Zap /> },
    { label: "Happy Users", value: "50K+", icon: <Users /> },
    { label: "Formats Supported", value: "40+", icon: <Target /> },
    { label: "Countries Served", value: "120+", icon: <Star /> }
  ];

  const upcomingFeatures = [
    {
      title: "AI-Powered Format Suggestions",
      description: "Smart recommendations based on your file usage patterns and intended use cases.",
      timeline: "Q2 2025"
    },
    {
      title: "Team Collaboration Tools",
      description: "Share conversion projects with your team and collaborate on batch processing workflows.",
      timeline: "Q3 2025"
    },
    {
      title: "API v2.0 Release",
      description: "Enhanced developer API with webhooks, advanced customization, and enterprise features.",
      timeline: "Q3 2025"
    },
    {
      title: "Document OCR & Translation",
      description: "Extract text from images and documents with automatic language translation capabilities.",
      timeline: "Q4 2025"
    }
  ];

  return (
    <main className="main-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      minHeight: '100vh',
      padding: '8rem 1rem 2rem'
    }}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Product Updates & Roadmap</h1>
          <p className="hero-description">
            Stay up-to-date with the latest features, improvements, and upcoming releases.
            We're constantly evolving to provide the best file conversion experience.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Updates Timeline */}
      <section className="updates-section">
        <h2 className="section-title">Recent Updates & Roadmap</h2>
        <p className="section-description">
          Track our progress and see what's coming next. We release new features monthly
          and continuously improve our conversion engines based on user feedback.
        </p>

        <div className="updates-timeline">
          {updates.map((update, index) => (
            <div key={index} className="update-card">
              <div className="update-header">
                <div className="update-meta">
                  <div className={`update-status ${update.status}`}>
                    {update.status === 'completed' && <CheckCircle className="status-icon" />}
                    {update.status === 'in-progress' && <Clock className="status-icon" />}
                    {update.status === 'planned' && <Calendar className="status-icon" />}
                    <span className="status-text">
                      {update.status === 'completed' && 'Completed'}
                      {update.status === 'in-progress' && 'In Progress'}
                      {update.status === 'planned' && 'Planned'}
                    </span>
                  </div>
                  <div className="update-date">{update.date}</div>
                </div>
                <div className="update-icon-wrapper">
                  {update.icon}
                </div>
              </div>

              <div className="update-content">
                <h3 className="update-title">{update.title}</h3>
                <p className="update-description">{update.description}</p>

                <div className="update-features">
                  <h4 className="features-title">Key Features:</h4>
                  <ul className="features-list">
                    {update.features.map((feature, idx) => (
                      <li key={idx} className="feature-item">
                        <CheckCircle className="feature-check" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="upcoming-section">
        <h2 className="section-title">Coming Soon</h2>
        <p className="section-description">
          Exciting features in development that will revolutionize your file conversion workflow.
        </p>

        <div className="upcoming-grid">
          {upcomingFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-timeline">{feature.timeline}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-arrow">
                <ArrowRight className="arrow-icon" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="seo-section">
        <div className="seo-content">
          <h2 className="seo-title">The Future of File Conversion</h2>
          <div className="seo-text">
            <p>
              Convrilo is leading the evolution of online file conversion with cutting-edge technology
              and user-centric design. Our platform supports over 40 file formats including images,
              documents, videos, and audio files, making it the most comprehensive conversion tool available.
            </p>
            <p>
              Whether you're converting HEIC photos from your iPhone, compressing PDFs for email,
              or transforming videos for social media, our AI-powered engines deliver lightning-fast
              results without compromising quality. Join over 50,000 users worldwide who trust
              Convrilo for their daily file conversion needs.
            </p>
            <p>
              Our commitment to privacy means your files are processed securely and automatically
              deleted after conversion. With enterprise-grade security and GDPR compliance,
              Convrilo is the trusted choice for businesses and individuals alike.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h3 className="newsletter-title">Stay Updated</h3>
          <p className="newsletter-description">
            Get notified when new features are released and be the first to try beta features.
          </p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <button className="newsletter-button">
              Subscribe <ArrowRight className="button-icon" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Updates;