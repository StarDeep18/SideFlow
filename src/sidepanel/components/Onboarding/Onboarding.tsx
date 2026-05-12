import React, { useState } from 'react';
import { useSettingsStore } from '../../../stores/settingsStore';
import './Onboarding.css';

const SLIDES = [
  {
    icon: '⚡',
    title: 'Welcome to SideFlow',
    description: 'Your productivity communication layer. Access all your apps without leaving your workflow.',
    visual: '🚀',
  },
  {
    icon: '🎯',
    title: 'Smart Workspaces',
    description: 'Switch between Work, Study, and Personal contexts instantly. Each workspace remembers your apps and layout.',
    visual: '💼 📚 🏠',
  },
  {
    icon: '⌨️',
    title: 'Keyboard-First',
    description: 'Alt+1-4 to switch apps. Ctrl+Shift+Space to toggle. Built for power users who hate the mouse.',
    visual: '⌨️',
  },
];

export const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setOnboardingComplete } = useSettingsStore();

  const isLastSlide = currentSlide === SLIDES.length - 1;
  const slide = SLIDES[currentSlide];

  const handleNext = () => {
    if (isLastSlide) {
      setOnboardingComplete(true);
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    setOnboardingComplete(true);
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card animate-scale-in">
        {/* Visual area */}
        <div className="onboarding-visual">
          <span className="onboarding-visual-emoji">{slide.visual}</span>
        </div>

        {/* Content */}
        <div className="onboarding-content" key={currentSlide}>
          <div className="onboarding-icon">{slide.icon}</div>
          <h1 className="onboarding-title">{slide.title}</h1>
          <p className="onboarding-desc">{slide.description}</p>
        </div>

        {/* Progress dots */}
        <div className="onboarding-dots">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`onboarding-dot ${i === currentSlide ? 'onboarding-dot--active' : ''}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="onboarding-actions">
          {!isLastSlide && (
            <button className="onboarding-btn onboarding-btn--ghost" onClick={handleSkip}>
              Skip
            </button>
          )}
          <button className="onboarding-btn onboarding-btn--primary" onClick={handleNext}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
