<template>
  <v-app>
    <v-app-bar app v-if="!showNotEmbeddError">
      <v-toolbar-title class="headline text-uppercase mx-0 pa-0">
        <span @click="showDev()">WELCOME TO DUI3</span>

        <span class="font-weight-light">{{ $store.state.hostAppName }}</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        color="secondary"
        v-show="$store.state.accounts.length > 0"
        dark
        absolute
        bottom
        right
        fab
        :ripple="false"
        @click.native="showAddNewReceiver = true"
        style="margin-right: 120px"
      >
        <v-icon>cloud_download</v-icon>
      </v-btn>

      <!-- <v-btn
        color="primary"
        v-show="$store.state.accounts.length > 0"
        absolute
        bottom
        right
        fab
        :ripple="false"
        @click.native="showAddNewSender = true"
        style="margin-right:60px"
      >

        <v-icon>cloud_upload</v-icon>

      </v-btn>

      <v-btn
        @click="showAccountsPopup()"
        color="grey"
        dark
        absolute
        bottom
        right
        fab
        :ripple="false"
      >

        <v-icon>account_circle</v-icon>

      </v-btn> -->
    </v-app-bar>

    <v-dialog
      v-model="showAddNewReceiver"
      scrollable
      xxxfullscreen
      v-if="!showNotEmbeddError"
    >
      <NewClient
        :is-visible="showAddNewReceiver"
        @close="showAddNewReceiver = false"
      ></NewClient>
    </v-dialog>

    <v-dialog
      v-model="showAddNewSender"
      scrollable
      xxxfullscreen
      v-if="!showNotEmbeddError"
    >
      <NewClientSender
        :is-visible="showAddNewSender"
        @close="showAddNewSender = false"
      ></NewClientSender>
    </v-dialog>

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
      if (typeof UiBindings === "undefined" || UiBindings === null) {
        return chrome.webview.hostObjects.UiBindings;
      }
      return UiBindings;
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
