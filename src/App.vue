<template>
  <v-app>
    <v-app-bar app v-if="!showNotEmbeddError">
      <v-toolbar-title class="headline text-uppercase mx-0 pa-0">
        <span>WELCOME TO DUI3</span>

        <span class="font-weight-light">{{ $store.state.hostAppName }}</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content v-if="!showNotEmbeddError">
      <v-container fill-height pa-0>
        <v-layout v-show="$store.state.accounts.length === 0" height="100%">
          <v-flex xs12>
            <v-card color="primary" pa-0 dark height="100%">
              <v-img
                contain
                src="https://robohash.org/specklesucks"
                height="210"
              ></v-img>

              <v-card-text class="text-sm-center white--text">
                <v-btn block class="mt-2" @click.native="sendStream()">
                  Send Everything Test
                </v-btn>

                <v-btn block class="mt-2" plain small @click.native="showDev()">
                  Show Dev Tools
                </v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <v-snackbar v-model="showNotification" color="purple">
      {{ notification }}
    </v-snackbar>

    <v-dialog v-model="showNotEmbeddError" persistent width="500">
      <v-card>
        <v-card-title class="headline primary white--text" primary-title>
          Welcome to the future DUI3 🚀
        </v-card-title>

        <v-img src="https://robohash.org/speckled" height="210" contain></v-img>

        <v-card-text class="mt-5">
          Just kidding! This is a test :) Please embed me to use any bindings.
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import NewClient from "./components/NewClient.vue";
import NewClientSender from "./components/NewClientSender.vue";
import ClientReceiver from "./components/ClientReceiver.vue";
import ClientSender from "./components/ClientSender.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
    NewClient,
    NewClientSender,
    ClientReceiver,
    ClientSender,
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      console.log(mutation.type);
      if (mutation.type === "SET_SHOW_NOTIFICATION") {
        this.notification = state.notification;
        this.showNotification = true;
      }
    });
  },
  computed: {
    receivers() {
      return this.$store.state.clients.filter((cl) => cl.type === "receiver");
    },
    senders() {
      return this.$store.state.clients.filter((cl) => cl.type === "sender");
    },
    SpeckleUiBindings() {
      //NOTE: in revit chrome.webview.hostObjects.UiBindings is not null because it does have webview2
      try {
        if (window.UiBindings) {
          console.log("using cef");
          return window.UiBindings;
        }
        if (window.chrome.webview.hostObjects.UiBindings) {
          console.log("using webview");
          return window.chrome.webview.hostObjects.UiBindings;
        }
      } catch (e) {
        console.error(e);
      }
      return null;
    },
  },
  data() {
    return {
      showAddNewReceiver: false,
      showAddNewSender: false,
      showNotEmbeddError: false,
      notification: "",
      showNotification: false,
    };
  },
  methods: {
    showDev() {
      console.log("showing dev");
      this.SpeckleUiBindings.showDev();
    },
    sendStream() {
      console.log("send starting");
      this.SpeckleUiBindings.sendStream();
    },
  },
  mounted() {
    console.log("app mounted!");
    console.log("bindings:");
    console.log(this.SpeckleUiBindings);
    if (
      typeof this.SpeckleUiBindings === "undefined" ||
      this.SpeckleUiBindings === null
    ) {
      this.showNotEmbeddError = true;
      return;
    }
  },
};
</script>

<style>
.theme--light.v-card > .v-card__text {
  color: #000 !important;
}
</style>
