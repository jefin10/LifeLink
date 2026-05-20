import React from 'react';

const About = () => {
  return (
    <div style={{
      padding: "120px 24px 80px",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #fafafa 0%, #f4f4f5 100%)",
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
      color: "#0f172a",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#dc2626", marginBottom: 14 }}>
          About LifeLink
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 18 }}>
          One clean tool for hospitals, doctors, and patients
        </h1>
        <p style={{ color: "#475569", fontSize: 17, lineHeight: 1.6, marginBottom: 16 }}>
          LifeLink replaces the patchwork of spreadsheets and phone calls that hospitals
          rely on for daily scheduling. Hospitals manage their staff and patients, doctors
          see exactly what their day looks like, and patients book appointments without a
          single phone call.
        </p>
        <p style={{ color: "#475569", fontSize: 17, lineHeight: 1.6 }}>
          Built to be quiet, fast, and easy to learn — even for staff who'd rather not
          think about software at all.
        </p>
      </div>
    </div>
  );
};

export default About;
