import { ref, computed } from 'vue';

export const collapsed = ref(false);
export const toggleSideBar = () => {
    collapsed.value = !collapsed.value
};

export const SIDEBAR_WIDTH = 180
export const sideBarCollapsedWidth = 38
export const sideBarWidth = computed(() =>
 `${collapsed.value ? sideBarCollapsedWidth : SIDEBAR_WIDTH}px`
)
