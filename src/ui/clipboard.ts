/**
 * Puts the text on the clipboard: the clipboard API where the browser
 * grants it (a secure origin), the selection-and-copy command where it does
 * not (plain http on the office network, an embedded browser). Says whether
 * either worked.
 */
export async function writeClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);

        return true;
    } catch {
        const holder = document.createElement('textarea');
        holder.value = text;
        holder.setAttribute('readonly', '');
        holder.style.position = 'fixed';
        holder.style.opacity = '0';
        document.body.appendChild(holder);
        holder.select();
        const done = document.execCommand('copy');
        holder.remove();

        return done;
    }
}
