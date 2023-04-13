<template>
    <router-link :to="to" class="sidebar-link" :class="{ active: isActive }">
        <transition name="fade">
            <span v-if="!collapsed">
                <slot></slot>
            </span>
        </transition>
    </router-link>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { collapsed } from './states';

export default {
    props: {
        to: { type: String, required: true },
    },
    setup(props) {
        const route = useRoute();
        const isActive = computed(() => route.path === props.to);
        return { isActive, collapsed };
    }
}
</script>

<style scoped>

.sidebar-link {
    display: flex;
    cursor: pointer;
    user-select: none;

    padding: 0.7em;
    border-radius: 0.25em;
    height: 1.5em;

    color: white;
    text-decoration: none;
}
.sidebar-link .icon {
    flex-shrink: 0;
    width: 25px;
    margin-right: 10px;
}

.sidebar-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

</style>