<template>

  <v-app>

    <v-app-bar app v-if="!showNotEmbeddError">

      <v-toolbar-title class="headline text-uppercase mx-0 pa-0">

        <span @click="showDev()">WELCOME TO DUI3</span>

        <span class="font-weight-light">{{$store.state.hostAppName}}</span>

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
        style="margin-right:120px"
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

      <v-container grid-list-md pa-0>

        <v-layout row wrap v-show="$store.state.accounts.length === 0">

          <v-flex xs12>

            <v-card color="primary" dark>

              <v-img
                contain
                src="https://robohash.org/specklesucks"
                height="210"
              ></v-img>

              <v-card-text class="text-sm-center white--text">

                <v-btn block class="mt-2" @click.native="showAccountsPopup()">
                   Do something
                </v-btn>

              </v-card-text>

            </v-card>

          </v-flex>

        </v-layout>

      </v-container>

    </v-content>

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
var pluralize = require("pluralize");

export default {
  name: "App",
  components: {
    HelloWorld,
    NewClient,
    NewClientSender,
    ClientReceiver,
    ClientSender,
  },
  computed: {
    receivers() {
      return this.$store.state.clients.filter((cl) => cl.type === "receiver");
    },
    senders() {
      return this.$store.state.clients.filter((cl) => cl.type === "sender");
    },
  },
  data() {
    return {
      showAddNewReceiver: false,
      showAddNewSender: false,
      showNotEmbeddError: false,
    };
  },
  methods: {
    showDev() {
      console.log("showing dev");
      UiBindings.showDev();
    },
    showAccountsPopup() {
      UiBindings.showAccountsPopup();
    },
  },
  mounted() {
    console.log("app mounted!");
    if (typeof UiBindings === "undefined" || UiBindings === null) {
      this.showNotEmbeddError = true;
      return;
    }

    this.$store.dispatch("getAccounts");
    this.$store.dispatch("getApplicationHostName");
    this.$store.dispatch("getExistingClients");

    this.$store.dispatch("getReceiverOptions");
  },
};
</script>

<style>
.theme--light.v-card > .v-card__text {
  color: #000 !important;
}
</style>

