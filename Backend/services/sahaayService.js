import pkg from "natural";
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = pkg;


import { HAPPY_EMOJIS, SAD_EMOJIS, NEUTRAL_EMOJIS } from '../constants/emojis.js';

const tokenizer = new WordTokenizer();
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');




// Crisis keywords that require immediate attention
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end it all', 'want to die', 'end my life',
  'can\'t go on', 'no way out', 'better off dead', 'ending everything', 'end everything',
  'kill me', 'die', 'I want to die'
];

// Words that indicate distress
const DISTRESS_WORDS = [
  'overwhelmed', "can't cope", 'anxious', 'panic', 'scared', 'terrified',
  'hopeless', 'helpless', 'worthless', 'alone', 'trapped', 'stuck'
];

// CBT cognitive distortions
const COGNITIVE_DISTORTIONS = {
  allOrNothing: ['always', 'never', 'every', 'all', 'none', 'everyone', 'no one'],
  overgeneralization: ['always', 'never', 'every', 'all the time'],
  mentalFilter: ['but', 'although', 'however'],
  disqualifyingPositive: ['but', 'although', 'however'],
  jumpingToConclusions: ['must be', 'obviously', 'clearly', 'definitely'],
  emotionalReasoning: ['feel like', 'i feel that', 'i sense that'],
  shouldStatements: ['should', 'must', 'ought', 'have to', 'need to'],
  labeling: ['i am a', 'he is a', 'she is a', 'they are', 'you are a'],
  personalization: ['my fault', 'i caused', 'because of me', 'i should have']
};

// DBT skills library
const DBT_SKILLS = {
  distressTolerance: {
    tip: [
      'Temperature: Try holding an ice cube or splashing cold water on your face',
      'Intense Exercise: Do some jumping jacks or run in place for 30 seconds',
      'Paced Breathing: Breathe in for 4, hold for 4, out for 6, pause for 2. Repeat.'
    ],
    selfSoothe: [
      'Engage your senses: Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste',
      'Use comforting touch: Try giving yourself a gentle hug or placing a hand over your heart',
      'Look at something beautiful: Find something visually pleasing to focus on'
    ],
    improve: [
      'Do something that makes you feel competent or in control',
      'Engage in a meaningful activity, even if briefly',
      'Practice radical acceptance of the current moment'
    ]
  },
  emotionRegulation: {
    checkTheFacts: [
      'What is the emotion I am feeling?',
      'What event triggered this emotion?',
      'What are my thoughts about this situation?',
      'Am I assuming a threat? What\'s the evidence?',
      'What\'s another way to look at this?'
    ],
    oppositeAction: [
      'Identify the emotion and its action urge',
      'Identify the opposite action',
      'Do the opposite action all the way',
      'Repeat until the emotion changes'
    ]
  },
  mindfulness: {
    observe: [
      'Notice your breath without trying to change it',
      'Pay attention to the sensations in your body',
      'Observe your thoughts like clouds passing in the sky'
    ],
    describe: [
      'Put words to your experience without judgment',
      'Use \'I notice...\' statements',
      'Stick to the facts'
    ],
    participate: [
      'Throw yourself completely into the present moment',
      'Fully engage in what you\'re doing right now',
      'Let go of self-consciousness'
    ]
  }
};

// Analyze the emotional tone of a message
export const analyzeTone = (message) => {
  try {
    const tokens = tokenizer.tokenize(message.toLowerCase()) || [];
    const sentiment = analyzer.getSentiment(tokens);

    // Simple emotion detection based on keywords and sentiment
    let primaryEmotion = 'neutral';
    let secondaryEmotion = null;

    // FORCE NEGATIVE SENTIMENT if any crisis or distress words are present
    // This overrides positive words like "like", "love", "great"
    const lowerMessage = message.toLowerCase();
    if (CRISIS_KEYWORDS.some(k => lowerMessage.includes(k)) ||
      DISTRESS_WORDS.some(w => lowerMessage.includes(w))) {
      sentiment = -2; // Force highly negative
    }

    if (sentiment > 0.5) {
      primaryEmotion = 'happy';
    } else if (sentiment < -0.5) {
      primaryEmotion = 'sad';
    }

    // Check for specific emotional words
    // variable 'lowerMessage' is already declared above
    if (/(anxio|worry|nervous|scared|fear)/.test(lowerMessage)) {
      secondaryEmotion = secondaryEmotion || 'anxious';
    }
    if (/(angry|frustrat|annoy|irritat|mad)/.test(lowerMessage)) {
      secondaryEmotion = secondaryEmotion || 'angry';
    }
    if (/(sad|depress|hopeless|worthless)/.test(lowerMessage)) {
      secondaryEmotion = secondaryEmotion || 'sad';
    }

    return {
      score: Math.round((sentiment + 5) * 1.25), // Convert to 1-10 scale
      primaryEmotion,
      secondaryEmotion,
      tokens
    };
  } catch (error) {
    console.error('Error analyzing tone:', error);
    return {
      score: 5,
      primaryEmotion: 'neutral',
      secondaryEmotion: null,
      tokens: []
    };
  }
};

// Detect distress level from message content
export const detectDistressLevel = (message, toneAnalysis) => {
  const lowerMessage = message.toLowerCase();

  // Check for crisis keywords (Level 4)
  if (CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 4; // Crisis
  }

  // Check for high distress words and phrases (Level 3)
  const highDistressWords = ['overwhelmed', 'can\'t cope', 'panic', 'terrified', 'hopeless'];
  if (highDistressWords.some(word => lowerMessage.includes(word)) || toneAnalysis.score <= 2) {
    return 3; // High
  }

  // Check for moderate distress (Level 2)
  if (DISTRESS_WORDS.some(word => lowerMessage.includes(word)) || toneAnalysis.score <= 4) {
    return 2; // Moderate
  }

  // Default to mild distress (Level 1)
  return 1; // Mild
};

// Identify cognitive distortions in the message
const identifyCognitiveDistortions = (tokens) => {
  const distortions = [];
  const text = tokens.join(' ').toLowerCase();

  for (const [type, triggers] of Object.entries(COGNITIVE_DISTORTIONS)) {
    if (triggers.some(trigger => {
      // Use word boundary regex for whole word matching
      const regex = new RegExp(`\\b${trigger}\\b`, 'i');
      return regex.test(text);
    })) {
      distortions.push(type);
    }
  }

  return distortions;
};

// Generate a response based on the message and distress level
export const generateResponse = async (message, distressLevel, messageHistory) => {
  const tone = analyzeTone(message);
  const tokens = tokenizer.tokenize(message.toLowerCase()) || [];
  const cognitiveDistortions = identifyCognitiveDistortions(tokens);

  // Base response structure
  let response = {
    text: '',
    interventionType: 'general',
    requiresFollowUp: false
  };

  // Add validation and normalization
  response.text += getValidationStatement(tone);

  // Choose intervention based on distress level
  switch (distressLevel) {
    case 4: // Crisis
      response.text += '\n\nI want you to know that you\'re not alone. What you\'re experiencing sounds very painful, and I\'m here with you. ';
      response.text += 'I want to make sure you\'re safe. Could you tell me if you have a plan to harm yourself?';
      response.text += '\n\nIf you\'re in immediate danger, please call emergency services or go to your nearest emergency room. ';
      response.text += 'You can also contact a crisis hotline for immediate support.';
      response.interventionType = 'crisis';
      response.requiresFollowUp = true;
      break;

    case 3: // High distress - use DBT skills
      response.text += '\n\nI can hear how much pain you\'re in right now. Let\'s try to ground ourselves together. ';
      response.text += 'First, can you take a slow breath with me? Breathe in for 4... hold for 4... and out for 6...';
      response.text += '\n\n' + getRandomSkill('distressTolerance');
      response.interventionType = 'DBT';
      break;

    case 2: // Moderate distress - explore thoughts and feelings
      if (cognitiveDistortions.length > 0) {
        response.text += '\n\nI notice you might be experiencing a thought pattern called ' +
          formatCognitiveDistortion(cognitiveDistortions[0]) + '. ';
        response.text += 'Would you be open to exploring that thought a bit more?';
        response.interventionType = 'CBT';
      } else {
        response.text += '\n\nCould you tell me more about what\'s been on your mind?';
        response.text += ' Sometimes putting feelings into words can help us understand them better.';
      }
      break;

    case 1: // Mild distress - general support
    default:
      response.text += '\n\nThank you for sharing that with me. ';
      response.text += 'Would you like to explore this further, or is there something specific you\'d like help with today?';
      break;
  }

  // Add appropriate emoji based on tone
  response.text = addEmoji(response.text, tone.primaryEmotion);

  return response;
};

// Helper function to get a random DBT skill
const getRandomSkill = (category) => {
  const skills = DBT_SKILLS[category];
  const randomCategory = Object.keys(skills)[Math.floor(Math.random() * Object.keys(skills).length)];
  const skillList = skills[randomCategory];
  return skillList[Math.floor(Math.random() * skillList.length)];
};

// Helper function to format cognitive distortion for display
const formatCognitiveDistortion = (distortion) => {
  return distortion
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^./, str => str.toUpperCase());
};

// Helper function to add validation statement
const getValidationStatement = (tone) => {
  const validations = [
    `I hear how ${tone.primaryEmotion} you're feeling right now.`,
    `It makes sense that you'd feel that way.`,
    `I can see why you'd feel ${tone.primaryEmotion} about this.`,
    `That sounds really ${tone.primaryEmotion}.`,
    `I can feel the ${tone.primaryEmotion} in your words.`
  ];

  if (tone.primaryEmotion === 'neutral') {
    return "I'm listening. Please go on.";
  }

  return validations[Math.floor(Math.random() * validations.length)];
};

// Helper function to add appropriate emoji
const addEmoji = (text, emotion) => {
  let emoji = '';

  switch (emotion) {
    case 'happy':
      emoji = HAPPY_EMOJIS[Math.floor(Math.random() * HAPPY_EMOJIS.length)];
      break;
    case 'sad':
      emoji = SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)];
      break;
    default:
      emoji = NEUTRAL_EMOJIS[Math.floor(Math.random() * NEUTRAL_EMOJIS.length)];
  }

  return `${text} ${emoji}`;
};
