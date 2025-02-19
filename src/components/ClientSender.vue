<template>
  <v-flex xs12>
    <v-card>
      <v-dialog v-model="showEditSender" scrollable xxxfullscreen>
        <NewClientSender
          :is-visible="showEditSender"
          :is-edit="true"
          @close="showEditSender = false"
          :sender-client="client"
        ></NewClientSender>
      </v-dialog>

      <v-toolbar
        color="primary xxxdarken-1 text-truncate elevation-0"
        dark
        height="70"
      >
        <v-btn fab small color="white" ripple @click.native="startUpload()">
          <v-icon color="primary">cloud_upload</v-icon>
        </v-btn>

        <v-toolbar-title class="text-truncate font-weight-light ml-3">{{
          client.name
        }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- NOTIFICATION -->
        <v-tooltip bottom v-if="client.expired">
          <template v-slot:activator="{ on }">
            <v-icon class="mr-2" v-on="on" color="red" small>lens</v-icon>
          </template>
          <span>This stream has updates that can be sent</span>
        </v-tooltip>

        <!-- EDIT -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn small icon @click.native="showEditSender = true" v-on="on">
              <v-icon small>edit</v-icon>
            </v-btn>
          </template>
          <span>Edit Sender</span>
        </v-tooltip>

        <!-- SELECT OBJECTS -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn small icon @click.native="selectObjects" v-on="on">
              <v-icon small>gps_fixed</v-icon>
            </v-btn>
          </template>
          <span>Show objects</span>
        </v-tooltip>

        <!-- OPEN IN BROSWER -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              small
              @click.native="
                startProcess(
                  `${client.account.RestApi.replace('api', '#')}streams/${
                    client.streamId
                  }`
                )
              "
              target="_blank"
              v-on="on"
            >
              <v-icon small>open_in_new</v-icon>
            </v-btn>
          </template>
          <span>Open stream in web browser</span>
        </v-tooltip>

        <!-- DELETE -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn small icon @click.native="deleteClient" v-on="on">
              <v-icon small>delete</v-icon>
            </v-btn>
          </template>
          <span>Delete Sender</span>
        </v-tooltip>
      </v-toolbar>
      <v-card-text class="caption">
        <span>
          <v-icon small>developer_board</v-icon>
          {{ account.ServerName }} </span
        >&nbsp;
        <span class="caption">
          <v-icon small>fingerprint</v-icon>StreamId:
          <span style="user-select: all">
            <b>{{ client.streamId }}</b>
          </span> </span
        >&nbsp;
        <span class="caption">
          <v-icon small>hourglass_full</v-icon>Last update:
          <timeago :datetime="client.updatedAt" :auto-update="60"></timeago>
        </span>
        <v-progress-linear
          :active="client.loading"
          :indeterminate="client.isLoadingIndeterminate"
          height="2"
          v-model="client.loadingProgress"
          color="primary darken-1"
        ></v-progress-linear>

        <span>
          <v-icon small>{{ client.filter.Icon }}</v-icon>
          <span
            v-if="
              client.filter.Type === 'SpeckleUiBase.ElementsSelectionFilter'
            "
            >Objects by {{ client.filter.Name }},
            {{ client.filter.Selection.length }} added.</span
          >
          <span
            v-else-if="
              client.filter.Type === 'SpeckleUiBase.ListSelectionFilter'
            "
            >Objects by {{ client.filter.Name }},
            {{ client.filter.Selection.length }} selected.</span
          >
          <span
            v-else-if="
              client.filter.Type === 'SpeckleUiBase.PropertySelectionFilter'
            "
            >Objects by {{ client.filter.Name }}, where
            {{ client.filter.PropertyName }}
            {{ client.filter.PropertyOperator }}
            {{ client.filter.PropertyValue }}.</span
          > </span
        >&nbsp;
        <span class="caption grey--text">{{ client.loadingBlurb }}</span>
      </v-card-text>

      <v-alert
        dismissible
        dense
        color="primary"
        border="left"
        class="mt-15"
        colored-border
        v-if="client.message && client.message !== ''"
        >{{ client.message }}</v-alert
      >
      <v-alert dismissible dense type="warning" v-model="alertError">
        <div row wrap class="d-flex flex-row">
          <span class="caption" v-html="client.errorMsg"></span>
          <v-btn
            outlined
            right
            x-small
            class="ml-5"
            v-if="client.errors"
            @click="showErrors = true"
          >
            <v-icon small>more_horiz</v-icon>
          </v-btn>
        </div>
      </v-alert>
      <v-dialog v-model="showErrors" scrollable>
        <v-card>
          <v-list>
            <v-subheader>CONVERSION ERRORS</v-subheader>
            <v-list-item
              :two-line="err.Details != null"
              v-for="(err, i) in client.errors"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title>{{ err.Message }}</v-list-item-title>
                <v-list-item-subtitle v-html="err.Details">{{
                  err.Details
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </v-card>
  </v-flex>
</template>
<script>
import Sockette from "sockette";
import NewClientSender from "./NewClientSender.vue";

export default {
  name: "SenderClient",
  components: {
    NewClientSender,
  },
  props: {
    client: {
      type: Object,
      default: null,
    },
  },
  computed: {
    account() {
      return this.$store.state.accounts.find(
        (ac) => ac.AccountId === this.client.AccountId
      );
    },
    updatedAt() {
      return new Date(this.client.updatedAt).toLocaleDateString();
    },
    alertError: {
      // getter
      get: function () {
        return this.client.errorMsg != "";
      },
      // setter
      set: function (newValue) {
        this.client.errorMsg = "";
        this.client.errors = [];
      },
    },
  },
  watch: {
    "client.loading"(val, oldVal) {
      if (!val && this.sendStarted) this.broadcastSendEnd();
    },
    client: {
      handler(val, oldVal) {
        console.log(val);
      },
      deep: true,
    },
  },
  data: () => ({
    sendStarted: false,
    showEditSender: false,
    showErrors: false,
  }),
  methods: {
    startUpload() {
      this.sendStarted = true;
      this.$store.dispatch("cloneStream", this.client);
      this.client.updatedAt = new Date().toISOString();
      this.client.message = "";
      this.client.expired = false;
      UiBindings.pushSender(JSON.stringify(this.client));
    },
    deleteClient() {},
    broadcastSendEnd() {
      this.sendStarted = false;
      this.sockette.json({
        eventName: "broadcast",
        resourceType: "stream",
        resourceId: this.client.streamId,
        args: {
          eventType: "update-global",
        },
      });
    },
    // addSelection() {
    //   UiBindings.addSelectionToSender(JSON.stringify(this.client));
    // },
    // removeSelection() {
    //   UiBindings.removeSelectionFromSender(JSON.stringify(this.client));
    // },
    selectObjects() {
      UiBindings.selectClientObjects(JSON.stringify(this.client));
    },
    startProcess(process) {
      UiBindings.startProcess(process);
    },
    wsOpen(e) {
      this.sockette.json({
        eventName: "join",
        resourceType: "stream",
        resourceId: this.client.streamId,
      });
    },
    wsMessage(e) {
      console.log(e.data);
      if (e.data === "ping") {
        this.sockette.send("alive");
        return;
      }
    },
    wsError(e) {
      console.log(e);
    },
    wsReconnect(e) {
      console.log(e);
    },
    wsClose(e) {
      console.log(e);
    },
  },
  mounted() {
    let wsUrl = this.account.RestApi.replace("http", "ws");
    this.sockette = new Sockette(
      `${wsUrl}?client_id=${this.client.clientId}&access_token=${this.account.Token}`,
      {
        timeout: 5e3,
        maxAttempts: 100,
        onopen: this.wsOpen,
        onmessage: this.wsMessage,
        onerror: this.wsError,
        onreconnect: this.wsReconnect,
        onclose: this.wsClose,
      }
    );
  },
  beforeDestroy() {
    this.sockette.close();
  },
};
</script>
<style scoped lang="scss">
.expired {
  // border-left: 12px solid red;
}
</style>
