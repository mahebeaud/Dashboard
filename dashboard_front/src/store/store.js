import { createStore } from 'vuex';

export default createStore({
  state: {
    Bearer: '',
    Connected: false,
    Id: 0,
    Role: '',
  },
  mutations: {
    setConnected: (state, payload) => {
      state.Connected = payload;
      localStorage.setItem('connected', payload);
    },
    setBearer: (state, payload) => {
      state.Bearer = payload;
      // Stocker le jeton dans le localStorage
      localStorage.setItem('token', payload);
    },
    setLogout: (state) => {
      state.Bearer = '';
      state.Connected = false;
      // Supprimer le jeton du localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('connected');
      localStorage.removeItem('id');
    },
    setId: (state, payload) => {
      state.Id = payload;
      // Stocker le jeton dans le localStorage
      localStorage.setItem('id', payload);
    },
    setRole: (state, payload) => {
      state.role = payload;
      // Stocker le jeton dans le localStorage
      localStorage.setItem('role', payload);
    },
  },
  actions: {},
  modules: {},
  getters: {
    getBearer: (state) => {
        // Récupérer le jeton du localStorage
        const token = localStorage.getItem('token');
        return token ? token : state.Bearer;
    },
    getConnected: (state) => {
        // Récupérer le jeton du localStorage
        const connected = localStorage.getItem('connected');
        return connected ? connected : state.Connected;
    },
    getID: (state) => {
      // Récupérer le jeton du localStorage
      const id = localStorage.getItem('id');
      return id ? id : state.Id;
    },
    getRole: (state) => {
      // Récupérer le jeton du localStorage
      const role = localStorage.getItem('role');
      return role ? role : state.role;
    }
  },
});
