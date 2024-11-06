export const handleScrollToSection = (event, sectionId) => {
  event.preventDefault();
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

export const handleScroll = (setIsShrunk) => {
  if (window.scrollY > 50) {
    setIsShrunk(true);
  } else {
    setIsShrunk(false);
  }
};
