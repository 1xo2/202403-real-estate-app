// customMatchers.ts
export function toBeDisabled(element: HTMLElement): boolean {
    return element.hasAttribute('disabled');
}
