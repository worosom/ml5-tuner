import ml5 from 'ml5';
import Settings from '../../components/settings'

const modelUrl = 'https://raw.githubusercontent.com/ml5js/ml5-examples/master/p5js/PitchDetection/PitchDetection_Game/model/',
  midiToFreq = (m, tuning) => m === 0 || (m > 0 && m < 128) ? Math.pow(2, (m - 69) / 12) * (tuning ? tuning : 440) : null,
  freqToMidi = (f, tuning) => Math.round(12 * Math.log(f / (tuning ? tuning : 440)) / Math.log(2) ) + 69,
  cents = (f1, f2) => 1200 * Math.log2(f2 / f1);

const generateNotes = (tuning) => {
  const notes = [],
    scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  for (let i = 0; i < 128; i++ ) {
    notes.push({
      note: scale[i % scale.length],
      octave: Math.round(i / 12) - 2,
      frequency: midiToFreq(i, tuning)
    })
  }
  return notes;
}

export default {
  components: {
    Settings
  },
  data() {
    const tuning = window.localStorage.getItem('tuning'),
      notes = generateNotes(tuning);
    return {
      loading: true,
      notes,
      frequency: Math.round(notes[69].frequency * 100) / 100,
      tuning
    }
  },
  methods: {
    async init(deviceId) {
      this.audioContext = new AudioContext();
      this.microphoneStream = await this.mic(deviceId);
      if (this.microphoneStream) this.startPitch();
    },
    mic(deviceId) {
      if (navigator.mediaDevices) {
        return navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: deviceId ? deviceId : 'default'
          }
        });
      } else {
        // eslint-disable-next-line
        console.log('This browser does not support WebAudio')
      }
    },
    startPitch() {
      this.pitch = ml5.pitchDetection(modelUrl,
        this.audioContext,
        this.microphoneStream,
        this.modelLoaded);
    },
    modelLoaded() {
      this.$emit('loaded');
      this.getPitch();
    },
    getPitch() {
      this.pitch.getPitch((err, freq) => {
        if (freq) {
          this.frequency = Math.round(freq * 100) / 100;
        }
        this.getPitch();
      })
    },
    tuningChange(value) {
      this.tuning = value
      this.notes = generateNotes(this.tuning)
      this.frequency = Math.round(this.notes[69].frequency * 100) / 100
    },
    async inputChange(deviceId) {
      this.init(deviceId)
    },
    draw() {
      document.getElementById('gauge').setAttribute('style', `transform: translate3d(${-this.cent/3}%, 0, 0)`)
      window.requestAnimationFrame(this.draw);
    }
  },
  computed: {
    tuned() {
      if (Math.abs(this.cent) < 5)
        return 'tuned';
      else if (this.cent < 0)
        return 'low';
      else
        return 'high';
    },
    midiNum() { return freqToMidi(this.frequency, this.tuning) },
    note() { return this.notes[this.midiNum] },
    octave() { return this.note.octave },
    cent() {
      return cents(this.note.frequency, this.frequency)
    }
  },
  mounted() {
    this.init(window.localStorage.getItem('input'));
    window.requestAnimationFrame(this.draw);
  }
}
