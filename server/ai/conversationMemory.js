const MAX_HISTORY_PER_USER = 15;

class ConversationMemory {
  constructor() {
    this.store = new Map();
  }

  push(userId, turn) {
    const key = String(userId || "anon");
    if (!this.store.has(key)) this.store.set(key, []);
    const arr = this.store.get(key);
    arr.push({ ...turn, ts: Date.now() });
    while (arr.length > MAX_HISTORY_PER_USER) arr.shift();
    return arr.slice();
  }

  get(userId) {
    const key = String(userId || "anon");
    return this.store.get(key) || [];
  }

  getState(userId) {
    const hist = this.get(userId);
    const recent = hist.slice(-8);
    const topics = new Set();
    let beginnerHits = 0;
    const rwTokens = ["ni ", " na ", " ya ", " ku ", " mu ", " sinumva", " nta", " neza", " cyane"];
    let rwCount = 0;
    let enCount = 0;
    for (const h of recent) {
      const t = String(h.content || "").toLowerCase();
      if (/(beginner|newbie|first time|new to|i don'?t understand|sinumva|ntabwo|kwiga|mushya)/i.test(t)) beginnerHits++;
      for (const tk of rwTokens) if (t.includes(tk)) rwCount++;
      if (/\b(the|is|are|you|i|to|a|an|of|and|in|on|for|with|what|how|when|where|why)\b/.test(t)) enCount++;
      if (/(stop|sign|road|traffic|drive|speed|park|turn|lane|right of way|give way|yield|pedestrian|crossing|seat.?belt|brake|light|exam|test|quiz|permit|license|icyapa|umuvuduko|gupaka|guhagarara|kwanyuranaho|isangano|inkomane|rond.point|abanyamaguru|amatara|feri|igitiri|umurobe|ikizamini|permi|gutwara|kwiga)/i.test(t))
        topics.add(/icyapa|road ?sign|sign\b/i.test(t) ? "road_signs" : /umuvuduko|speed|vitesse|km\/h|kirometero/i.test(t) ? "speed_limits" : /gupaka|park|guhagarara|stop/i.test(t) ? "parking_stopping" : /kwanyuranaho|overtake|pass/i.test(t) ? "overtaking" : /isangano|inkomane|rond\.point|roundabout|intersection|junction|right of way|yield|give way|priority/i.test(t) ? "right_of_way" : /amatara|traffic light|light\b/i.test(t) ? "traffic_lights" : /abanyamaguru|pedestrian|crossing|zebra/i.test(t) ? "pedestrians" : /umutekano|safety|accident|crash|collision|impanuka|defensive|reckless/i.test(t) ? "road_safety" : /feri|brake|ivugapfe|gear|embrayage|clutch|mote|kit|accélérateur|seatbelt|igitiri|umurobe|starting|start.*car|kutangira.*modoka/i.test(t) ? "vehicle_controls" : /ikizamini|exam|test|quiz|question|practice|provisoire|amahugurwa/i.test(t) ? "exam_mode" : "general");
    }
    return {
      historyLength: hist.length,
      recentTopics: Array.from(topics),
      languagePreference: rwCount > enCount ? "rw" : rwCount === enCount ? "mixed" : "en",
      userAppearsBeginner: beginnerHits >= 1,
      lastMessages: recent.map(m => ({ role: m.role, content: m.content }))
    };
  }

  clear(userId) {
    const key = String(userId || "anon");
    this.store.delete(key);
  }
}

export const conversationMemory = new ConversationMemory();
