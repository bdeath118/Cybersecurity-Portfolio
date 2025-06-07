// Standalone Under Construction Page
// This can be deployed as a separate application or used to replace the main site

export default function UnderConstructionStandalone() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Under Construction | Cyber Security Portfolio</title>
        <meta
          name="description"
          content="This site is currently under construction. Please check back soon for updates."
        />
        <meta name="robots" content="noindex, nofollow" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              color: white;
              overflow-x: hidden;
            }
            
            .container {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              position: relative;
            }
            
            .background {
              position: absolute;
              inset: 0;
              background-image: url('/images/background.jpeg');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }
            
            .overlay {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.6);
            }
            
            .content {
              text-align: center;
              max-width: 800px;
              position: relative;
              z-index: 10;
            }
            
            .icon-section {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 1rem;
              margin-bottom: 2rem;
            }
            
            .shield-icon {
              width: 4rem;
              height: 4rem;
              color: #3b82f6;
              animation: pulse 2s infinite;
            }
            
            .wrench-icon {
              width: 3rem;
              height: 3rem;
              color: #eab308;
              animation: bounce 1s infinite;
            }
            
            .main-title {
              font-size: clamp(3rem, 8vw, 6rem);
              font-weight: bold;
              margin-bottom: 1.5rem;
              line-height: 1.1;
            }
            
            .title-accent {
              color: #3b82f6;
            }
            
            .subtitle {
              font-size: clamp(1.125rem, 3vw, 1.5rem);
              color: #e5e7eb;
              margin-bottom: 2rem;
              line-height: 1.6;
            }
            
            .status-indicators {
              display: flex;
              flex-wrap: wrap;
              gap: 1rem;
              justify-content: center;
              margin-bottom: 3rem;
            }
            
            .status-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-size: 0.875rem;
              font-weight: 500;
            }
            
            .status-dot {
              width: 0.75rem;
              height: 0.75rem;
              border-radius: 50%;
              animation: pulse 2s infinite;
            }
            
            .status-active {
              color: #10b981;
            }
            
            .status-active .status-dot {
              background-color: #10b981;
            }
            
            .status-pending {
              color: #f59e0b;
            }
            
            .progress-container {
              max-width: 24rem;
              margin: 0 auto 2rem;
            }
            
            .progress-header {
              display: flex;
              justify-content: space-between;
              font-size: 0.875rem;
              color: #d1d5db;
              margin-bottom: 0.5rem;
            }
            
            .progress-bar {
              width: 100%;
              height: 0.5rem;
              background-color: #374151;
              border-radius: 9999px;
              overflow: hidden;
            }
            
            .progress-fill {
              height: 100%;
              width: 75%;
              background: linear-gradient(to right, #3b82f6, #1d4ed8);
              border-radius: 9999px;
              transition: width 1s ease-out;
            }
            
            .buttons {
              display: flex;
              flex-wrap: wrap;
              gap: 1rem;
              justify-content: center;
              margin-bottom: 3rem;
            }
            
            .button {
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-weight: 500;
              text-decoration: none;
              transition: all 0.2s;
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
            }
            
            .button-outline {
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: white;
            }
            
            .button-outline:hover {
              background: rgba(255, 255, 255, 0.2);
            }
            
            .button-primary {
              background: #3b82f6;
              color: white;
            }
            
            .button-primary:hover {
              background: #2563eb;
            }
            
            .footer-note {
              font-size: 0.875rem;
              color: #9ca3af;
            }
            
            .animated-bg {
              position: absolute;
              inset: 0;
              overflow: hidden;
              pointer-events: none;
            }
            
            .floating-dot {
              position: absolute;
              border-radius: 50%;
              opacity: 0.2;
            }
            
            .dot-1 {
              top: 25%;
              left: 25%;
              width: 0.5rem;
              height: 0.5rem;
              background: #3b82f6;
              animation: ping 2s infinite;
            }
            
            .dot-2 {
              top: 75%;
              right: 25%;
              width: 0.25rem;
              height: 0.25rem;
              background: #60a5fa;
              animation: pulse 3s infinite;
            }
            
            .dot-3 {
              bottom: 25%;
              left: 33%;
              width: 0.375rem;
              height: 0.375rem;
              background: #10b981;
              animation: bounce 2s infinite;
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-25%); }
            }
            
            @keyframes ping {
              75%, 100% {
                transform: scale(2);
                opacity: 0;
              }
            }
            
            @media (max-width: 640px) {
              .status-indicators {
                flex-direction: column;
                align-items: center;
              }
              
              .buttons {
                flex-direction: column;
                align-items: center;
              }
              
              .button {
                width: 100%;
                max-width: 16rem;
                justify-content: center;
              }
            }
          `,
          }}
        />
      </head>
      <body>
        <div className="container">
          <div className="background">
            <div className="overlay"></div>
          </div>

          <div className="content">
            <div className="icon-section">
              <svg className="shield-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <svg className="wrench-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
              </svg>
            </div>

            <h1 className="main-title">
              Under
              <br />
              <span className="title-accent">Construction</span>
            </h1>

            <p className="subtitle">
              We're working hard to bring you something amazing.
              <br />
              This cybersecurity portfolio is being enhanced with new features.
            </p>

            <div className="status-indicators">
              <div className="status-item status-active">
                <div className="status-dot"></div>
                <span>Security Features Active</span>
              </div>
              <div className="status-item status-pending">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                </svg>
                <span>Estimated Completion: Soon</span>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-header">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>

            <div className="buttons">
              <a href="/" className="button button-outline">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Portfolio
              </a>
              <a href="/contact" className="button button-primary">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                Contact Admin
              </a>
            </div>

            <p className="footer-note">Thank you for your patience while we enhance your cybersecurity experience.</p>
          </div>

          <div className="animated-bg">
            <div className="floating-dot dot-1"></div>
            <div className="floating-dot dot-2"></div>
            <div className="floating-dot dot-3"></div>
          </div>
        </div>
      </body>
    </html>
  )
}
