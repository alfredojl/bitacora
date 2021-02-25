<template>
  <v-container class="mb-10">
    <v-toolbar color="light">
      <v-row justify="center" align="center">
        <audio
          src="../../public/alert6.mp3"
          ref="audioAlert"
          preload="auto"
          muted="muted"
        ></audio>
        <v-img
          src="../../public/logo.jpg"
          class="ml-2"
          max-height="50"
          max-width="250"
        ></v-img>
        <v-spacer></v-spacer>
        <v-toolbar-title class="title">Asistencia</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title class="mr-2">{{ fecha }}</v-toolbar-title>
      </v-row>
    </v-toolbar>
    <v-row class="mt-4" justify="center">
      <v-col cols="3">
        <v-textarea
          clearable
          no-resize
          rows="1"
          ref="focus"
          auto-grow
          clear-icon="mdi-close-circle"
          label="Escanee QR"
          prepend-icon="mdi-qrcode-scan"
          v-model="vcard"
          @keypress.enter="searchEmployee"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="3">
        <v-text-field
          clearable
          clear-icon="mdi-close-circle"
          v-model="phone"
          label="Número de teléfono"
          placeholder="55 5555 5555"
          prepend-icon="mdi-phone"
          @keypress.enter="searchByPhone"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-8">
      <v-card class="text-right mt-4" elevation="5" width="25rem">
        <v-alert dense border="top" type="warning" :value="!status">
          El empleado {{ this.values[0] }} no está vigente.
        </v-alert>
        <v-card-title class="justify-center">
          <span>Información de empleado:</span>
        </v-card-title>
        <v-card-text>
          <v-row justify="center">
            <v-img
              :src="img"
              class="ma-4 grey lighten-2"
              max-width="300"
              max-height="400"
              :aspect-ratio="1 / 3"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-row>
          <v-row v-for="(campo, i) of campos" :key="i" class="">
            <v-col cols="4" class="text-right font-weight-black">
              <span class="ma-0">{{ campo }}:</span>
            </v-col>
            <v-col class="text-left">
              <span>{{ values[i] }}</span>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions v-show="values[2]">
          <v-row justify="center" aling="center">
            <v-btn
              plain
              dark
              color="primary"
              @click="checkIn"
              :loading="loadCheckIn"
            >
              Entrada
            </v-btn>
            <v-btn
              plain
              dark
              color="red"
              @click="checkOut"
              :loading="loadCheckOut"
            >
              Salida
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-spacer></v-spacer>
    <v-bottom-navigation>
      <v-btn @click="dialogAsistencias = true">
        <span>Asistencias</span>
        <v-icon>mdi-calendar-search</v-icon>
      </v-btn>
      <v-btn @click="dialog = true">
        <span>Empleado</span>
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" width="800" persistent>
        <v-card align="center">
          <v-card-title class="headline primary lighten-3"
            >Agregar nuevo empleado</v-card-title
          >
          <v-col cols="10">
            <v-file-input
              truncated-length="15"
              v-model="filePhoto"
              accept="image/*"
              label="Foto de empleado"
              prepend-icon="mdi-camera"
              :show-size="1024"
            ></v-file-input>
          </v-col>
          <v-col class="ma-2" cols="10">
            <v-text-field
              label="Nombre completo"
              clearable
              v-model="name"
              prepend-icon="mdi-account"
              clear-icon="mdi-close-circle"
            ></v-text-field>
            <v-text-field
              label="Número de teléfono"
              clearable
              v-model="telefono"
              prepend-icon="mdi-phone"
              clear-icon="mdi-close-circle"
            ></v-text-field>
            <v-text-field
              label="Correo electrónico"
              clearable
              prepend-icon="mdi-at"
              v-model="email"
              clear-icon="mdi-close-circle"
            ></v-text-field>
          </v-col>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="addEmployee"> Agregar </v-btn>
            <v-btn color="red" text @click="cancelDialog"> Cancelar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogAsistencias" persistent width="800">
        <v-card align="center">
          <v-card-title class="headline primary lighten-3">
            Buscar asistencias
          </v-card-title>
          <v-col cols="10">
            <v-textarea
              clearable
              no-resize
              rows="1"
              ref="focus"
              auto-grow
              clear-icon="mdi-close-circle"
              label="Escanee QR"
              prepend-icon="mdi-qrcode-scan"
              v-model="qr"
              @keypress.enter="searchChecks"
            ></v-textarea>
            <v-text-field
              label="Número de teléfono"
              placeholder="10 dígitos"
              v-model="searchPhone"
              prepend-icon="mdi-phone"
              clearable
              clear-icon="mdi-close-circle"
            ></v-text-field>
          </v-col>
          <v-col cols="10">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              @click="$refs.menu.save(day)"
              :return-value.sync="day"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="day"
                  label="Día"
                  prepend-icon="mdi-calendar"
                  readonly
                  clearable
                  clear-icon="mdi-close-circle"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="day" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancelar
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(day)">
                  Listo
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-btn color="primary" @click="searchChecks"> Buscar </v-btn>
          <v-simple-table class="ma-3" v-show="asistencias.length != 0">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in asistencias" :key="i">
                  <td>
                    {{ item.name }}
                  </td>
                  <td>
                    {{ item.phone }}
                  </td>
                  <td>
                    {{ item.checkIn }}
                  </td>
                  <td>
                    {{ item.checkOut }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              plain
              @click="
                [
                  (dialogAsistencias = false),
                  (day = ''),
                  (searchPhone = ''),
                  (asistencias = []),
                ]
              "
              >Cerrar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-bottom-navigation>
    <div class="text-center"></div>
  </v-container>
</template>

<script>
import moment from "moment";
import vCard from "vcard-js";
import axios from "axios";
import config from "../config/config";
import Swal from "sweetalert2";
// import MaskedInput from "vue-text-mask";

moment.locale("es-mx");

export default {
  components: {
    // MaskedInput
  },
  created() {
    this._setInterval();
    // this.$refs.focus.focus();
  },
  computed: {
    endVcard() {
      return this.vcard.includes("END:VCARD");
    },
    endQR() {
      return this.qr.includes("END:VCARD");
    },
  },
  data: () => ({
    menu: false,
    fecha: "",
    img: null,
    vcard: "",
    qr: "",
    dialog: false,
    dialogAsistencias: false,
    filePhoto: [],
    loadCheckIn: false,
    loadCheckOut: false,
    day: "",
    name: "",
    asistencias: [],
    email: "",
    telefono: "",
    phone: "",
    searchPhone: "",
    status: true,
    campos: ["Nombre", "Teléfono", "E-mail", "Entrada", "Salida"],
    values: [],
  }),
  methods: {
    play() {
      return this.$refs.audioAlert.play();
    },
    _setInterval() {
      setInterval(this.setTime, 100);
    },
    setTime() {
      this.fecha = moment().format("LLLL:ss");
    },
    async checkIn() {
      this.loadCheckIn = true;
      let data = {
        name: this.values[0],
        phone: this.values[1],
        checkIn: moment().format(),
      };
      // this.values[3] = moment().format("HH:mm:ss");
      await axios
        .post(`${config.api}/asistencia`, {
          data,
        })
        .then((res) => {
          if (res.data.asist) {
            Swal.fire({
              title: "¡Hecho!",
              text: `Hora de entrada a las ${this.values[3]} registrada con éxito.`,
              icon: "success",
              timer: 1200,
              showConfirmButton: false,
            }).then(() => {
              this.values[3] = moment(res.data.asist.checkIn).format(
                "HH:mm:ss"
              );
              this.loadCheckIn = false;
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "¡Error!",
            text: `Algo pasó durante la transacción.`,
            icon: "error",
          }).then(() => {
            this.loadCheckIn = false;
          });
        });
    },
    async checkOut() {
      this.loadCheckOut = true;
      let data = {
        name: this.values[0],
        phone: this.values[1],
        checkOut: moment().format(),
      };
      console.log(data.checkOut);
      await axios
        .post(`${config.api}/asistencia`, {
          data,
        })
        .then((res) => {
          if (res.data.asist) {
            Swal.fire({
              title: "¡Hecho!",
              text: `Hora de entrada a las ${this.values[3]} registrada con éxito.`,
              icon: "success",
              timer: 1200,
              showConfirmButton: false,
            }).then(() => {
              this.values[4] = moment(res.data.asist.checkOut).format(
                "HH:mm:ss"
              );
              this.loadCheckOut = false;
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "¡Error!",
            text: `Algo pasó durante la transacción.`,
            icon: "error",
          }).then(() => {
            this.loadCheckOut = false;
          });
        });
    },
    async searchChecks() {
      let phone = null;
      if (!this.qr) {
        if (!this.searchPhone)
          return Swal.fire({
            title: "¡Aguas!",
            text: "Debes seleccionar un teléfono o escanear el código QR.",
            icon: "info",
          });
        else {
          phone = this.searchPhone;
        }
      } else {
        if (this.endQR) {
          this.qr = this.qr.split("\n");
          let temp = this.qr.join(vCard.EOL);
          temp = vCard.parse(temp);
          phone = temp[0]["items"][5].value;
          this.qr = "";
        }
      }
      if (!this.day)
        return Swal.fire({
          title: "¡Aguas!",
          text: "Debes seleccionar una fecha.",
          icon: "info",
        });
      let day = this.day;
      await axios
        .get(`${config.api}/asistencia`, {
          params: {
            phone,
            day,
          },
        })
        .then((res) => {
          if (res.data.asistencia.length == 0)
            return Swal.fire({
              title: "¡Oops!",
              text: "No se encontraron registros.",
              icon: "info",
              timer: 1200,
              showConfirmButton: false,
            });
          this.asistencias = res.data.asistencia.map((el) => {
            return {
              name: el.name,
              phone: el.phone,
              checkIn: el.checkIn ? moment(el.checkIn).format("HH:mm:ss") : "",
              checkOut: el.checkOut
                ? moment(el.checkOut).format("HH:mm:ss")
                : "",
            };
          });
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
          return Swal.fire(
            "¡Error!",
            "Ocurrió un error durante la búsqueda.",
            "error"
          );
        });
    },
    cancelDialog() {
      this.dialog = false;
      this.name = "";
      this.email = "";
      this.telefono = "";
      this.filePhoto = [];
    },
    async searchByPhone() {
      let phone = this.phone;
      if(!phone)
        return Swal.fire('', 'Primero ingresa un número de teléfono.', 'info')
      await axios
        .get(`${config.api}/empleado`, {
          // phone:
          params: {
            phone,
          },
        })
        .then((res) => {
          if (res.data.message) {
            this.play();
            Swal.fire("¡Atención!", `${res.data.message}`, "warning");
          } else if (res.data.empleado) {
            // if (res.data.empleado) {
            //   Swal.fire({
            //     icon: "success",
            //     title: "¡Hecho!",
            //     text: `Empleado ${res.data.empleado[0].name}`,
            //     timer: 1000,
            //     showConfirmButton: false,
            //     position: "top-end",
            //   });
            // }
            this.values[0] = res.data.empleado[0].name || "";
            this.values[1] = res.data.empleado[0].phone || "";
            this.values[2] = res.data.empleado[0].email || "";
            this.img = res.data.empleado[0].photo
              ? encodeURI(
                  `${config.api}/img?photo=${res.data.empleado[0].photo}`
                )
              : "";
            this.status = res.data.empleado[0].status || "";
          }
        })
        .catch((err) => {
          console.log(err);
          Swal.fire("¡Error!", "Algo ocurrió en la petición.", "error");
        });
    },
    async searchEmployee() {
      // this.$refs.focus.focus();
      if (this.endVcard) {
        this.vcard = this.vcard.split("\n");
        let temp = this.vcard.join(vCard.EOL);
        temp = vCard.parse(temp);
        let phone = temp[0]["items"][5].value;
        this.vcard = "";
        await axios
          .get(`${config.api}/empleado`, {
            // phone:
            params: {
              phone,
            },
          })
          .then((res) => {
            if (res.data.message) {
              this.play();
              return Swal.fire("Atención", `${res.data.message}`, "warning");
            }
            if (res.data.empleado) {
              Swal.fire({
                icon: "success",
                title: "¡Hecho!",
                text: `Empleado ${res.data.empleado[0].name}`,
                timer: 1000,
                showConfirmButton: false,
                position: "top-end",
              }).then((res) => (this.vcard = null));
              this.values[0] = res.data.empleado[0].name || "";
              this.values[1] = res.data.empleado[0].phone || "";
              this.values[2] = res.data.empleado[0].email || "";
              this.img = res.data.empleado[0].photo
                ? encodeURI(
                    `${config.api}/img?photo=${res.data.empleado[0].photo}`
                  )
                : "";
              this.status = res.data.empleado[0].status || "";
              // this.values[3] = moment().format("HH:mm:ss");
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire("¡Error!", "Algo ocurrió en la petición.", "error");
          });
      }
    },
    async addEmployee() {
      if (this.filePhoto.length < 1)
        return Swal.fire({
          title: "Sin archivo",
          text: "Por favor, seleccione una foto.",
          icon: "info",
        });
      Swal.fire({
        title: "¿Los datos están correctos?",
        text: "Se subirán los datos.",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Crear",
        cancelButtonText: "Cancelar",
      }).then(async (res) => {
        if (res.value) {
          let formData = new FormData();
          formData.append("filePhoto", this.filePhoto);
          formData.append("phone", this.telefono);
          let data = {
            name: this.name,
            phone: this.telefono,
            email: this.email,
            status: true,
          };
          await axios
            .post(`${config.api}/empleado`, {
              data,
            })
            .then(async (res) => {
              if (res.data.ok)
                await axios
                  .post(
                    `${config.api}/upload`,
                    formData,
                    {},
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  )
                  .then((res) => {
                    if (res.data.ok)
                      return Swal.fire({
                        title: "¡Hecho!",
                        text: res.data.message,
                        icon: "success",
                        timer: 1200,
                        showConfirmButton: false,
                      }).then((res) => {
                        this.dialog = false;
                        this.name = "";
                        this.email = "";
                        this.telefono = "";
                        this.filePhoto = [];
                      });
                  })
                  .catch((error) => {
                    if (error.response) {
                      if (error.response.status === 500)
                        Swal.fire({
                          title: "Hubo un error al subir al empleado.",
                          icon: "warning",
                          confirmButtonText: "Aceptar",
                        }).then((res) => {
                          this.dialog = false;
                          this.name = "";
                          this.email = "";
                          this.telefono = "";
                          this.filePhoto = [];
                        });
                    }
                  });
              // return Swal.fire('¡Error!', 'Algo salió mal durante la transacción.', 'error')
              // .then(res => {
              //         this.dialog = false;
              //         this.name = '';
              //         this.email = '';
              //         this.telefono = '';
              //         this.filePhoto = [];
              //       });
            });
        }
      });
    },
  },
};
</script>
