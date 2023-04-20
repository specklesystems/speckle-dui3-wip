import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    test: {},
    accounts: [],
    clients: [],
    hostAppName: null,
    currentFileName: null,
    errors: [],
    selectionCount: 0,
    selectedObjects: [],
    slackInviteUrl:
      "https://speckle-works.slack.com/join/shared_invite/enQtNjY5Mzk2NTYxNTA4LTU4MWI5ZjdhMjFmMTIxZDIzOTAzMzRmMTZhY2QxMmM1ZjVmNzJmZGMzMDVlZmJjYWQxYWU0MWJkYmY3N2JjNGI",
    canTogglePreview: false,
    canSelectObjects: false,
    notification: "",
    showNotification: false,
  },
  mutations: {
    ADD_CLIENT(state, client) {
      if (!client.hasOwnProperty("objects")) client.objects = [];
      state.clients.unshift(client);
    },

    UPDATE_CLIENT(state, client) {
      const index = state.clients.findIndex((cl) => cl._id === client._id);
      if (index !== -1) state.clients.splice(index, 1, client);
      else console.error("client not found", _id);
    },

    REMOVE_CLIENT(state, _id) {
      const index = state.clients.findIndex((cl) => cl._id === _id);
      if (index >= 0) state.clients.splice(index, 1);
      else console.error("client not found", _id);
    },

    SET_CLIENT_DATA(state, props) {
      let found = state.clients.find((cl) => cl._id === props._id);
      Object.keys(props).forEach((key) => {
        found[key] = props[key];
      });
    },

    DELETE_ALL_CLIENTS(state) {
      state.clients = [];
    },

    SET_ACCOUNTS(state, accounts) {
      state.accounts = accounts;
    },

    SET_ACCOUNT_DATA(state, props) {
      let found = state.accounts.find((a) => a.AccountId === props.AccountId);
      Object.keys(props).forEach((key) => {
        found[key] = props[key];
      });
    },

    SET_HOST_APP(state, appName) {
      state.hostAppName = appName;
    },

    SET_SELECTION_COUNT(state, count) {
      state.selectionCount = count;
    },

    SET_SELECTION_OBJECTS(state, objects) {
      state.selectedObjects = objects;
    },
    SET_canTogglePreview(state, value) {
      state.canTogglePreview = value;
    },
    SET_canSelectObjects(state, value) {
      state.canSelectObjects = value;
    },
    SET_SHOW_NOTIFICATION(state, value) {
      state.notification = value;
      state.showNotification = true;
    },
  },
  actions: {
    getApplicationHostName: (context) =>
      new Promise(async (resolve, reject) => {
        let res = await UiBindings.getApplicationHostName();
        context.commit("SET_HOST_APP", res);
      }),
  },
});
