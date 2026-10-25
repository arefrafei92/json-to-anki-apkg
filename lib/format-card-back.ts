function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatBasicBack(
  back: string,
  explanation?: string,
  example?: string,
): string {
  const sections = [escapeHtml(back)];
  const expl = explanation?.trim();
  const ex = example?.trim();
  if (expl) {
    sections.push(
      `<p><strong>Explanation:</strong> ${escapeHtml(expl)}</p>`,
    );
  }
  if (ex) {
    sections.push(`<p><strong>Example:</strong> ${escapeHtml(ex)}</p>`);
  }
  if (sections.length === 1) {
    return sections[0];
  }
  return sections.join('<hr id="extra">');
}
