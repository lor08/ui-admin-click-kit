import { reactive, readonly } from 'vue';
import type { Tone } from './styles';

export interface Toast {
    id: number;
    tone: Tone;
    title: string;
    message: string | null;
    /** Milliseconds before it hides itself; 0 keeps it until dismissed. */
    timeout: number;
}

export interface NewToast {
    tone?: Tone;
    title: string;
    message?: string | null;
    timeout?: number;
}

const state = reactive<{ toasts: Toast[] }>({ toasts: [] });
let nextId = 1;

/**
 * The one list of toasts of the app: any component pushes, the UiToaster
 * in the layout shows them. A module-level store, not Pinia: nothing here
 * outlives the page or needs devtools.
 */
export function useToast() {
    function dismiss(id: number): void {
        const index = state.toasts.findIndex((toast) => toast.id === id);
        if (index !== -1) {
            state.toasts.splice(index, 1);
        }
    }

    function push(toast: NewToast): number {
        const id = nextId++;
        state.toasts.push({ id, tone: toast.tone ?? 'neutral', title: toast.title, message: toast.message ?? null, timeout: toast.timeout ?? 5000 });

        return id;
    }

    return {
        toasts: readonly(state).toasts,
        push,
        dismiss,
        success: (title: string, message: string | null = null) => push({ tone: 'success', title, message }),
        error: (title: string, message: string | null = null) => push({ tone: 'danger', title, message, timeout: 8000 }),
        info: (title: string, message: string | null = null) => push({ tone: 'info', title, message }),
        clear: (): void => {
            state.toasts.splice(0);
        },
    };
}
