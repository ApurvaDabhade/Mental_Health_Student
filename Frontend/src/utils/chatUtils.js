// Format message timestamp
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Get message bubble style based on sender
export const getMessageStyle = (sender) => {
  const baseStyle = 'max-w-[80%] p-4 rounded-2xl mb-2 break-words';
  
  switch(sender) {
    case 'user':
      return `${baseStyle} bg-blue-100 text-blue-900 self-end`;
    case 'bot':
      return `${baseStyle} bg-green-50 text-gray-800 self-start`;
    case 'system':
      return `${baseStyle} bg-yellow-50 text-yellow-800 text-sm self-center text-center`;
    default:
      return baseStyle;
  }
};

// Get distress level text and emoji
export const getDistressLevelInfo = (level) => {
  switch(level) {
    case 1:
      return { text: 'Calm', emoji: '😊', color: 'bg-green-100 text-green-800' };
    case 2:
      return { text: 'Mild Stress', emoji: '😐', color: 'bg-blue-100 text-blue-800' };
    case 3:
      return { text: 'High Stress', emoji: '😟', color: 'bg-yellow-100 text-yellow-800' };
    case 4:
      return { text: 'Crisis', emoji: '🚨', color: 'bg-red-100 text-red-800' };
    default:
      return { text: 'Neutral', emoji: '😐', color: 'bg-gray-100 text-gray-800' };
  }
};

// Get intervention type display text
export const getInterventionTypeText = (type) => {
  switch(type) {
    case 'CBT':
      return 'Cognitive Behavioral Technique';
    case 'DBT':
      return 'Dialectical Behavior Technique';
    case 'grounding':
      return 'Grounding Exercise';
    case 'crisis':
      return 'Crisis Support';
    default:
      return 'Supportive Response';
  }
};

// Check if message contains crisis keywords
export const checkForCrisisKeywords = (text) => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'want to die', 'end my life',
    'can\'t go on', 'no way out', 'better off dead', 'harm myself'
  ];
  
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
};

// Get appropriate emoji for different emotions
export const getEmojiForEmotion = (emotion) => {
  const emojiMap = {
    happy: '😊',
    sad: '😔',
    angry: '😠',
    anxious: '😰',
    neutral: '😐',
    love: '❤️',
    laugh: '😂',
    surprised: '😮',
    confused: '😕',
    excited: '😃',
    tired: '😴',
    sick: '🤒',
    celebrate: '🎉',
    thinking: '🤔',
    wave: '👋',
    heart: '💖',
    star: '⭐',
    fire: '🔥',
    thumbsup: '👍',
    flower: '🌸',
    leaf: '🍃',
    sun: '☀️',
    rainbow: '🌈',
    sparkles: '✨',
    star2: '🌟',
    heart_eyes: '😍',
    relieved: '😌',
    blush: '😊',
    crying: '😢',
    scream: '😱',
    cold_sweat: '😰',
    weary: '😩',
    sob: '😭',
    triumph: '😤',
    rage: '😡',
    confused2: '😕',
    neutral_face: '😐',
    no_mouth: '😶',
    hushed: '😯',
    innocent: '😇',
    sunglasses: '😎',
    smirk: '😏',
    expressionless: '😑',
    unamused: '😒',
    sweat_smile: '😅',
    joy: '😂',
    rofl: '🤣',
    sleepy: '😪',
    sleeping: '😴',
    mask: '😷',
    face_with_thermometer: '🤒',
    face_with_head_bandage: '🤕',
    nauseated_face: '🤢',
    face_vomiting: '🤮',
    sneezing_face: '🤧',
    hot_face: '🥵',
    cold_face: '🥶',
    woozy_face: '🥴',
    zany_face: '🤪',
    shushing_face: '🤫',
    lying_face: '🤥',
    face_with_hand_over_mouth: '🤭',
    face_with_monocle: '🧐',
    clown_face: '🤡',
    nerd_face: '🤓',
    robot: '🤖',
    alien: '👽',
    ghost: '👻',
    skull: '💀',
    skull_and_crossbones: '☠️',
    heart_eyes_cat: '😻',
    smiley_cat: '😺',
    smile_cat: '😸',
    joy_cat: '😹',
    heart_eyes_cat2: '😻',
    smirk_cat: '😼',
    kissing_cat: '😽',
    scream_cat: '🙀',
    crying_cat_face: '😿',
    pouting_cat: '😾',
    see_no_evil: '🙈',
    hear_no_evil: '🙉',
    speak_no_evil: '🙊',
    kiss: '💋',
    love_letter: '💌',
    heartbeat: '💓',
    broken_heart: '💔',
    two_hearts: '💕',
    sparkling_heart: '💖',
    heartpulse: '💗',
    cupid: '💘',
    blue_heart: '💙',
    green_heart: '💚',
    yellow_heart: '💛',
    purple_heart: '💜',
    gift_heart: '💝',
    revolving_hearts: '💞',
    heart_decoration: '💟',
    diamond_shape_with_a_dot_inside: '💠',
    boom: '💥',
    anger: '💢',
    zzz: '💤',
    dash: '💨',
    sweat_drops: '💦',
    droplet: '💧',
    muscle: '💪',
    ear: '👂',
    eyes: '👀',
    nose: '👃',
    tongue: '👅',
    lips: '👄',
    thumbsup: '👍',
    thumbsdown: '👎',
    ok_hand: '👌',
    punch: '👊',
    fist: '✊',
    wave: '👋',
    hand: '✋',
    open_hands: '👐',
    point_up: '☝️',
    point_down: '👇',
    point_left: '👈',
    point_right: '👉',
    raised_hands: '🙌',
    pray: '🙏',
    clap: '👏',
    handshake: '🤝',
    nail_care: '💅',
    selfie: '🤳',
    muscle: '💪',
    mechanical_arm: '🦾',
    mechanical_leg: '🦿',
    leg: '🦵',
    foot: '🦶',
    ear_with_hearing_aid: '🦻',
    brain: '🧠',
    tooth: '🦷',
    bone: '🦴',
    eye: '👁️',
    tongue2: '👅',
    lips2: '👄',
    baby: '👶',
    child: '🧒',
    boy: '👦',
    girl: '👧',
    adult: '🧑',
    man: '👨',
    woman: '👩',
    older_adult: '🧓',
    old_man: '👴',
    old_woman: '👵',
    person_frowning: '🙍',
    person_pouting: '🙎',
    person_gesturing_no: '🙅',
    person_gesturing_ok: '🙆',
    person_tipping_hand: '💁',
    person_raising_hand: '🙋',
    person_bowing: '🙇',
    person_facepalming: '🤦',
    person_shrugging: '🤷',
    person_getting_massage: '💆',
    person_getting_haircut: '💇',
    person_walking: '🚶',
    person_standing: '🧍',
    person_kneeling: '🧎',
    person_running: '🏃',
    person_surfing: '🏄',
    person_swimming: '🏊',
    person_lifting_weights: '🏋️',
    person_biking: '🚴',
    person_mountain_biking: '🚵',
    person_cartwheeling: '🤸',
    person_juggling: '🤹',
    person_lotus_position: '🧘',
    person_in_steamy_room: '🧖',
    person_climbing: '🧗',
    person_in_lotus_position: '🧘',
    person_in_steamy_room2: '🧖',
    person_climbing2: '🧗',
    person_in_steamy_room3: '🧖',
    person_climbing3: '🧗',
    person_in_steamy_room4: '🧖',
    person_climbing4: '🧗',
    person_in_steamy_room5: '🧖',
    person_climbing5: '🧗',
    person_in_steamy_room6: '🧖',
    person_climbing6: '🧗',
    person_in_steamy_room7: '🧖',
    person_climbing7: '🧗',
    person_in_steamy_room8: '🧖',
    person_climbing8: '🧗',
    person_in_steamy_room9: '🧖',
    person_climbing9: '🧗',
    person_in_steamy_room10: '🧖',
    person_climbing10: '🧗',
  };

  return emojiMap[emotion] || '✨';
};
