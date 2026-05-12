// Sons em Base64 (Short Pops/Clicks)
export const SOUND_URLS = {
  // Som de Pop suave
  DRAG: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=", 
  // Som de Click suave
  DROP: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
};

// Como base64 de áudio real é muito longo, vou usar URLs de um repositório estável (GitHub)
// que costumam ter menos problemas de CORS/Forbidden que o Mixkit
export const STABLE_SOUND_URLS = {
  DRAG: "https://raw.githubusercontent.com/Anish-Agnihotri/zen-focus/main/public/sounds/tock.mp3",
  DROP: "https://raw.githubusercontent.com/Anish-Agnihotri/zen-focus/main/public/sounds/click.mp3"
};
