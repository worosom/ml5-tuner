export default {
  data() {
    return {
      inputs: [{deviceId: "default"}]
    }
  },
  mounted() {
    this.updateInputs()
  },
  methods: {
    async enumerateInputs() {
      const devices = await navigator.mediaDevices.enumerateDevices()
      return devices.filter((d) => d.kind === 'audioinput')
    },
    updateInputs() {
      this.enumerateInputs().then((inputs) => {
        this.inputs = inputs
      })
    }
  },
  computed: {
    tuning: {
      get() {
        const stored_tuning = window.localStorage.getItem('tuning')
        if (!stored_tuning) {
          this.tuning = 440;
          return 440
        }
        return stored_tuning
      },
      set(value) {
        window.localStorage.setItem('tuning', value)
      }
    },
    input: {
      get() {
        const stored_input = window.localStorage.getItem('input')
        if (!stored_input || stored_input === 'undefined') {
          this.input = this.inputs[0].deviceId;
          return this.inputs[0].deviceId
        }
        return stored_input
      },
      set(value) {
        window.localStorage.setItem('input', value)
      }
    }
  }
}
