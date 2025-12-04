import { create } from "zustand";

const initialModalState = {
    auth: false,
    product: false,
    user: false,
    deleteProduct: false,
    category: false,
    deleteCategory: false,
    orderDetails: false,
    orderStatusChanger: false,
    orderNote: false,
    deleteOrder: false,
    deleteUser: false,
    deleteMedia: false,
};

type Modal = keyof typeof initialModalState;
type ActionData = any | null;

type ModalStore = {
    modalState: typeof initialModalState;
    actionData: ActionData;
    timeoutId: NodeJS.Timeout | null; // Added to track pending timeout
    setActionData: (actionData: ActionData) => void;
    toggle: (type: Modal, data?: ActionData) => void;
    isOpen: (type: Modal) => boolean;
};

const modalStore = create<ModalStore>((set, get) => ({
    modalState: initialModalState,
    actionData: null,
    timeoutId: null,
    setActionData: (actionData) => set({ actionData }),
    toggle: (type, data) => {
        const currentState = get();
        const isCurrentlyOpen = currentState.modalState[type];

        // Clear any existing timeout when toggling
        if (currentState.timeoutId) {
            clearTimeout(currentState.timeoutId);
        }

        if (isCurrentlyOpen) {
            // Closing the modal
            set({
                modalState: { ...initialModalState, [type]: false },
            });

            // Set new timeout to clear actionData after animation
            const timeoutId = setTimeout(() => {
                set({ actionData: null });
            }, 500);

            set({ timeoutId });
        } else {
            // Opening the modal - reset all modals and set action data
            set({
                modalState: { ...initialModalState, [type]: true },
                actionData: data ?? null,
                timeoutId: null, // Clear any previous timeout
            });
        }
    },
    isOpen: (type) => get().modalState[type],
}));

const useModal = <T extends ActionData>() => {
    const modalState = modalStore((state) => state.modalState);
    const actionData = modalStore((state) => state.actionData as T);
    const toggle = modalStore((state) => state.toggle);
    const isOpen = modalStore((state) => state.isOpen);

    return { modalState, actionData, toggle, isOpen };
};

export { useModal };
