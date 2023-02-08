export const tw = (...styles: (string | false | undefined)[]) =>
  styles.filter((style) => typeof style === "string").join(" ");
