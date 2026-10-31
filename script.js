const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const themeKey = 'jonah-theme-v2';
const savedTheme = localStorage.getItem(themeKey);
root.dataset.theme = savedTheme || 'dark';

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem(themeKey, theme);
  themeButton?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#191919' : '#ffffff');
}

themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
setTheme(root.dataset.theme);
document.querySelectorAll('[data-year]').forEach((element) => { element.textContent = new Date().getFullYear(); });

const sectionTrigger = document.querySelector('.work-menu-trigger');
const sectionOverlay = document.querySelector('.work-menu-overlay');
const sectionPanel = sectionOverlay?.querySelector('.work-menu-panel');
const sectionBackdrop = sectionOverlay?.querySelector('.work-menu-backdrop');
const sectionOptions = [...(sectionOverlay?.querySelectorAll('.work-menu-option') || [])];
const workCards = [...document.querySelectorAll('.work-item')];
const emptyState = document.querySelector('.work-empty');
const projectDialog = document.querySelector('.project-dialog');
const dialogVideo = projectDialog?.querySelector('.project-dialog-video');
const dialogPlaceholder = projectDialog?.querySelector('.project-dialog-placeholder');
const dialogTitle = projectDialog?.querySelector('#project-dialog-title');
const dialogSection = projectDialog?.querySelector('.project-dialog-section');
const dialogDescription = projectDialog?.querySelector('.project-dialog-description');

workCards.forEach((card) => { card.hidden = !card.hasAttribute('data-home-featured'); });

function placeLandscapeWorkAtBottom() {
  const visibleLandscapes = workCards.filter((card) => !card.hidden && card.classList.contains('is-landscape'));
  workCards.forEach((card) => card.classList.remove('is-landscape-start', 'is-landscape-solo'));
  visibleLandscapes[0]?.classList.add('is-landscape-start');
  if (visibleLandscapes.length % 2 === 1) visibleLandscapes.at(-1)?.classList.add('is-landscape-solo');
}

function openProjectDialog(card, video) {
  if (!projectDialog || !dialogVideo || !dialogPlaceholder) return;
  projectDialog.querySelector('.project-dialog-media')?.classList.toggle('is-landscape', card.classList.contains('is-landscape'));
  const title = card.querySelector('.work-copy h3')?.textContent?.trim() || 'Project';
  const description = card.querySelector('.work-copy > p:not(.work-index)')?.textContent?.trim() || '';
  const sections = card.dataset.sections?.split(/\s+/) || [];
  const activeSection = document.body.dataset.activeSection;
  const category = sections.includes(activeSection) ? activeSection : sections[0];
  const categoryLabel = sectionOptions.find((option) => option.dataset.section === category)?.querySelector('span')?.textContent?.trim() || '';
  const source = video.dataset.src?.trim();
  const imagePath = video.dataset.image?.trim();
  const posterPath = video.dataset.poster?.trim();

  if (dialogTitle) dialogTitle.textContent = title;
  if (dialogSection) dialogSection.textContent = categoryLabel;
  if (dialogDescription) dialogDescription.textContent = description;
  dialogPlaceholder.replaceChildren();
  dialogVideo.pause();
  dialogVideo.removeAttribute('src');
  dialogVideo.removeAttribute('poster');
  dialogVideo.hidden = !source;
  dialogPlaceholder.hidden = Boolean(source);

  if (source) {
    dialogVideo.src = source;
    if (posterPath) dialogVideo.poster = posterPath;
    dialogVideo.muted = false;
    dialogVideo.defaultMuted = false;
  } else if (imagePath) {
    const image = new Image();
    image.src = imagePath;
    image.alt = `${title} ad creative`;
    dialogPlaceholder.append(image);
  } else {
    const art = card.querySelector('.video-art')?.cloneNode(true);
    if (art) dialogPlaceholder.append(art);
  }

  projectDialog.showModal();
  if (source) dialogVideo.play().catch(() => {});
}

projectDialog?.querySelector('.project-dialog-close')?.addEventListener('click', () => projectDialog.close());
projectDialog?.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});
projectDialog?.addEventListener('close', () => {
  dialogVideo?.pause();
  dialogVideo?.removeAttribute('src');
  dialogVideo?.removeAttribute('poster');
  dialogVideo?.load();
  dialogPlaceholder?.replaceChildren();
});

function closeSectionMenu(restoreFocus = true) {
  if (!sectionOverlay || !sectionTrigger) return;
  sectionOverlay.hidden = true;
  sectionTrigger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  if (restoreFocus) sectionTrigger.focus();
}

sectionTrigger?.addEventListener('click', () => {
  const isOpen = sectionTrigger.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeSectionMenu(false);
    return;
  }
  sectionOverlay.hidden = false;
  sectionTrigger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  sectionPanel?.focus();
});

sectionBackdrop?.addEventListener('click', () => {
  sectionOptions.find((option) => option.dataset.section === 'all')?.click();
});

sectionOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const selectedSection = option.dataset.section;
    document.body.classList.toggle('section-gallery', selectedSection !== 'all');
    document.body.dataset.activeSection = selectedSection;
    sectionOptions.forEach((item) => {
      const selected = item === option;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    let visibleCount = 0;
    workCards.forEach((card) => {
      const categories = card.dataset.sections?.split(/\s+/) || [];
      card.hidden = selectedSection === 'all'
        ? !card.hasAttribute('data-home-featured')
        : !categories.includes(selectedSection);
      if (!card.hidden) visibleCount += 1;
    });
    placeLandscapeWorkAtBottom();
    if (emptyState) emptyState.hidden = visibleCount > 0;
    const selectedLabel = option.querySelector('strong, span')?.textContent?.trim();
    const triggerLabel = sectionTrigger?.querySelector('.work-menu-label');
    if (selectedLabel && triggerLabel) triggerLabel.textContent = selectedLabel;
    closeSectionMenu();
  });
});

document.addEventListener('keydown', (event) => {
  if (sectionOverlay?.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeSectionMenu();
    return;
  }
  if (event.key !== 'Tab' || !sectionPanel) return;
  const focusable = [...sectionPanel.querySelectorAll('button:not([disabled])')];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === sectionPanel)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.querySelectorAll('.work-item').forEach((card) => {
  const frame = card.querySelector('.media-placeholder');
  const video = card.querySelector('.project-video');
  if (!frame || !video) return;

  const source = video.dataset.src?.trim();
  const imagePath = video.dataset.image?.trim();
  const poster = frame.querySelector('.project-poster');
  if ((source || imagePath) && poster) {
    frame.classList.add('has-poster');
    poster.addEventListener('error', () => frame.classList.remove('has-poster'), { once: true });
  }

  const title = card.querySelector('.work-copy h3')?.textContent?.trim() || 'Project';
  const openButton = document.createElement('button');
  openButton.className = 'project-open';
  openButton.type = 'button';
  openButton.setAttribute('aria-label', `Open ${title}`);
  frame.append(openButton);
  openButton.addEventListener('click', () => {
    video.pause();
    frame.classList.remove('is-playing');
    openProjectDialog(card, video);
  });
  card.querySelector('.text-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    video.pause();
    frame.classList.remove('is-playing');
    openProjectDialog(card, video);
  });

  if (!source) return;

  const loadFrame = () => {
    if (video.getAttribute('src')) return;
    video.preload = 'none';
    video.src = source;
    video.load();
  };

  video.addEventListener('error', () => frame.classList.remove('is-playing'));

  const startPreview = async () => {
    loadFrame();
    video.muted = true;
    video.defaultMuted = true;

    try {
      await video.play();
      frame.classList.add('is-playing');
    } catch {
      frame.classList.remove('is-playing');
    }
  };

  const stopPreview = () => {
    if (card.matches(':hover, :focus-within')) return;
    video.pause();
    video.currentTime = 0;
    frame.classList.remove('is-playing');
  };

  card.addEventListener('pointerenter', startPreview);
  card.addEventListener('pointerleave', stopPreview);
  card.addEventListener('focusin', startPreview);
  card.addEventListener('focusout', () => requestAnimationFrame(stopPreview));
});
