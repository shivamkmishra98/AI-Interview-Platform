// Placeholder for future STT / TTS external API integrations (e.g., ElevenLabs, Whisper)
// Currently, frontend Web Speech API is handling the core generation to maintain a free tier.

exports.generateAudio = async (text, voiceId) => {
  // Example integration structure for ElevenLabs
  /*
  const axios = require('axios');
  const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    text: text,
    model_id: "eleven_monolingual_v1",
    voice_settings: { stability: 0.5, similarity_boost: 0.5 }
  }, {
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }
  });
  return response.data; // audio buffer
  */
  
  return null; 
};

exports.transcribeAudio = async (audioBuffer) => {
  // Example integration structure for Deepgram / Whisper
  return "Mock transcription. Please use Web Speech API on the client for live transcription.";
};
