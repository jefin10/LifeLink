import React from 'react';
import "../style/home.css";
import { useNavigate } from 'react-router-dom';
import { Hospital, Stethoscope, UserRound, ArrowRight, ShieldCheck, Clock, Activity } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const paths = [
    {
      icon: <Hospital size={22} />,
      label: "Hospitals",
      title: "Run your hospital",
      description: "Manage doctors, patients, and appointments from a single clean dashboard.",
      cta: "Open hospital portal",
      onClick: () => navigate("/hospitaldash"),
      tone: "tone-red",
    },
    {
      icon: <Stethoscope size={22} />,
      label: "Doctors",
      title: "See your day clearly",
      description: "Today's appointments, patient roster, and a calendar that actually makes sense.",
      cta: "Doctor sign in",
      onClick: () => navigate("/doctordash"),
      tone: "tone-blue",
    },
    {
      icon: <UserRound size={22} />,
      label: "Patients",
      title: "Book in under a minute",
      description: "Pick a hospital, choose a doctor, lock in a time. No phone calls.",
      cta: "Book appointment",
      onClick: () => navigate("/appointment"),
      tone: "tone-green",
    },
  ];

  const trust = [
    { icon: <ShieldCheck size={18} />, label: "HIPAA-aware" },
    { icon: <Clock size={18} />, label: "Real-time scheduling" },
    { icon: <Activity size={18} />, label: "Built for hospitals" },
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <p className="hero-eyebrow">LifeLink · Healthcare OS</p>
        <h1 className="main-title">
          Healthcare, finally <span className="title-accent">in one place</span>
        </h1>
        <p className="subtitle">
          One platform connecting hospitals, doctors, and patients — without the spreadsheets,
          paper forms, or 11pm phone calls.
        </p>

        <div className="hero-trust">
          {trust.map((t) => (
            <div key={t.label} className="trust-pill">
              {t.icon}
              <span>{t.label}</span>
            </div>
          ))}
        </div>

        <div className="user-paths">
          {paths.map((p) => (
            <div key={p.label} className={`path-card ${p.tone}`}>
              <div className="path-icon">{p.icon}</div>
              <p className="path-label">{p.label}</p>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
              <button className="path-button" onClick={p.onClick}>
                <span>{p.cta}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
